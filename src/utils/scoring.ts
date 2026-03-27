import type { Match, Prediction } from '../types'
import { stageMultiplier } from './matchStatus'

export interface ScoreResult {
  points: number
  reason: 'RIGHT' | 'WRONG' | 'SKIP' | 'MISSED'
}

export const LEAGUE_SKIP_MAX = 15
export const PLAYOFF_SKIP_MAX = 1

export const canEditPrediction = (match: Match, now = new Date()): boolean => {
  const lock = new Date(match.lockTimeUtc)
  return now < lock
}

export const computeScoreForPrediction = (
  match: Match,
  userPrediction: Prediction | undefined,
  winnersCount: number,
  losersCount: number,
  skipsUsedLeague: number,
  playoffSkipUsed: boolean,
): { result: ScoreResult; nextLeagueSkipsUsed: number; nextPlayoffSkipUsed: boolean } => {
  if (!match.resultWinner) {
    return {
      result: { points: 0, reason: 'MISSED' },
      nextLeagueSkipsUsed: skipsUsedLeague,
      nextPlayoffSkipUsed: playoffSkipUsed,
    }
  }

  if (!userPrediction) {
    if (match.stage === 'LEAGUE') {
      if (skipsUsedLeague < LEAGUE_SKIP_MAX) {
        return {
          result: { points: 0, reason: 'SKIP' },
          nextLeagueSkipsUsed: skipsUsedLeague + 1,
          nextPlayoffSkipUsed: playoffSkipUsed,
        }
      }
      return {
        result: { points: -1, reason: 'MISSED' },
        nextLeagueSkipsUsed: skipsUsedLeague,
        nextPlayoffSkipUsed: playoffSkipUsed,
      }
    }

    if (match.stage === 'FINAL') {
      return {
        result: { points: -1, reason: 'MISSED' },
        nextLeagueSkipsUsed: skipsUsedLeague,
        nextPlayoffSkipUsed: playoffSkipUsed,
      }
    }

    if (!playoffSkipUsed) {
      return {
        result: { points: 0, reason: 'SKIP' },
        nextLeagueSkipsUsed: skipsUsedLeague,
        nextPlayoffSkipUsed: true,
      }
    }

    return {
      result: { points: -1, reason: 'MISSED' },
      nextLeagueSkipsUsed: skipsUsedLeague,
      nextPlayoffSkipUsed: playoffSkipUsed,
    }
  }

  if (userPrediction.predictedWinner !== match.resultWinner) {
    return {
      result: { points: -1, reason: 'WRONG' },
      nextLeagueSkipsUsed: skipsUsedLeague,
      nextPlayoffSkipUsed: playoffSkipUsed,
    }
  }

  const safeWinners = winnersCount <= 0 ? 1 : winnersCount
  const base = losersCount / safeWinners
  const points = base * stageMultiplier(match.stage)

  return {
    result: { points, reason: 'RIGHT' },
    nextLeagueSkipsUsed: skipsUsedLeague,
    nextPlayoffSkipUsed: playoffSkipUsed,
  }
}
