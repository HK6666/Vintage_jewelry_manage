export interface CollectionItem {
  id: number
  name: string
  era: string
  cat: string
  material: string
  purchasePrice: string
  estimatedValue: string
  status: string
  statusColor: string
  description: string
  source: string
  date: string
  tags: string[]
}

export const collectionItems: CollectionItem[] = [
  { id: 1, name: 'Cartier Art Deco 钻石胸针', era: 'Art Deco · 1925', cat: '胸针', material: '铂金/钻石', purchasePrice: '¥1,200,000', estimatedValue: '¥1,350,000', status: '完好', statusColor: 'bg-green-50 text-green-700', description: '这枚 Cartier 胸针创作于 1925 年巴黎，采用铂金底座，镶嵌约 12 克拉老矿式切割钻石。设计以典型 Art Deco 几何图案为基础，展现了该时期对称与线条美学的巅峰。胸针背面刻有 Cartier Paris 及编号，保存极为完好。', source: "Christie's 纽约拍卖", date: '2023-06-15', tags: ['宫廷', '镶嵌', 'Art Deco'] },
  { id: 2, name: 'Tiffany 维多利亚蓝宝石项链', era: 'Victorian · 1880', cat: '项链', material: '黄金/蓝宝石', purchasePrice: '¥2,100,000', estimatedValue: '¥2,340,000', status: '良好', statusColor: 'bg-primary-50 text-primary-600', description: 'Tiffany & Co. 维多利亚时期杰作，18K 黄金链身搭配一颗约 8.5 克拉锡兰蓝宝石主石，周围环绕种子珍珠。链扣处刻有 Tiffany & Co. 标识，展现了维多利亚晚期审美风格。', source: "Sotheby's 伦敦拍卖", date: '2022-11-20', tags: ['品牌', '蓝宝石', 'Victorian'] },
  { id: 3, name: 'Lalique 新艺术珐琅蜻蜓胸针', era: 'Art Nouveau · 1900', cat: '胸针', material: '黄金/珐琅/蛋白石', purchasePrice: '¥4,500,000', estimatedValue: '¥4,960,000', status: '需修复', statusColor: 'bg-accent-50 text-accent-600', description: 'René Lalique 大师亲制蜻蜓胸针，约 1900 年作品。采用 plique-à-jour 透光珐琅工艺制作蜻蜓翅膀，腹部镶嵌一颗火彩绚丽的澳大利亚蛋白石。珐琅部分有轻微裂纹，需专业修复。', source: '私人藏家转让', date: '2024-01-08', tags: ['珐琅', '大师作品', 'Art Nouveau'] },
  { id: 4, name: 'Bulgari Serpenti 祖母绿手链', era: 'Retro · 1965', cat: '手链', material: '黄金/祖母绿', purchasePrice: '¥820,000', estimatedValue: '¥912,000', status: '良好', statusColor: 'bg-primary-50 text-primary-600', description: 'Bulgari 经典 Serpenti 蛇形手链，18K 黄金鳞片状链节，蛇头镶嵌一对梨形哥伦比亚祖母绿作为眼睛。典型的 1960 年代意大利珠宝风格，大胆而奢华。', source: '古董商购入', date: '2023-09-03', tags: ['品牌', 'Serpenti', 'Retro'] },
  { id: 5, name: 'Van Cleef & Arpels 红宝石套件', era: 'Retro · 1945', cat: '项链', material: '黄金/红宝石', purchasePrice: '¥3,000,000', estimatedValue: '¥3,285,000', status: '完好', statusColor: 'bg-green-50 text-green-700', description: 'Van Cleef & Arpels 1945 年 Retro 风格套件，包含项链与配套耳夹。18K 玫瑰金机械感设计，镶嵌缅甸红宝石约 15 克拉（无烧），展现了战后好莱坞黄金时代的奢华风格。', source: '遗产拍卖', date: '2022-05-12', tags: ['套件', '红宝石', '无烧'] },
  { id: 6, name: '爱德华时期珍珠流苏耳坠', era: 'Edwardian · 1905', cat: '耳饰', material: '铂金/珍珠', purchasePrice: '¥600,000', estimatedValue: '¥671,000', status: '一般', statusColor: 'bg-yellow-50 text-yellow-700', description: '爱德华时期铂金耳坠，采用花环风格设计，铂金蕾丝般的镂空框架悬挂天然海水珍珠流苏。珍珠光泽略有暗淡，铂金框架有使用痕迹，整体保持时代特征。', source: '线上平台', date: '2024-03-22', tags: ['铂金', '珍珠', 'Edwardian'] },
  { id: 7, name: 'Chaumet 钻石冠冕', era: 'Belle Époque · 1910', cat: '冠冕', material: '铂金/钻石', purchasePrice: '¥8,000,000', estimatedValue: '¥8,760,000', status: '完好', statusColor: 'bg-green-50 text-green-700', description: 'Chaumet 为法国贵族定制的钻石冠冕，约 1910 年作品。铂金底座镶嵌超过 200 颗老欧式切割钻石，总重约 45 克拉。冠冕可拆解为项链佩戴，展现了 Belle Époque 时期的极致工艺。', source: "Christie's 日内瓦", date: '2021-11-08', tags: ['宫廷', '冠冕', '定制'] },
  { id: 8, name: 'Georg Jensen 银质花丝手镯', era: 'Mid-Century · 1955', cat: '手链', material: '纯银', purchasePrice: '¥250,000', estimatedValue: '¥277,000', status: '良好', statusColor: 'bg-primary-50 text-primary-600', description: 'Georg Jensen 925 纯银手镯，编号 #287，由 Henning Koppel 设计。流线型抽象造型体现了北欧中世纪现代设计美学，手工打磨的银面呈现柔和的缎面光泽。', source: '古董商购入', date: '2023-12-01', tags: ['北欧', '极简', '设计师'] },
  { id: 9, name: 'Boucheron 蓝宝石鸡尾酒戒指', era: 'Art Deco · 1930', cat: '戒指', material: '铂金/蓝宝石', purchasePrice: '¥1,800,000', estimatedValue: '¥2,007,000', status: '完好', statusColor: 'bg-green-50 text-green-700', description: 'Boucheron 1930 年代鸡尾酒戒指，铂金底座中央镶嵌一颗约 6 克拉克什米尔蓝宝石（枕形切割），两侧以阶梯切割钻石衬托。典型的 Art Deco 几何对称设计。', source: "Sotheby's 香港", date: '2023-04-18', tags: ['品牌', '克什米尔', 'Art Deco'] },
  { id: 10, name: 'Victorian 浮雕贝壳胸针', era: 'Victorian · 1860', cat: '胸针', material: '黄金/贝壳', purchasePrice: '¥180,000', estimatedValue: '¥204,000', status: '一般', statusColor: 'bg-yellow-50 text-yellow-700', description: '维多利亚中期浮雕贝壳胸针，黄金框架内嵌手工雕刻的贝壳浮雕，描绘希腊女神侧像。贝壳表面有轻微磨损，黄金框架保持原始的罗马回纹装饰。', source: '遗产拍卖', date: '2024-02-14', tags: ['浮雕', '古典', 'Victorian'] },
]

