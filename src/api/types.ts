export interface CollectionItem {
  id: number
  name: string
  era: string
  cat: string
  material: string
  brand: string
  colorScheme: string
  purchasePrice: number
  estimatedValue: number
  status: string
  description: string
  source: string
  date: string
  tags: string[]
  images: { id: number; url: string; sort: number }[]
  createdAt: string | null
  updatedAt: string | null
}

export interface EraItem {
  id: number
  name: string
  nameEn: string
  period: string
  description: string
  count: number
}

export interface CategoryItem {
  id: number
  name: string
  nameEn: string
  description: string
  count: number
}

export interface MaterialItem {
  id: number
  name: string
  nameEn: string
  category: string
  description: string
  count: number
}

export interface BrandItem {
  id: number
  name: string
  nameEn: string
  country: string
  description: string
  count: number
}

export interface ColorItem {
  id: number
  name: string
  nameEn: string
  hex: string
  description: string
  count: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface DashboardStats {
  totalCount: number
  totalCountChange: number
  totalValue: number
  totalValueChangePercent: number
  eraCount: number
  eraNames: string[]
  monthlyNew: number
  monthlyNewChange: number
}

export interface ChartData {
  labels: string[]
  values: number[]
}

export interface CategoryDistribution {
  name: string
  nameEn: string
  count: number
}

export interface AnalyticsSummary {
  avgValue: number
  maxValue: number
  materialTypeCount: number
  brandCount: number
}

export interface ValueByMaterial {
  material: string
  avgValue: number
  maxValue: number
}

export interface HeatmapData {
  eras: string[]
  categories: string[]
  matrix: number[][]
}

export interface StatusDistribution {
  status: string
  count: number
}

export interface SourceDistribution {
  source: string
  count: number
}

export interface GraphNode {
  id: string
  group: string
  r: number
}

export interface GraphLink {
  source: string
  target: string
  value?: number
}

export interface CorrelationGraphData {
  nodes: GraphNode[]
  links: GraphLink[]
  groupColors: Record<string, string>
}

export interface KnowledgeGraphData {
  nodes: GraphNode[]
  links: GraphLink[]
  groupColors: Record<string, string>
  groupLabels: Record<string, string>
}

export interface StrongPair {
  nodeA: string
  nodeB: string
  strength: number
  sharedCount: number
  insight: string
}
