import type { Match } from '../types'
import { MatchCard } from '../components/MatchCard'
import { canEditPrediction } from '../utils/scoring'

interface DashboardProps {
  matches: Match[]
  votes: Record<string, { homeTeamVotes: number; awayTeamVotes: number }>
  myPicks: Record<string, string>
}

export const DashboardPage = ({ matches, votes, myPicks }: DashboardProps) => {
  return (
    <section className="grid">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          votes={votes[match.id] ?? { homeTeamVotes: 0, awayTeamVotes: 0 }}
          selectedWinner={myPicks[match.id]}
          isLocked={!canEditPrediction(match)}
        />
      ))}
    </section>
  )
}
