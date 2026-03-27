export type MatchStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED'
export type MatchStage = 'LEAGUE' | 'QUARTERFINAL' | 'SEMIFINAL' | 'FINAL'

export interface AppUser {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  isAdmin?: boolean
}

export interface Match {
  id: string
  season: number
  startsAtUtc: string
  lockTimeUtc: string
  venue: string
  homeTeam: string
  awayTeam: string
  stage: MatchStage
  status?: MatchStatus
  resultWinner?: string | null
  createdAtUtc: string
  updatedAtUtc: string
}

export interface Prediction {
  id: string
  matchId: string
  season: number
  userId: string
  predictedWinner: string
  createdAtUtc: string
  updatedAtUtc: string
}

export interface MatchVoteCounts {
  homeTeamVotes: number
  awayTeamVotes: number
}

export interface LeaderboardEntry {
  userId: string
  displayName: string
  photoURL?: string
  totalPoints: number
  correctPicks: number
  wrongPicks: number
  skipsUsedLeague: number
  skipsUsedPlayoff: number
  rank: number
}

export interface UserSeasonStats {
  season: number
  userId: string
  skipsUsedLeague: number
  skipsRemainingLeague: number
  skipUsedPlayoff: boolean
  playoffSkipRemaining: number
}

export interface FirestoreConverter<T> {
  toFirestore: (value: T) => Record<string, unknown>
  fromFirestore: (value: Record<string, unknown>) => T
}
