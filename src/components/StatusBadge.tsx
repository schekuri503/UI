import type { MatchStatus } from '../types'

export const StatusBadge = ({ status }: { status: MatchStatus }) => {
  return <span className={`badge badge--${status.toLowerCase()}`}>{status}</span>
}
