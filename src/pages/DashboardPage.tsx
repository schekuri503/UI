import { formatINR } from '../lib/i18n'

const cards = [
  ['Due Today', 12000], ['Overdue', 35000], ['Paid Today', 8000], ['Active Accounts', 24],
]

export default function DashboardPage() {
  return <div><h2 className='text-2xl font-semibold mb-4'>Dashboard</h2><div className='grid grid-cols-2 md:grid-cols-4 gap-3'>{cards.map(([k,v]) => <div key={String(k)} className='bg-white p-4 rounded-lg shadow'><p className='text-sm'>{k}</p><p className='text-xl font-bold'>{typeof v==='number'&&k!=='Active Accounts'?formatINR(v):v}</p></div>)}</div></div>
}
