import { useCallback, useEffect, useState } from 'react'
import { dataService } from '../services/dataService'
import { useAuth } from '../context/useAuth'
import type { LeaderboardEntry, Match, UserSeasonStats } from '../types'

export const useSeasonData = (season: number) => {
  const { user } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [stats, setStats] = useState<UserSeasonStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [nextMatches, nextLeaderboard] = await Promise.all([
        dataService.getMatchesBySeason(season),
        dataService.getLeaderboard(season),
      ])
      setMatches(nextMatches)
      setLeaderboard(nextLeaderboard)
      if (user) {
        setStats(await dataService.getMyStats(user, season))
      } else {
        setStats(null)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [season, user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { matches, leaderboard, stats, isLoading, error, refresh }
}
