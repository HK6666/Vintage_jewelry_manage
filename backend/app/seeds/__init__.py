import logging
from ..extensions import db
from ..models import User, Era, Category, Material, Brand, Color, Tag, Collection

logger = logging.getLogger(__name__)


def seed_all():
    """Seed database with initial data from frontend defaults."""
    db.create_all()

    _seed_users()
    _seed_eras()
    _seed_categories()
    _seed_materials()
    _seed_brands()
    _seed_colors()
    _seed_collections()

    db.session.commit()
    logger.info("All seed data loaded successfully")


def _seed_users():
    if User.query.first():
        logger.info("Users already seeded, skipping")
        return
    admin = User(username='admin', avatar='', role='admin')
    admin.set_password('admin123321')
    db.session.add(admin)
    db.session.commit()
    logger.info("Seeded admin user")


def _seed_eras():
    if Era.query.first():
        logger.info("Eras already seeded, skipping")
        return
    eras = [
        ('1830年代', '1830s', '1830–1839', '晚期乔治亚风格，手工锻造银质首饰，自然主义图案'),
        ('1840年代', '1840s', '1840–1849', '早期维多利亚，浪漫主义风格兴起，哀悼首饰流行'),
        ('1850年代', '1850s', '1850–1859', '维多利亚中期，金矿发现推动黄金首饰发展'),
        ('1860年代', '1860s', '1860–1869', '浮雕贝壳与种子珍珠广泛使用，伊特鲁里亚复兴风格'),
        ('1870年代', '1870s', '1870–1879', '维多利亚晚期，星形胸针与昆虫造型流行'),
        ('1880年代', '1880s', '1880–1889', '审美运动影响，日本主义元素融入首饰设计'),
        ('1890年代', '1890s', '1890–1899', '新艺术运动萌芽，自然曲线与有机造型初现'),
        ('1900年代', '1900s', '1900–1909', '新艺术巅峰与爱德华风格并行，珐琅工艺鼎盛'),
        ('1910年代', '1910s', '1910–1919', 'Belle Époque 尾声，铂金花环风格，一战影响'),
        ('1920年代', '1920s', '1920–1929', 'Art Deco 黄金期，几何造型与对称构图，爵士时代'),
        ('1930年代', '1930s', '1930–1939', 'Art Deco 晚期至 Retro 过渡，大萧条影响设计简化'),
        ('1940年代', '1940s', '1940–1949', 'Retro 风格，大体量黄金首饰，好莱坞风格'),
        ('1950年代', '1950s', '1950–1959', '战后繁荣，铂金回归，优雅精致的鸡尾酒首饰'),
        ('1960年代', '1960s', '1960–1969', '大胆前卫设计，波普艺术影响，意大利风格崛起'),
        ('1970年代', '1970s', '1970–1979', '自然主义回归，大颗彩色宝石，民族风格元素'),
        ('1980年代', '1980s', '1980–1989', '奢华夸张风格，大体量黄金首饰，权力造型'),
        ('1990年代', '1990s', '1990–1999', '极简主义兴起，铂金流行，设计师品牌化'),
        ('2000年代', '2000s', '2000–2009', '复古风潮回归，高级定制珠宝，彩色钻石热'),
        ('2010年代', '2010s', '2010–2019', '可持续珠宝理念，实验室培育宝石，个性化定制'),
        ('2020年代', '2020s', '2020–2029', '数字化与传统工艺融合，中性风格，可追溯性'),
    ]
    for name, name_en, period, desc in eras:
        db.session.add(Era(name=name, name_en=name_en, period=period, description=desc))
    db.session.commit()
    logger.info(f"Seeded {len(eras)} eras")


def _seed_categories():
    if Category.query.first():
        logger.info("Categories already seeded, skipping")
        return
    cats = [
        ('戒指', 'Ring', '订婚戒、鸡尾酒戒、印章戒、永恒戒等'),
        ('项链', 'Necklace', '链坠、choker、长链、多层链、围脖项链等'),
        ('手链', 'Bracelet', '手镯、手链、手铐式、网链式等'),
        ('胸针', 'Brooch', '花卉型、昆虫型、人物型、抽象型胸针等'),
        ('耳饰', 'Earring', '耳钉、耳坠、耳夹、吊坠耳环等'),
        ('吊坠', 'Pendant', '独立吊坠、挂坠盒、十字架、浮雕等'),
        ('冠冕', 'Tiara', '皇冠、冠冕、发饰、发梳等'),
        ('套件', 'Parure', '成套首饰，通常包含项链、耳饰、手链等'),
    ]
    for name, name_en, desc in cats:
        db.session.add(Category(name=name, name_en=name_en, description=desc))
    db.session.commit()
    logger.info(f"Seeded {len(cats)} categories")