export const recentItems = [
  { name: 'Cartier Art Deco 钻石胸针', desc: 'Art Deco · 1925 · 铂金/钻石', price: '$185,000', color: 'primary' },
  { name: 'Tiffany 维多利亚蓝宝石项链', desc: 'Victorian · 1880 · 黄金/蓝宝石', price: '$320,000', color: 'accent' },
  { name: 'Lalique 新艺术珐琅蜻蜓胸针', desc: 'Art Nouveau · 1900 · 珐琅/蛋白石', price: '$680,000', color: 'ivory' },
  { name: 'Bulgari Serpenti 祖母绿手链', desc: 'Retro · 1965 · 黄金/祖母绿', price: '$125,000', color: 'primary' },
]

export const filterCategories = ['全部', '戒指', '项链', '手链', '胸针', '耳饰', '吊坠', '冠冕']

/* ========== 年代管理 ========== */
export interface EraItem {
  id: number
  name: string
  nameEn: string
  period: string
  description: string
  count: number
}

export const defaultEras: EraItem[] = [
  { id: 1, name: '乔治亚时期', nameEn: 'Georgian', period: '1714–1837', description: '手工锻造为主，银质镶嵌彩色宝石，自然主义与纹章图案', count: 42 },
  { id: 2, name: '维多利亚时期', nameEn: 'Victorian', period: '1837–1901', description: '浪漫主义风格，哀悼首饰、浮雕贝壳、种子珍珠广泛使用', count: 186 },
  { id: 3, name: '新艺术时期', nameEn: 'Art Nouveau', period: '1890–1910', description: '自然曲线与有机造型，珐琅工艺巅峰，昆虫/花卉母题', count: 98 },
  { id: 4, name: '爱德华时期', nameEn: 'Edwardian', period: '1901–1915', description: '铂金蕾丝般的镂空工艺，花环风格，钻石与珍珠为主', count: 142 },
  { id: 5, name: '装饰艺术时期', nameEn: 'Art Deco', period: '1920–1935', description: '几何造型与对称构图，大胆色彩搭配，机械美学', count: 385 },
  { id: 6, name: '复古时期', nameEn: 'Retro', period: '1935–1950', description: '大体量黄金首饰，好莱坞风格，机械感与建筑线条', count: 295 },
  { id: 7, name: '中世纪现代', nameEn: 'Mid-Century', period: '1950–1970', description: '抽象艺术影响，自由造型，北欧极简与美国波普', count: 178 },
]

