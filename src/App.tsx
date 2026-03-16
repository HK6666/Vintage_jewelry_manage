import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import MobileHeader from './components/layout/MobileHeader'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AnalyticsPage from './pages/AnalyticsPage'
import EntryPage from './pages/EntryPage'
import ListPage from './pages/ListPage'
import CorrelationPage from './pages/CorrelationPage'
import KnowledgePage from './pages/KnowledgePage'
import EraManagePage from './pages/EraManagePage'
import CategoryManagePage from './pages/CategoryManagePage'
import MaterialManagePage from './pages/MaterialManagePage'
import BrandManagePage from './pages/BrandManagePage'
import ColorManagePage from './pages/ColorManagePage'
import { getToken, clearToken } from './api/client'
import { authApi } from './api/services'

interface UserInfo {
  id: number
  username: string
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Check existing token on mount
  useEffect(() => {
    const token = getToken()
    if (token) {
      // Verify token by fetching user info
      authApi.me()
        .then(u => setUser(u))
        .catch(() => clearToken())
        .finally(() => setAuthChecked(true))
    } else {
      setAuthChecked(true)
    }
  }, [])

  const handleLogin = (u: UserInfo) => {
    setUser(u)
  }

  const handleLogout = async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    setUser(null)
  }

  // Show loading spinner while checking auth
  if (!authChecked) return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-50">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-300 border-t-primary-600" />
    </div>
  )

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

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
        username={user.username}
        onLogout={handleLogout}
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
            <Route path="/era-manage" element={<EraManagePage />} />
            <Route path="/category-manage" element={<CategoryManagePage />} />
            <Route path="/material-manage" element={<MaterialManagePage />} />
            <Route path="/brand-manage" element={<BrandManagePage />} />
            <Route path="/color-manage" element={<ColorManagePage />} />
          </Routes>
        </div>
      </main>
    </>
  )
}
