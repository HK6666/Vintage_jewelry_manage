export interface CollectionItem {
  name: string
  era: string
  cat: string
  material: string
  value: string
  status: string
  statusColor: string
}

export const collectionItems: CollectionItem[] = [
  { name: 'Cartier Art Deco 钻石胸针', era: 'Art Deco · 1925', cat: '胸针', material: '铂金/钻石', value: '$185,000', status: '完好', statusColor: 'bg-green-50 text-green-700' },
  { name: 'Tiffany 维多利亚蓝宝石项链', era: 'Victorian · 1880', cat: '项链', material: '黄金/蓝宝石', value: '$320,000', status: '良好', statusColor: 'bg-primary-50 text-primary-600' },
  { name: 'Lalique 新艺术珐琅蜻蜓胸针', era: 'Art Nouveau · 1900', cat: '胸针', material: '黄金/珐琅/蛋白石', value: '$680,000', status: '需修复', statusColor: 'bg-accent-50 text-accent-600' },
  { name: 'Bulgari Serpenti 祖母绿手链', era: 'Retro · 1965', cat: '手链', material: '黄金/祖母绿', value: '$125,000', status: '良好', statusColor: 'bg-primary-50 text-primary-600' },
  { name: 'Van Cleef & Arpels 红宝石套件', era: 'Retro · 1945', cat: '项链', material: '黄金/红宝石', value: '$450,000', status: '完好', statusColor: 'bg-green-50 text-green-700' },
  { name: '爱德华时期珍珠流苏耳坠', era: 'Edwardian · 1905', cat: '耳饰', material: '铂金/珍珠', value: '$92,000', status: '一般', statusColor: 'bg-yellow-50 text-yellow-700' },
  { name: 'Chaumet 钻石冠冕', era: 'Belle Époque · 1910', cat: '冠冕', material: '铂金/钻石', value: '$1,200,000', status: '完好', statusColor: 'bg-green-50 text-green-700' },
  { name: 'Georg Jensen 银质花丝手镯', era: 'Mid-Century · 1955', cat: '手链', material: '纯银', value: '$38,000', status: '良好', statusColor: 'bg-primary-50 text-primary-600' },
  { name: 'Boucheron 蓝宝石鸡尾酒戒指', era: 'Art Deco · 1930', cat: '戒指', material: '铂金/蓝宝石', value: '$275,000', status: '完好', statusColor: 'bg-green-50 text-green-700' },
  { name: 'Victorian 浮雕贝壳胸针', era: 'Victorian · 1860', cat: '胸针', material: '黄金/贝壳', value: '$28,000', status: '一般', statusColor: 'bg-yellow-50 text-yellow-700' },
]

export const recentItems = [
  { name: 'Cartier Art Deco 钻石胸针', desc: 'Art Deco · 1925 · 铂金/钻石', price: '$185,000', color: 'primary' },
  { name: 'Tiffany 维多利亚蓝宝石项链', desc: 'Victorian · 1880 · 黄金/蓝宝石', price: '$320,000', color: 'accent' },
  { name: 'Lalique 新艺术珐琅蜻蜓胸针', desc: 'Art Nouveau · 1900 · 珐琅/蛋白石', price: '$680,000', color: 'ivory' },
  { name: 'Bulgari Serpenti 祖母绿手链', desc: 'Retro · 1965 · 黄金/祖母绿', price: '$125,000', color: 'primary' },
]

export const filterCategories = ['全部', '戒指', '项链', '手链', '胸针', '耳饰', '吊坠', '冠冕']