/* ========== 品类管理 ========== */
export interface CategoryItem {
  id: number
  name: string
  nameEn: string
  description: string
  count: number
}

export const defaultCategories: CategoryItem[] = [
  { id: 1, name: '戒指', nameEn: 'Ring', description: '订婚戒、鸡尾酒戒、印章戒、永恒戒等', count: 320 },
  { id: 2, name: '项链', nameEn: 'Necklace', description: '链坠、choker、长链、多层链、围脖项链等', count: 215 },
  { id: 3, name: '手链', nameEn: 'Bracelet', description: '手镯、手链、手铐式、网链式等', count: 198 },
  { id: 4, name: '胸针', nameEn: 'Brooch', description: '花卉型、昆虫型、人物型、抽象型胸针等', count: 156 },
  { id: 5, name: '耳饰', nameEn: 'Earring', description: '耳钉、耳坠、耳夹、吊坠耳环等', count: 142 },
  { id: 6, name: '吊坠', nameEn: 'Pendant', description: '独立吊坠、挂坠盒、十字架、浮雕等', count: 168 },
  { id: 7, name: '冠冕', nameEn: 'Tiara', description: '皇冠、冠冕、发饰、发梳等', count: 85 },
  { id: 8, name: '套件', nameEn: 'Parure', description: '成套首饰，通常包含项链、耳饰、手链等', count: 48 },
]

/* ========== 材质管理 ========== */
export interface MaterialItem {
  id: number
  name: string
  nameEn: string
  category: '贵金属' | '宝石' | '有机材质' | '工艺材质'
  description: string
  count: number
}

export const defaultMaterials: MaterialItem[] = [
  { id: 1, name: '黄金', nameEn: 'Gold', category: '贵金属', description: '18K/14K/9K 黄金，最常见的首饰贵金属', count: 580 },
  { id: 2, name: '铂金', nameEn: 'Platinum', category: '贵金属', description: '爱德华时期后广泛使用，耐久性极佳', count: 320 },
  { id: 3, name: '纯银', nameEn: 'Silver', category: '贵金属', description: 'Sterling Silver 925，乔治亚时期常用', count: 145 },
  { id: 4, name: '钻石', nameEn: 'Diamond', category: '宝石', description: '老矿式切割、玫瑰切割、老欧式切割等', count: 485 },
  { id: 5, name: '红宝石', nameEn: 'Ruby', category: '宝石', description: '缅甸鸽血红为顶级，维多利亚时期珍品', count: 128 },
  { id: 6, name: '蓝宝石', nameEn: 'Sapphire', category: '宝石', description: '克什米尔蓝宝石为极品，Art Deco 常见', count: 156 },
  { id: 7, name: '祖母绿', nameEn: 'Emerald', category: '宝石', description: '哥伦比亚产为上品，Retro 时期流行', count: 98 },
  { id: 8, name: '珍珠', nameEn: 'Pearl', category: '有机材质', description: '天然海水珍珠、淡水珍珠、南洋珍珠', count: 265 },
  { id: 9, name: '蛋白石', nameEn: 'Opal', category: '宝石', description: 'Art Nouveau 时期代表性宝石，变彩效果', count: 72 },
  { id: 10, name: '珐琅', nameEn: 'Enamel', category: '工艺材质', description: '掐丝珐琅、内填珐琅、画珐琅等工艺', count: 88 },
  { id: 11, name: '贝壳', nameEn: 'Shell/Cameo', category: '有机材质', description: '浮雕贝壳，维多利亚时期极为流行', count: 64 },
  { id: 12, name: '玫瑰金', nameEn: 'Rose Gold', category: '贵金属', description: '俄罗斯风格，Retro 时期大量使用', count: 175 },
]
