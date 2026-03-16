const BASE = import.meta.env.VITE_API_BASE || '/api/v1'
const TOKEN_KEY = 'jwt_token'
const REFRESH_TOKEN_KEY = 'jwt_refresh_token'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

let refreshPromise: Promise<boolean> | null = null

async function tryRefreshToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const rt = getRefreshToken()
    if (!rt) return false

    try {
      const res = await fetch(`${BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${rt}`, 'Content-Type': 'application/json' },
      })
      if (!res.ok) return false
      const json = await res.json()
      if (json.data?.token) {
        setToken(json.data.token)
        return true
      }
      return false
    } catch {
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

function forceLogout() {
  clearToken()
  window.location.reload()
}

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text()
  let json: { message?: string; data?: T }
  try {
    json = JSON.parse(text)
  } catch {
    throw new ApiError(res.status, '服务器响应异常')
  }

  if (!res.ok) {
    throw new ApiError(res.status, json.message || '请求失败')
  }

  return json.data as T
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  })

  // Auto refresh on 401
  if (res.status === 401 && token) {
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getToken()}`
      res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: { ...headers, ...options?.headers },
      })
    } else {
      forceLogout()
      throw new ApiError(401, '登录已过期，请重新登录')
    }
  }

  return parseResponse<T>(res)
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path)
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) })
}

export function put<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'PUT', body: JSON.stringify(body) })
}

export function del<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'DELETE',
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
}

export async function upload<T>(path: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = {}
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (res.status === 413) {
    throw new ApiError(413, '文件太大，请减少图片数量或压缩后重试')
  }

  // Auto refresh on 401
  if (res.status === 401 && token) {
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getToken()}`
      res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: formData })
    } else {
      forceLogout()
      throw new ApiError(401, '登录已过期，请重新登录')
    }
  }

  return parseResponse<T>(res)
}
