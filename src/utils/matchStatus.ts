import type { Match, MatchStage, MatchStatus } from '../types'

export const deriveMatchStatus = (match: Match, now = new Date()): MatchStatus => {
  if (match.resultWinner) return 'COMPLETED'
  const start = new Date(match.startsAtUtc)
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000)
  if (now < start) return 'UPCOMING'
  if (now >= start && now <= end) return 'LIVE'
  return 'COMPLETED'
}

export const stageMultiplier = (stage: MatchStage): number => {
  switch (stage) {
    case 'QUARTERFINAL':
    case 'SEMIFINAL':
      return 2
    case 'FINAL':
      return 4
    default:
      return 1
  }
}