def _seed_materials():
    if Material.query.first():
        logger.info("Materials already seeded, skipping")
        return
    mats = [
        ('黄金', 'Gold', '贵金属', '18K/14K/9K 黄金，最常见的首饰贵金属'),
        ('铂金', 'Platinum', '贵金属', '爱德华时期后广泛使用，耐久性极佳'),
        ('纯银', 'Silver', '贵金属', 'Sterling Silver 925，乔治亚时期常用'),
        ('钻石', 'Diamond', '宝石', '老矿式切割、玫瑰切割、老欧式切割等'),
        ('红宝石', 'Ruby', '宝石', '缅甸鸽血红为顶级，维多利亚时期珍品'),
        ('蓝宝石', 'Sapphire', '宝石', '克什米尔蓝宝石为极品，Art Deco 常见'),
        ('祖母绿', 'Emerald', '宝石', '哥伦比亚产为上品，Retro 时期流行'),
        ('珍珠', 'Pearl', '有机材质', '天然海水珍珠、淡水珍珠、南洋珍珠'),
        ('蛋白石', 'Opal', '宝石', 'Art Nouveau 时期代表性宝石，变彩效果'),
        ('珐琅', 'Enamel', '工艺材质', '掐丝珐琅、内填珐琅、画珐琅等工艺'),
        ('贝壳', 'Shell/Cameo', '有机材质', '浮雕贝壳，维多利亚时期极为流行'),
        ('玫瑰金', 'Rose Gold', '贵金属', '俄罗斯风格，Retro 时期大量使用'),
    ]
    for name, name_en, category, desc in mats:
        db.session.add(Material(name=name, name_en=name_en, category=category, description=desc))
    db.session.commit()
    logger.info(f"Seeded {len(mats)} materials")


def _seed_brands():
    if Brand.query.first():
        logger.info("Brands already seeded, skipping")
        return
    brands = [
        ('卡地亚', 'Cartier', '法国', '1847年创立于巴黎，"皇帝的珠宝商，珠宝商的皇帝"'),
        ('蒂芙尼', 'Tiffany & Co.', '美国', '1837年创立于纽约，以钻石和银饰闻名'),
        ('宝格丽', 'Bvlgari', '意大利', '1884年创立于罗马，大胆色彩与意式风格'),
        ('梵克雅宝', 'Van Cleef & Arpels', '法国', '1906年创立于巴黎，隐密式镶嵌工艺发明者'),
        ('尚美巴黎', 'Chaumet', '法国', '1780年创立，拿破仑御用珠宝商，冠冕大师'),
        ('宝诗龙', 'Boucheron', '法国', '1858年创立于巴黎，旺多姆广场首家珠宝店'),
        ('海瑞温斯顿', 'Harry Winston', '美国', '"钻石之王"，拥有多颗传奇名钻'),
        ('拉利克', 'Lalique', '法国', 'René Lalique 创立，新艺术运动代表，珐琅大师'),
        ('乔治·杰生', 'Georg Jensen', '丹麦', '1904年创立，北欧银饰设计典范'),
        ('伯爵', 'Piaget', '瑞士', '1874年创立，超薄工艺与宝石镶嵌闻名'),
    ]
    for name, name_en, country, desc in brands:
        db.session.add(Brand(name=name, name_en=name_en, country=country, description=desc))
    db.session.commit()
    logger.info(f"Seeded {len(brands)} brands")


def _seed_colors():
    if Color.query.first():
        logger.info("Colors already seeded, skipping")
        return
    colors = [
        ('金色系', 'Gold', '#D4A853', '黄金、玫瑰金等暖金属色调'),
        ('银色系', 'Silver', '#C0C0C0', '银、铂金、白金等冷金属色调'),
        ('红色系', 'Red', '#B22234', '红宝石、石榴石、珊瑚等红色调'),
        ('蓝色系', 'Blue', '#2857A4', '蓝宝石、坦桑石、海蓝宝等蓝色调'),
        ('绿色系', 'Green', '#2E8B57', '祖母绿、翡翠、橄榄石等绿色调'),
        ('白色系', 'White', '#F5F5F5', '钻石、珍珠、月光石等白色/无色调'),
        ('黑色系', 'Black', '#2C2C2C', '黑曜石、缟玛瑙、黑钻等深色调'),
        ('多彩', 'Multicolor', 'linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)', '多种色彩混合，珐琅、蛋白石变彩等'),
    ]
    for name, name_en, hex_val, desc in colors:
        db.session.add(Color(name=name, name_en=name_en, hex=hex_val, description=desc))
    db.session.commit()
    logger.info(f"Seeded {len(colors)} colors")


