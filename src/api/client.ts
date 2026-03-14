const BASE = import.meta.env.VITE_API_BASE || '/api/v1'
const TOKEN_KEY = 'jwt_token'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  })

  const json = await res.json()

  if (!res.ok) {
    throw new ApiError(res.status, json.message || '请求失败')
  }

  return json.data as T
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

  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (res.status === 413) {
    throw new ApiError(413, '文件太大，请减少图片数量或压缩后重试')
  }

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
