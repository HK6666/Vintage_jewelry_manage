import { useState } from 'react'
import { authApi } from '../api/services'

interface LoginPageProps {
  onLogin: (user: { id: number; username: string }) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await authApi.login(username, password)
      onLogin(data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ivory-50 via-ivory-100 to-primary-50/30 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] mb-4">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
              <defs>
                <radialGradient id="login-opal" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#a8edea" />
                  <stop offset="30%" stopColor="#7ec8e3" />
                  <stop offset="55%" stopColor="#c3aed6" />
                  <stop offset="80%" stopColor="#e8a87c" />
                  <stop offset="100%" stopColor="#d4a5a5" />
                </radialGradient>
                <radialGradient id="login-highlight" cx="35%" cy="30%" r="35%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
              </defs>
              <ellipse cx="12" cy="12" rx="8" ry="9.5" fill="url(#login-opal)" />
              <ellipse cx="12" cy="12" rx="8" ry="9.5" fill="url(#login-highlight)" />
              <ellipse cx="12" cy="12" rx="8" ry="9.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold text-ink-800 tracking-wide">Vintage Vault</h1>
          <p className="text-ink-400 mt-1 text-sm">Jewelry Collection Manager</p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="font-heading text-xl font-semibold text-ink-800 mb-6 text-center">登录系统</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-600 mb-1.5">用户名</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="请输入用户名"
                autoComplete="username"
                className="input-field w-full rounded-xl px-4 py-3 text-sm"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-600 mb-1.5">密码</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
                className="input-field w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>

            {error && (
              <div className="text-sm text-accent-500 bg-accent-50 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-sm font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登  录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
