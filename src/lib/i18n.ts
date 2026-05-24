export type Lang = 'en' | 'te'

export const labels = {
  en: { dashboard: 'Dashboard', customers: 'Customers', dues: 'Dues', reminders: 'Reminders', reports: 'Reports' },
  te: { dashboard: 'డాష్‌బోర్డ్', customers: 'కస్టమర్లు', dues: 'బడులు', reminders: 'రిమైండర్లు', reports: 'రిపోర్టులు' },
}

export const formatINR = (value: number, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
