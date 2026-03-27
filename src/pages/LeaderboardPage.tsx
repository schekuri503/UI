import type { LeaderboardEntry } from '../types'

const medal = (rank: number) => {
  if (rank === 1) return '🥇 throws the party!'
  if (rank === 2) return '🥈 throws the party!'
  if (rank === 3) return '🥉 throws the party!'
  return ''
}

export const LeaderboardPage = ({ entries }: { entries: LeaderboardEntry[] }) => {
  if (!entries.length) return <p className="muted">No completed matches yet.</p>
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Points</th>
            <th>W-L</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.userId}>
              <td>#{entry.rank}</td>
              <td>
                {entry.displayName} {medal(entry.rank)}
              </td>
              <td>{entry.totalPoints.toFixed(2)}</td>
              <td>
                {entry.correctPicks}-{entry.wrongPicks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
