import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { dataService } from '../services/dataService'
import type { Match, MatchVoteCounts } from '../types'

export const usePredictions = (matches: Match[]) => {
  const { user } = useAuth()
  const [votes, setVotes] = useState<Record<string, MatchVoteCounts>>({})
  const [myPicks, setMyPicks] = useState<Record<string, string>>({})

  const refresh = useCallback(async () => {
    if (!user) return
    const voteEntries = await Promise.all(
      matches.map(async (match) => [match.id, await dataService.getVoteCounts(match.id)] as const),
    )
    setVotes(Object.fromEntries(voteEntries))

    const picks = await Promise.all(
      matches.map(async (match) => [match.id, (await dataService.getPrediction(match.id, user.uid))?.predictedWinner] as const),
    )
    setMyPicks(
      Object.fromEntries(
        picks.filter(([, team]) => Boolean(team)).map(([matchId, team]) => [matchId, team as string]),
      ),
    )
  }, [matches, user])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  return { votes, myPicks, refresh }
}
