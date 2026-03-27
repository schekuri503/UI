import { useState } from 'react'
import { MatchCard } from '../components/MatchCard'
import { useAuth } from '../context/useAuth'
import { dataService } from '../services/dataService'
import type { Match } from '../types'
import { canEditPrediction } from '../utils/scoring'

interface PredictionPageProps {
  matches: Match[]
  votes: Record<string, { homeTeamVotes: number; awayTeamVotes: number }>
  myPicks: Record<string, string>
  onChanged: () => Promise<void>
}

export const PredictionPage = ({ matches, votes, myPicks, onChanged }: PredictionPageProps) => {
  const { user } = useAuth()
  const [busyMatchId, setBusyMatchId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const withRefresh = async (run: () => Promise<void>, matchId: string) => {
    setError(null)
    setBusyMatchId(matchId)
    try {
      await run()
      await onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to update prediction')
    } finally {
      setBusyMatchId(null)
    }
  }

  return (
    <section>
      {error ? <p className="error">{error}</p> : null}
      <div className="grid">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            votes={votes[match.id] ?? { homeTeamVotes: 0, awayTeamVotes: 0 }}
            selectedWinner={myPicks[match.id]}
            isLocked={!canEditPrediction(match)}
            isBusy={busyMatchId === match.id}
            onPredict={async (team) => {
              if (!match?.homeTeam || !match?.awayTeam) {
                setError('Invalid match data. Please refresh.')
                return
              }
              await withRefresh(() => dataService.upsertPrediction(user, match.id, team), match.id)
            }}
            onUndo={async () => withRefresh(() => dataService.undoPrediction(user, match.id), match.id)}
          />
        ))}
      </div>
    </section>
  )
}
