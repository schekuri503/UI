import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { dataService } from '../services/dataService'
import type { Match } from '../types'

interface AdminProps {
  season: number
  matches: Match[]
  onChanged: () => Promise<void>
}

const blankMatch = (season: number): Match => ({
  id: crypto.randomUUID(),
  season,
  startsAtUtc: new Date().toISOString(),
  lockTimeUtc: new Date().toISOString(),
  venue: '',
  homeTeam: '',
  awayTeam: '',
  stage: 'LEAGUE',
  resultWinner: null,
  createdAtUtc: new Date().toISOString(),
  updatedAtUtc: new Date().toISOString(),
})

export const AdminPage = ({ season, matches, onChanged }: AdminProps) => {
  const { user } = useAuth()
  const [draft, setDraft] = useState<Match>(blankMatch(season))
  const [scheduleJson, setScheduleJson] = useState('[]')
  const [message, setMessage] = useState('')

  if (!user?.isAdmin) return <p className="error">Admin access required.</p>

  const run = async (fn: () => Promise<void>) => {
    try {
      await fn()
      await onChanged()
      setMessage('Done')
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed')
    }
  }

  return (
    <section className="grid">
      <div className="card">
        <h3>Create / Edit Match</h3>
        <input placeholder="Home Team" value={draft.homeTeam} onChange={(e) => setDraft({ ...draft, homeTeam: e.target.value })} />
        <input placeholder="Away Team" value={draft.awayTeam} onChange={(e) => setDraft({ ...draft, awayTeam: e.target.value })} />
        <input placeholder="Venue" value={draft.venue} onChange={(e) => setDraft({ ...draft, venue: e.target.value })} />
        <label>Start UTC<input type="datetime-local" onChange={(e) => setDraft({ ...draft, startsAtUtc: new Date(e.target.value).toISOString() })} /></label>
        <label>Lock UTC<input type="datetime-local" onChange={(e) => setDraft({ ...draft, lockTimeUtc: new Date(e.target.value).toISOString() })} /></label>
        <select value={draft.stage} onChange={(e) => setDraft({ ...draft, stage: e.target.value as Match['stage'] })}>
          <option value="LEAGUE">LEAGUE</option>
          <option value="QUARTERFINAL">QUARTERFINAL</option>
          <option value="SEMIFINAL">SEMIFINAL</option>
          <option value="FINAL">FINAL</option>
        </select>
        <button onClick={() => void run(async () => dataService.saveMatch(user, draft))}>Save Match</button>
      </div>

      <div className="card">
        <h3>Match Results + Recompute</h3>
        {matches.map((match) => (
          <div className="admin-row" key={match.id}>
            <span>{match.homeTeam} vs {match.awayTeam}</span>
            <button onClick={() => void run(async () => dataService.setResultWinner(user, match.id, match.homeTeam))}>Home Won</button>
            <button onClick={() => void run(async () => dataService.setResultWinner(user, match.id, match.awayTeam))}>Away Won</button>
            <button onClick={() => void run(async () => dataService.deleteMatch(user, match.id))}>Delete</button>
          </div>
        ))}
        <button onClick={() => void run(async () => { await dataService.recomputeLeaderboard(season) })}>Recompute Season Leaderboard</button>
      </div>

      <div className="card">
        <h3>Import Schedule JSON</h3>
        <textarea value={scheduleJson} onChange={(e) => setScheduleJson(e.target.value)} rows={8} />
        <button onClick={() => void run(async () => { await dataService.importSchedule(user, scheduleJson) })}>Import</button>
        <p className="muted">Ready for backend job sync (iplt20.com integration placeholder).</p>
      </div>

      {message ? <p className="muted">{message}</p> : null}
    </section>
  )
}
