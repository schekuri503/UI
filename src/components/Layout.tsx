import { useAuth } from '../context/useAuth'

interface LayoutProps {
  title: string
  onNav: (path: string) => void
  children: React.ReactNode
}

const links = [
  ['/dashboard', 'Dashboard'],
  ['/predict', 'Predict'],
  ['/leaderboard', 'Leaderboard'],
  ['/stats', 'My Stats'],
  ['/admin', 'Admin'],
] as const

export const Layout = ({ title, onNav, children }: LayoutProps) => {
  const { user, signOut } = useAuth()
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>{title}</h1>
          <p>IPL Predictor</p>
        </div>
        <div className="top-actions">
          <span className="muted">{user?.displayName}</span>
          <button onClick={() => void signOut()}>Sign out</button>
        </div>
      </header>
      <nav className="tabs">
        {links.map(([path, label]) => (
          <button key={path} onClick={() => onNav(path)}>
            {label}
          </button>
        ))}
      </nav>
      <main>{children}</main>
    </div>
  )
}
