import { useEffect, useState } from 'react'
import './index.css'
import { Layout } from './components/Layout'
import { useAuth } from './context/useAuth'
import { useHashRoute } from './hooks/useHashRoute'
import { usePredictions } from './hooks/usePredictions'
import { useSeasonData } from './hooks/useSeasonData'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { PredictionPage } from './pages/PredictionPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { AdminPage } from './pages/AdminPage'
import { MyStatsPage } from './pages/MyStatsPage'
import { dataService } from './services/dataService'

function App() {
  const { user, isLoading } = useAuth()
  const { path, navigate } = useHashRoute()
  const [season, setSeason] = useState(2026)
  const [seasons, setSeasons] = useState<number[]>([2026])
  const seasonData = useSeasonData(season)
  const predictionData = usePredictions(seasonData.matches)

  useEffect(() => {
    void dataService.listSeasons().then((items) => {
      if (items.length > 0) {
        setSeasons(items)
        if (!items.includes(season)) setSeason(items[0])
      }
    })
  }, [season])

  if (isLoading) return <div className="center-wrap">Loading...</div>
  if (!user || path === '/login') return <LoginPage onDone={() => navigate('/dashboard')} />

  const protectedPath = path === '/' ? '/dashboard' : path

  return (
    <Layout title={protectedPath.replace('/', '').toUpperCase()} onNav={navigate}>
      <div className="toolbar">
        <label>
          Season
          <select value={season} onChange={(e) => setSeason(Number(e.target.value))}>
            {seasons.map((seasonOption) => (
              <option key={seasonOption} value={seasonOption}>
                {seasonOption}
              </option>
            ))}
          </select>
        </label>
      </div>

      {seasonData.error ? <p className="error">{seasonData.error}</p> : null}
      {seasonData.isLoading ? <p className="muted">Loading season data…</p> : null}

      {protectedPath === '/dashboard' ? (
        <DashboardPage matches={seasonData.matches} votes={predictionData.votes} myPicks={predictionData.myPicks} />
      ) : null}

      {protectedPath === '/predict' ? (
        <PredictionPage
          matches={seasonData.matches}
          votes={predictionData.votes}
          myPicks={predictionData.myPicks}
          onChanged={async () => {
            await seasonData.refresh()
            await predictionData.refresh()
          }}
        />
      ) : null}

      {protectedPath === '/leaderboard' ? <LeaderboardPage entries={seasonData.leaderboard} /> : null}
      {protectedPath === '/stats' ? <MyStatsPage stats={seasonData.stats} /> : null}
      {protectedPath === '/admin' ? <AdminPage season={season} matches={seasonData.matches} onChanged={seasonData.refresh} /> : null}
    </Layout>
  )
}

export default App
