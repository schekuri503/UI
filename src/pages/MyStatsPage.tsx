import type { UserSeasonStats } from '../types'

export const MyStatsPage = ({ stats }: { stats: UserSeasonStats | null }) => {
  if (!stats) return <p className="muted">No stats available yet.</p>
  return (
    <div className="grid stats-grid">
      <div className="card">
        <h3>League Skips</h3>
        <p>Used: {stats.skipsUsedLeague}</p>
        <p>Remaining: {stats.skipsRemainingLeague}</p>
      </div>
      <div className="card">
        <h3>Playoff Skip</h3>
        <p>Used: {stats.skipUsedPlayoff ? 'Yes' : 'No'}</p>
        <p>Remaining: {stats.playoffSkipRemaining}</p>
      </div>
    </div>
  )
}
