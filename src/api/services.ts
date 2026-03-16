import { get, post, put, del, upload, setToken, setRefreshToken, clearToken } from './client'
import type {
  CollectionItem, EraItem, CategoryItem, MaterialItem, BrandItem, ColorItem,
  PaginatedResponse, DashboardStats, ChartData, CategoryDistribution,
  AnalyticsSummary, ValueByMaterial, HeatmapData, StatusDistribution,
  SourceDistribution, CorrelationGraphData, KnowledgeGraphData, StrongPair,
} from './types'

// Auth
export const authApi = {
  login: async (username: string, password: string) => {
    const data = await post<{ token: string; refreshToken: string; expiresIn: number; user: { id: number; username: string } }>('/auth/login', { username, password })
    setToken(data.token)
    setRefreshToken(data.refreshToken)
    return data
  },
  logout: async () => {
    try { await post<void>('/auth/logout') } finally { clearToken() }
  },
  me: () => get<{ id: number; username: string; avatar: string; role: string }>('/auth/me'),
}

// Dashboard
export const dashboardApi = {
  getStats: () => get<DashboardStats>('/dashboard/stats'),
  getIntakeTrend: (year?: number) => get<ChartData>(`/dashboard/intake-trend${year ? `?year=${year}` : ''}`),
  getCategoryDistribution: () => get<CategoryDistribution[]>('/dashboard/category-distribution'),
  getEraDistribution: () => get<CategoryDistribution[]>('/dashboard/era-distribution'),
}

// Analytics
export const analyticsApi = {
  getSummary: () => get<AnalyticsSummary>('/analytics/summary'),
  getValueByMaterial: () => get<ValueByMaterial[]>('/analytics/value-by-material'),
  getEraCategoryHeatmap: () => get<HeatmapData>('/analytics/era-category-heatmap'),
  getStatusDistribution: () => get<StatusDistribution[]>('/analytics/status-distribution'),
  getSourceDistribution: () => get<SourceDistribution[]>('/analytics/source-distribution'),
  getValueTrend: (months?: number) => get<ChartData>(`/analytics/value-trend${months ? `?months=${months}` : ''}`),
}

// Collections
export const collectionsApi = {
  list: (params: Record<string, string | number>) => {
    const qs = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v !== '' && v !== undefined) qs.set(k, String(v))
    }
    return get<PaginatedResponse<CollectionItem>>(`/collections?${qs}`)
  },
  getById: (id: number) => get<CollectionItem>(`/collections/${id}`),
  getRecent: (limit = 10) => get<CollectionItem[]>(`/collections/recent?limit=${limit}`),
  create: (data: Record<string, unknown>) => post<CollectionItem>('/collections', data),
  update: (id: number, data: Record<string, unknown>) => put<CollectionItem>(`/collections/${id}`, data),
  remove: (id: number) => del<void>(`/collections/${id}`),
  uploadImages: (id: number, files: File[]) => {
    const fd = new FormData()
    files.forEach(f => fd.append('images', f))
    return upload<{ images: { id: number; url: string; sort: number }[] }>(`/collections/${id}/images`, fd)
  },
  deleteImage: (collectionId: number, imageId: number) => del<void>(`/collections/${collectionId}/images/${imageId}`),
}

// Eras
export const erasApi = {
  list: (keyword = '') => get<EraItem[]>(`/eras${keyword ? `?keyword=${keyword}` : ''}`),
  create: (data: Partial<EraItem>) => post<EraItem>('/eras', data),
  update: (id: number, data: Partial<EraItem>) => put<EraItem>(`/eras/${id}`, data),
  remove: (id: number) => del<void>(`/eras/${id}`),
}

// Categories
export const categoriesApi = {
  list: (keyword = '') => get<CategoryItem[]>(`/categories${keyword ? `?keyword=${keyword}` : ''}`),
  create: (data: Partial<CategoryItem>) => post<CategoryItem>('/categories', data),
  update: (id: number, data: Partial<CategoryItem>) => put<CategoryItem>(`/categories/${id}`, data),
  remove: (id: number) => del<void>(`/categories/${id}`),
}

// Materials
export const materialsApi = {
  list: (params?: { keyword?: string; category?: string }) => {
    const qs = new URLSearchParams()
    if (params?.keyword) qs.set('keyword', params.keyword)
    if (params?.category) qs.set('category', params.category)
    const q = qs.toString()
    return get<MaterialItem[]>(`/materials${q ? `?${q}` : ''}`)
  },
  create: (data: Partial<MaterialItem>) => post<MaterialItem>('/materials', data),
  update: (id: number, data: Partial<MaterialItem>) => put<MaterialItem>(`/materials/${id}`, data),
  remove: (id: number) => del<void>(`/materials/${id}`),
}

// Brands
export const brandsApi = {
  list: (keyword = '') => get<BrandItem[]>(`/brands${keyword ? `?keyword=${keyword}` : ''}`),
  create: (data: Partial<BrandItem>) => post<BrandItem>('/brands', data),
  update: (id: number, data: Partial<BrandItem>) => put<BrandItem>(`/brands/${id}`, data),
  remove: (id: number) => del<void>(`/brands/${id}`),
}

// Colors
export const colorsApi = {
  list: (keyword = '') => get<ColorItem[]>(`/colors${keyword ? `?keyword=${keyword}` : ''}`),
  create: (data: Partial<ColorItem>) => post<ColorItem>('/colors', data),
  update: (id: number, data: Partial<ColorItem>) => put<ColorItem>(`/colors/${id}`, data),
  remove: (id: number) => del<void>(`/colors/${id}`),
}

// Correlations
export const correlationsApi = {
  getGraph: (params?: { dimension?: string; era?: string }) => {
    const qs = new URLSearchParams()
    if (params?.dimension) qs.set('dimension', params.dimension)
    if (params?.era) qs.set('era', params.era)
    const q = qs.toString()
    return get<CorrelationGraphData>(`/correlations/graph${q ? `?${q}` : ''}`)
  },
  getStrongPairs: (params?: { limit?: number; threshold?: number; dimension?: string }) => {
    const qs = new URLSearchParams()
    if (params?.limit) qs.set('limit', String(params.limit))
    if (params?.threshold) qs.set('threshold', String(params.threshold))
    if (params?.dimension) qs.set('dimension', params.dimension)
    const q = qs.toString()
    return get<StrongPair[]>(`/correlations/strong-pairs${q ? `?${q}` : ''}`)
  },
}

// Knowledge
export const knowledgeApi = {
  getGraph: () => get<KnowledgeGraphData>('/knowledge/graph'),
}

// Tags
export const tagsApi = {
  list: (keyword = '', limit = 20) => get<{ name: string; count: number }[]>(`/tags?keyword=${keyword}&limit=${limit}`),
}
