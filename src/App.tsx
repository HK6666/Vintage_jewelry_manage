import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import MobileHeader from './components/layout/MobileHeader'
import HomePage from './pages/HomePage'
import AnalyticsPage from './pages/AnalyticsPage'
import EntryPage from './pages/EntryPage'
import ListPage from './pages/ListPage'
import CorrelationPage from './pages/CorrelationPage'
import KnowledgePage from './pages/KnowledgePage'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1)

  const handleNavigate = (page: string) => {
    navigate(page === 'home' ? '/' : `/${page}`)
    setSidebarOpen(false)
  }

  return (
    <>
      <MobileHeader onMenuToggle={() => setSidebarOpen(true)} />

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={() => setSidebarOpen(false)}
          role="presentation"
        />
      )}

      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
      />

      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        <div className="max-w-[1400px] mx-auto">
          <Routes>
            <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/entry" element={<EntryPage />} />
            <Route path="/list" element={<ListPage onNavigate={handleNavigate} />} />
            <Route path="/correlation" element={<CorrelationPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
          </Routes>
        </div>
      </main>
    </>
  )
}
