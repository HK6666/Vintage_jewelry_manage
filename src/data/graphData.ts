export interface GraphNode {
  id: string
  group: string
  r: number
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

export interface GraphLink {
  source: string | GraphNode
  target: string | GraphNode
  value?: number
}

// Correlation Graph Data
export const correlationNodes: GraphNode[] = [
  { id: '钻石', group: 'material', r: 28 },
  { id: '铂金', group: 'material', r: 22 },
  { id: '黄金', group: 'material', r: 24 },
  { id: '珍珠', group: 'material', r: 18 },
  { id: 'Art Deco', group: 'era', r: 30 },
  { id: 'Victorian', group: 'era', r: 26 },
  { id: 'Edwardian', group: 'era', r: 20 },
  { id: 'Art Nouveau', group: 'era', r: 16 },
  { id: '胸针', group: 'type', r: 20 },
  { id: '戒指', group: 'type', r: 22 },
  { id: '项链', group: 'type', r: 18 },
  { id: '冠冕', group: 'type', r: 14 },
  { id: '微镶', group: 'craft', r: 20 },
  { id: '珐琅', group: 'craft', r: 16 },
  { id: '花丝', group: 'craft', r: 18 },
]

export const correlationLinks: GraphLink[] = [
  { source: '钻石', target: 'Art Deco', value: 0.92 },
  { source: '钻石', target: '微镶', value: 0.85 },
  { source: '钻石', target: '戒指', value: 0.7 },
  { source: '铂金', target: 'Edwardian', value: 0.78 },
  { source: '铂金', target: '项链', value: 0.82 },
  { source: '黄金', target: '珐琅', value: 0.87 },
  { source: '黄金', target: '冠冕', value: 0.75 },
  { source: '黄金', target: 'Victorian', value: 0.68 },
  { source: '珍珠', target: 'Edwardian', value: 0.6 },
  { source: '珍珠', target: '项链', value: 0.55 },
  { source: '戒指', target: '微镶', value: 0.65 },
  { source: '戒指', target: 'Art Deco', value: 0.58 },
  { source: '胸针', target: 'Art Nouveau', value: 0.72 },
  { source: '冠冕', target: 'Edwardian', value: 0.7 },
  { source: '花丝', target: 'Victorian', value: 0.8 },
  { source: '珐琅', target: 'Art Nouveau', value: 0.75 },
  { source: '微镶', target: 'Art Deco', value: 0.6 },
  { source: 'Victorian', target: '胸针', value: 0.55 },
]

export const correlationGroupColors: Record<string, string> = {
  material: '#4A7C59',
  era: '#8B2240',
  type: '#B8860B',
  craft: '#5B6ABF',
}

// Knowledge Graph Data
export const knowledgeNodes: GraphNode[] = [
  // Items (gold)
  { id: 'Cartier胸针', group: 'item', r: 16 },
  { id: 'Tiffany项链', group: 'item', r: 16 },
  { id: 'Lalique胸针', group: 'item', r: 16 },
  { id: 'Bulgari手链', group: 'item', r: 16 },
  { id: 'VCA红宝石', group: 'item', r: 16 },
  { id: '珍珠耳坠', group: 'item', r: 16 },
  { id: 'Chaumet冠冕', group: 'item', r: 16 },
  { id: 'Jensen手镯', group: 'item', r: 16 },
  { id: 'Boucheron戒指', group: 'item', r: 16 },
  { id: '浮雕胸针', group: 'item', r: 16 },
  // Eras (wine)
  { id: 'Victorian', group: 'era', r: 22 },
  { id: 'Art Nouveau', group: 'era', r: 22 },
  { id: 'Edwardian', group: 'era', r: 18 },
  { id: 'Art Deco', group: 'era', r: 24 },
  { id: 'Retro', group: 'era', r: 28 },
  // Materials (green)
  { id: '钻石', group: 'material', r: 20 },
  { id: '蓝宝石', group: 'material', r: 18 },
  { id: '黄金', group: 'material', r: 20 },
  { id: '铂金', group: 'material', r: 16 },
  { id: '珍珠', group: 'material', r: 14 },
  { id: '红宝石', group: 'material', r: 14 },
  { id: '祖母绿', group: 'material', r: 12 },
  { id: '纯银', group: 'material', r: 12 },
  // Crafts (blue)
  { id: '微镶工艺', group: 'craft', r: 18 },
  { id: '珐琅工艺', group: 'craft', r: 16 },
  { id: '花丝工艺', group: 'craft', r: 16 },
  { id: '浮雕工艺', group: 'craft', r: 14 },
  { id: '包镶工艺', group: 'craft', r: 14 },
  // Types (amber)
  { id: '戒指类', group: 'type', r: 18 },
  { id: '胸针类', group: 'type', r: 16 },
  { id: '耳饰类', group: 'type', r: 14 },
  { id: '项链类', group: 'type', r: 16 },
  { id: '冠冕类', group: 'type', r: 14 },
  { id: '手链类', group: 'type', r: 12 },
]

export const knowledgeLinks: GraphLink[] = [
  // Item -> Era
  { source: 'Cartier胸针', target: 'Art Deco' },
  { source: 'Tiffany项链', target: 'Victorian' },
  { source: 'Lalique胸针', target: 'Art Nouveau' },
  { source: 'Bulgari手链', target: 'Retro' },
  { source: 'VCA红宝石', target: 'Retro' },
  { source: '珍珠耳坠', target: 'Edwardian' },
  { source: 'Chaumet冠冕', target: 'Edwardian' },
  { source: 'Jensen手镯', target: 'Retro' },
  { source: 'Boucheron戒指', target: 'Art Deco' },
  { source: '浮雕胸针', target: 'Victorian' },
  // Item -> Material
  { source: 'Cartier胸针', target: '铂金' },
  { source: 'Cartier胸针', target: '钻石' },
  { source: 'Tiffany项链', target: '蓝宝石' },
  { source: 'Lalique胸针', target: '黄金' },
  { source: 'Bulgari手链', target: '祖母绿' },
  { source: 'VCA红宝石', target: '红宝石' },
  { source: '珍珠耳坠', target: '珍珠' },
  { source: 'Chaumet冠冕', target: '钻石' },
  { source: 'Chaumet冠冕', target: '铂金' },
  { source: 'Jensen手镯', target: '纯银' },
  { source: 'Boucheron戒指', target: '蓝宝石' },
  { source: '浮雕胸针', target: '黄金' },
  // Item -> Craft
  { source: 'Cartier胸针', target: '微镶工艺' },
  { source: 'Tiffany项链', target: '包镶工艺' },
  { source: 'Lalique胸针', target: '珐琅工艺' },
  { source: 'Lalique胸针', target: '花丝工艺' },
  { source: 'Bulgari手链', target: '包镶工艺' },
  { source: '珍珠耳坠', target: '花丝工艺' },
  { source: 'Chaumet冠冕', target: '微镶工艺' },
  { source: 'Boucheron戒指', target: '微镶工艺' },
  { source: '浮雕胸针', target: '浮雕工艺' },
  // Item -> Type
  { source: 'Cartier胸针', target: '胸针类' },
  { source: 'Tiffany项链', target: '项链类' },
  { source: 'Lalique胸针', target: '胸针类' },
  { source: 'Bulgari手链', target: '手链类' },
  { source: 'VCA红宝石', target: '项链类' },
  { source: '珍珠耳坠', target: '耳饰类' },
  { source: 'Chaumet冠冕', target: '冠冕类' },
  { source: 'Jensen手镯', target: '手链类' },
  { source: 'Boucheron戒指', target: '戒指类' },
  { source: '浮雕胸针', target: '胸针类' },
  // Cross-links (Material -> Craft associations)
  { source: '钻石', target: '微镶工艺' },
  { source: '黄金', target: '珐琅工艺' },
  { source: '黄金', target: '花丝工艺' },
  { source: '铂金', target: '微镶工艺' },
]

export const knowledgeGroupColors: Record<string, string> = {
  item: '#C4872E',
  era: '#8B2240',
  material: '#4A7C59',
  craft: '#5B6ABF',
  type: '#B8860B',
}

export const knowledgeGroupLabels: Record<string, string> = {
  item: '藏品',
  era: '年代',
  material: '材质',
  craft: '工艺',
  type: '品类',
}
