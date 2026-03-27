import type { AppUser, LeaderboardEntry, Match, MatchVoteCounts, Prediction, UserSeasonStats } from '../types'
import { deriveMatchStatus } from '../utils/matchStatus'
import { canEditPrediction, computeScoreForPrediction, LEAGUE_SKIP_MAX, PLAYOFF_SKIP_MAX } from '../utils/scoring'

const MATCHES_KEY = 'ipl_predictor_matches'
const PREDICTIONS_KEY = 'ipl_predictor_predictions'

const nowIso = () => new Date().toISOString()

const initialMatches: Match[] = [
  {
    id: 'm1',
    season: 2026,
    startsAtUtc: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
    lockTimeUtc: new Date(Date.now() + 35 * 60 * 60 * 1000).toISOString(),
    venue: 'Wankhede Stadium',
    homeTeam: 'Mumbai Indians',
    awayTeam: 'Chennai Super Kings',
    stage: 'LEAGUE',
    resultWinner: null,
    createdAtUtc: nowIso(),
    updatedAtUtc: nowIso(),
  },
  {
    id: 'm2',
    season: 2026,
    startsAtUtc: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lockTimeUtc: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    venue: 'Eden Gardens',
    homeTeam: 'Kolkata Knight Riders',
    awayTeam: 'Rajasthan Royals',
    stage: 'LEAGUE',
    resultWinner: null,
    createdAtUtc: nowIso(),
    updatedAtUtc: nowIso(),
  },
]

const read = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key)
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

const write = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const getMatches = (): Match[] => read<Match[]>(MATCHES_KEY, initialMatches)
const getPredictions = (): Prediction[] => read<Prediction[]>(PREDICTIONS_KEY, [])