def _seed_collections():
    if Collection.query.first():
        logger.info("Collections already seeded, skipping")
        return

    # Lookup maps
    def find_era(keyword):
        return Era.query.filter(Era.name_en.ilike(f'%{keyword}%')).first()

    def find_cat(name):
        return Category.query.filter_by(name=name).first()

    def find_brand(keyword):
        return Brand.query.filter(Brand.name_en.ilike(f'%{keyword}%')).first()

    def find_color(name):
        return Color.query.filter_by(name=name).first()

    items_data = [
        {
            'name': 'Cartier Art Deco 钻石胸针',
            'era_kw': '1920s', 'cat': '胸针', 'material': '铂金/钻石',
            'brand_kw': 'Cartier', 'color': '白色系',
            'price': 1200000, 'value': 1350000, 'status': '完好',
            'desc': '这枚 Cartier 胸针创作于 1925 年巴黎，采用铂金底座，镶嵌约 12 克拉老矿式切割钻石。设计以典型 Art Deco 几何图案为基础，展现了该时期对称与线条美学的巅峰。胸针背面刻有 Cartier Paris 及编号，保存极为完好。',
            'source': "Christie's 纽约拍卖", 'date': '2023-06-15',
            'tags': ['宫廷', '镶嵌', 'Art Deco'],
        },
        {
            'name': 'Tiffany 维多利亚蓝宝石项链',
            'era_kw': '1880s', 'cat': '项链', 'material': '黄金/蓝宝石',
            'brand_kw': 'Tiffany', 'color': '蓝色系',
            'price': 2100000, 'value': 2340000, 'status': '良好',
            'desc': 'Tiffany & Co. 维多利亚时期杰作，18K 黄金链身搭配一颗约 8.5 克拉锡兰蓝宝石主石，周围环绕种子珍珠。链扣处刻有 Tiffany & Co. 标识，展现了维多利亚晚期审美风格。',
            'source': "Sotheby's 伦敦拍卖", 'date': '2022-11-20',
            'tags': ['品牌', '蓝宝石', 'Victorian'],
        },
        {
            'name': 'Lalique 新艺术珐琅蜻蜓胸针',
            'era_kw': '1900s', 'cat': '胸针', 'material': '黄金/珐琅/蛋白石',
            'brand_kw': 'Lalique', 'color': '多彩',
            'price': 4500000, 'value': 4960000, 'status': '需修复',
            'desc': 'René Lalique 大师亲制蜻蜓胸针，约 1900 年作品。采用 plique-à-jour 透光珐琅工艺制作蜻蜓翅膀，腹部镶嵌一颗火彩绚丽的澳大利亚蛋白石。珐琅部分有轻微裂纹，需专业修复。',
            'source': '私人藏家转让', 'date': '2024-01-08',
            'tags': ['珐琅', '大师作品', 'Art Nouveau'],
        },
        {
            'name': 'Bulgari Serpenti 祖母绿手链',
            'era_kw': '1960s', 'cat': '手链', 'material': '黄金/祖母绿',
            'brand_kw': 'Bvlgari', 'color': '绿色系',
            'price': 820000, 'value': 912000, 'status': '良好',
            'desc': 'Bulgari 经典 Serpenti 蛇形手链，18K 黄金鳞片状链节，蛇头镶嵌一对梨形哥伦比亚祖母绿作为眼睛。典型的 1960 年代意大利珠宝风格，大胆而奢华。',
            'source': '古董商购入', 'date': '2023-09-03',
            'tags': ['品牌', 'Serpenti', 'Retro'],
        },
        {
            'name': 'Van Cleef & Arpels 红宝石套件',
            'era_kw': '1940s', 'cat': '项链', 'material': '黄金/红宝石',
            'brand_kw': 'Van Cleef', 'color': '红色系',
            'price': 3000000, 'value': 3285000, 'status': '完好',
            'desc': 'Van Cleef & Arpels 1945 年 Retro 风格套件，包含项链与配套耳夹。18K 玫瑰金机械感设计，镶嵌缅甸红宝石约 15 克拉（无烧），展现了战后好莱坞黄金时代的奢华风格。',
            'source': '遗产拍卖', 'date': '2022-05-12',
            'tags': ['套件', '红宝石', '无烧'],
        },
        {
            'name': '爱德华时期珍珠流苏耳坠',
            'era_kw': '1900s', 'cat': '耳饰', 'material': '铂金/珍珠',
            'brand_kw': '', 'color': '白色系',
            'price': 600000, 'value': 671000, 'status': '一般',
            'desc': '爱德华时期铂金耳坠，采用花环风格设计，铂金蕾丝般的镂空框架悬挂天然海水珍珠流苏。珍珠光泽略有暗淡，铂金框架有使用痕迹，整体保持时代特征。',
            'source': '线上平台', 'date': '2024-03-22',
            'tags': ['铂金', '珍珠', 'Edwardian'],
        },
        {
            'name': 'Chaumet 钻石冠冕',
            'era_kw': '1910s', 'cat': '冠冕', 'material': '铂金/钻石',
            'brand_kw': 'Chaumet', 'color': '白色系',
            'price': 8000000, 'value': 8760000, 'status': '完好',
            'desc': 'Chaumet 为法国贵族定制的钻石冠冕，约 1910 年作品。铂金底座镶嵌超过 200 颗老欧式切割钻石，总重约 45 克拉。冠冕可拆解为项链佩戴，展现了 Belle Époque 时期的极致工艺。',
            'source': "Christie's 日内瓦", 'date': '2021-11-08',
            'tags': ['宫廷', '冠冕', '定制'],
        },
        {
            'name': 'Georg Jensen 银质花丝手镯',
            'era_kw': '1950s', 'cat': '手链', 'material': '纯银',
            'brand_kw': 'Georg Jensen', 'color': '银色系',
            'price': 250000, 'value': 277000, 'status': '良好',
            'desc': 'Georg Jensen 925 纯银手镯，编号 #287，由 Henning Koppel 设计。流线型抽象造型体现了北欧中世纪现代设计美学，手工打磨的银面呈现柔和的缎面光泽。',
            'source': '古董商购入', 'date': '2023-12-01',
            'tags': ['北欧', '极简', '设计师'],
        },
        {
            'name': 'Boucheron 蓝宝石鸡尾酒戒指',
            'era_kw': '1930s', 'cat': '戒指', 'material': '铂金/蓝宝石',
            'brand_kw': 'Boucheron', 'color': '蓝色系',
            'price': 1800000, 'value': 2007000, 'status': '完好',
            'desc': 'Boucheron 1930 年代鸡尾酒戒指，铂金底座中央镶嵌一颗约 6 克拉克什米尔蓝宝石（枕形切割），两侧以阶梯切割钻石衬托。典型的 Art Deco 几何对称设计。',
            'source': "Sotheby's 香港", 'date': '2023-04-18',
            'tags': ['品牌', '克什米尔', 'Art Deco'],
        },
        {
            'name': 'Victorian 浮雕贝壳胸针',
            'era_kw': '1860s', 'cat': '胸针', 'material': '黄金/贝壳',
            'brand_kw': '', 'color': '金色系',
            'price': 180000, 'value': 204000, 'status': '一般',
            'desc': '维多利亚中期浮雕贝壳胸针，黄金框架内嵌手工雕刻的贝壳浮雕，描绘希腊女神侧像。贝壳表面有轻微磨损，黄金框架保持原始的罗马回纹装饰。',
            'source': '遗产拍卖', 'date': '2024-02-14',
            'tags': ['浮雕', '古典', 'Victorian'],
        },
    ]

    for d in items_data:
        era = find_era(d['era_kw']) if d['era_kw'] else None
        cat = find_cat(d['cat']) if d['cat'] else None
        brand = find_brand(d['brand_kw']) if d['brand_kw'] else None
        color = find_color(d['color']) if d['color'] else None

        collection = Collection(
            name=d['name'],
            era_id=era.id if era else None,
            category_id=cat.id if cat else None,
            material=d['material'],
            brand_id=brand.id if brand else None,
            color_id=color.id if color else None,
            purchase_price=d['price'],
            estimated_value=d['value'],
            status=d['status'],
            description=d['desc'],
            source=d['source'],
            date=d['date'],
        )

        for tag_name in d.get('tags', []):
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
                db.session.flush()
            collection.tags.append(tag)

        db.session.add(collection)

    db.session.commit()
    logger.info(f"Seeded {len(items_data)} collections")
