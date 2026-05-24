import Papa from 'papaparse'

export default function ReportsPage(){
  const download = () => {
    const csv = Papa.unparse([{date:'2026-05-24', collected:5000}])
    const blob = new Blob([csv], { type: 'text/csv' })
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'daily-report.csv'; link.click()
  }
  return <div><h2 className='text-2xl font-semibold mb-4'>Reports</h2><button className='px-4 py-2 bg-emerald-600 text-white rounded' onClick={download}>Export CSV</button></div>
}
