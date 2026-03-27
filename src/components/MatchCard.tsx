import type { Match, MatchVoteCounts } from '../types'
import { StatusBadge } from './StatusBadge'

interface MatchCardProps {
  match: Match
  votes: MatchVoteCounts
  selectedWinner?: string
  isLocked: boolean
  isBusy?: boolean
  onPredict?: (team: string) => void
  onUndo?: () => void
}

export const MatchCard = ({
  match,
  votes,
  selectedWinner,
  isLocked,
  isBusy = false,
  onPredict,
  onUndo,
}: MatchCardProps) => {
  const canChoose = !isLocked && !isBusy && Boolean(onPredict)
  return (
    <article className="card">
      <div className="card-head">
        <h3>
          {match.homeTeam} vs {match.awayTeam}
        </h3>
        {match.status ? <StatusBadge status={match.status} /> : null}
      </div>
      <p className="muted">{new Date(match.startsAtUtc).toLocaleString()} UTC • {match.venue} • {match.stage}</p>
      <div className="vote-row">
        <button disabled={!canChoose} className={selectedWinner === match.homeTeam ? 'selected' : ''} onClick={() => onPredict?.(match.homeTeam)}>
          {match.homeTeam} ({votes.homeTeamVotes})
        </button>
        <button disabled={!canChoose} className={selectedWinner === match.awayTeam ? 'selected' : ''} onClick={() => onPredict?.(match.awayTeam)}>
          {match.awayTeam} ({votes.awayTeamVotes})
        </button>
      </div>
      <div className="card-foot">
        {selectedWinner ? <span>Your pick: {selectedWinner}</span> : <span>No prediction yet</span>}
        <button disabled={isLocked || isBusy || !selectedWinner} onClick={onUndo}>
          Undo
        </button>
      </div>
    </article>
  )
}
