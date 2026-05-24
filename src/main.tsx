import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import './index.css'
import DashboardPage from './pages/DashboardPage'
import CustomersPage from './pages/CustomersPage'
import DuesPage from './pages/DuesPage'
import ReportsPage from './pages/ReportsPage'
import LoginPage from './pages/LoginPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/customers' element={<CustomersPage />} />
          <Route path='/dues' element={<DuesPage />} />
          <Route path='/reports' element={<ReportsPage />} />
        </Route>
        <Route path='*' element={<Navigate to='/dashboard' replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
