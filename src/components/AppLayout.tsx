import { Link, Outlet } from 'react-router-dom'

const items = [
  ['dashboard', '/dashboard'],
  ['customers', '/customers'],
  ['dues', '/dues'],
  ['reminders', '/reminders'],
  ['reports', '/reports'],
]

export function AppLayout() {
  return (
    <div className='min-h-screen md:flex'>
      <aside className='bg-slate-900 text-white p-4 md:w-64'>
        <h1 className='text-xl font-bold mb-4'>Vyapara Ledger</h1>
        <nav className='flex md:block gap-2 overflow-auto'>
          {items.map(([name, path]) => <Link key={path} className='block p-2 rounded bg-slate-800' to={path}>{name}</Link>)}
        </nav>
      </aside>
      <main className='flex-1 p-4'><Outlet /></main>
    </div>
  )
}