const assertAuthed = (user: AppUser | null): AppUser => {
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export const dataService = {
  async listSeasons(): Promise<number[]> {
    const seasons = [...new Set(getMatches().map((m) => m.season))]
    return seasons.sort((a, b) => b - a)
  },

  async getMatchesBySeason(season: number): Promise<Match[]> {
    return getMatches()
      .filter((m) => m.season === season)
      .map((m) => ({ ...m, status: deriveMatchStatus(m) }))
      .sort((a, b) => new Date(a.startsAtUtc).getTime() - new Date(b.startsAtUtc).getTime())
  },

  async getPrediction(matchId: string, userId: string): Promise<Prediction | undefined> {
    return getPredictions().find((p) => p.matchId === matchId && p.userId === userId)
  },

  async getVoteCounts(matchId: string): Promise<MatchVoteCounts> {
    const match = getMatches().find((m) => m.id === matchId)
    if (!match) return { homeTeamVotes: 0, awayTeamVotes: 0 }
    const votes = getPredictions().filter((p) => p.matchId === matchId)
    return {
      homeTeamVotes: votes.filter((v) => v.predictedWinner === match.homeTeam).length,
      awayTeamVotes: votes.filter((v) => v.predictedWinner === match.awayTeam).length,
    }
  },

  async upsertPrediction(user: AppUser | null, matchId: string, predictedWinner: string): Promise<void> {
    const currentUser = assertAuthed(user)
    const matches = getMatches()
    const match = matches.find((m) => m.id === matchId)
    if (!match) throw new Error('Match missing')
    if (!predictedWinner || (predictedWinner !== match.homeTeam && predictedWinner !== match.awayTeam)) {
      throw new Error('Invalid team selection')
    }
    if (!canEditPrediction(match)) throw new Error('Prediction locked')

    const predictions = getPredictions()
    const existingIdx = predictions.findIndex((p) => p.matchId === matchId && p.userId === currentUser.uid)
    if (existingIdx >= 0) {
      predictions[existingIdx] = { ...predictions[existingIdx], predictedWinner, updatedAtUtc: nowIso() }
    } else {
      predictions.push({
        id: `${matchId}_${currentUser.uid}`,
        matchId,
        season: match.season,
        userId: currentUser.uid,
        predictedWinner,
        createdAtUtc: nowIso(),
        updatedAtUtc: nowIso(),
      })
    }
    write(PREDICTIONS_KEY, predictions)
  },

  async undoPrediction(user: AppUser | null, matchId: string): Promise<void> {
    const currentUser = assertAuthed(user)
    const match = getMatches().find((m) => m.id === matchId)
    if (!match) throw new Error('Match missing')
    if (!canEditPrediction(match)) throw new Error('Prediction locked')

    const predictions = getPredictions().filter((p) => !(p.matchId === matchId && p.userId === currentUser.uid))
    write(PREDICTIONS_KEY, predictions)
  },

  async importSchedule(user: AppUser | null, rawJson: string): Promise<number> {
    const currentUser = assertAuthed(user)
    if (!currentUser.isAdmin) throw new Error('Admin required')

    const parsed = JSON.parse(rawJson) as Match[]
    const normalized = parsed.map((m) => ({ ...m, updatedAtUtc: nowIso(), createdAtUtc: m.createdAtUtc ?? nowIso() }))
    write(MATCHES_KEY, normalized)
    return normalized.length
  },

  async saveMatch(user: AppUser | null, match: Match): Promise<void> {
    const currentUser = assertAuthed(user)
    if (!currentUser.isAdmin) throw new Error('Admin required')

    const matches = getMatches()
    const index = matches.findIndex((m) => m.id === match.id)
    const next = { ...match, updatedAtUtc: nowIso(), createdAtUtc: match.createdAtUtc ?? nowIso() }
    if (index >= 0) {
      matches[index] = next
    } else {
      matches.push(next)
    }
    write(MATCHES_KEY, matches)
  },

  async deleteMatch(user: AppUser | null, matchId: string): Promise<void> {
    const currentUser = assertAuthed(user)
    if (!currentUser.isAdmin) throw new Error('Admin required')
    write(MATCHES_KEY, getMatches().filter((m) => m.id !== matchId))
    write(PREDICTIONS_KEY, getPredictions().filter((p) => p.matchId !== matchId))
  },

  async setResultWinner(user: AppUser | null, matchId: string, winner: string): Promise<void> {
    const currentUser = assertAuthed(user)
    if (!currentUser.isAdmin) throw new Error('Admin required')
    const matches = getMatches()
    const i = matches.findIndex((m) => m.id === matchId)
    if (i < 0) throw new Error('Match not found')
    matches[i] = { ...matches[i], resultWinner: winner, updatedAtUtc: nowIso() }
    write(MATCHES_KEY, matches)
  },

  async recomputeLeaderboard(season: number): Promise<LeaderboardEntry[]> {
    return this.getLeaderboard(season)
  },

  async getLeaderboard(season: number): Promise<LeaderboardEntry[]> {
    const matches = getMatches().filter((m) => m.season === season && m.resultWinner)
    const predictions = getPredictions().filter((p) => p.season === season)
    const byUser = new Map<string, LeaderboardEntry>()

    for (const match of matches) {
      const matchPredictions = predictions.filter((p) => p.matchId === match.id)
      const winnersCount = matchPredictions.filter((p) => p.predictedWinner === match.resultWinner).length
      const losersCount = matchPredictions.length - winnersCount

      const users = new Set(matchPredictions.map((p) => p.userId))
      users.add('demo-user')

      users.forEach((userId) => {
        const prev = byUser.get(userId) ?? {
          userId,
          displayName: userId === 'demo-user' ? 'Demo Friend' : userId,
          totalPoints: 0,
          correctPicks: 0,
          wrongPicks: 0,
          skipsUsedLeague: 0,
          skipsUsedPlayoff: 0,
          rank: 0,
        }
        const p = matchPredictions.find((candidate) => candidate.userId === userId)
        const score = computeScoreForPrediction(
          match,
          p,
          winnersCount,
          losersCount,
          prev.skipsUsedLeague,
          prev.skipsUsedPlayoff > 0,
        )

        prev.totalPoints += score.result.points
        if (score.result.reason === 'RIGHT') prev.correctPicks += 1
        if (score.result.reason === 'WRONG' || score.result.reason === 'MISSED') prev.wrongPicks += 1
        prev.skipsUsedLeague = score.nextLeagueSkipsUsed
        prev.skipsUsedPlayoff = score.nextPlayoffSkipUsed ? 1 : 0
        byUser.set(userId, prev)
      })
    }

    const sorted = [...byUser.values()].sort((a, b) => b.totalPoints - a.totalPoints)
    return sorted.map((entry, index) => ({ ...entry, rank: index + 1 }))
  },

  async getMyStats(user: AppUser | null, season: number): Promise<UserSeasonStats> {
    const currentUser = assertAuthed(user)
    const leaderboard = await this.getLeaderboard(season)
    const row = leaderboard.find((item) => item.userId === currentUser.uid)
    return {
      season,
      userId: currentUser.uid,
      skipsUsedLeague: row?.skipsUsedLeague ?? 0,
      skipsRemainingLeague: Math.max(0, LEAGUE_SKIP_MAX - (row?.skipsUsedLeague ?? 0)),
      skipUsedPlayoff: (row?.skipsUsedPlayoff ?? 0) > 0,
      playoffSkipRemaining: Math.max(0, PLAYOFF_SKIP_MAX - (row?.skipsUsedPlayoff ?? 0)),
    }
  },
}
