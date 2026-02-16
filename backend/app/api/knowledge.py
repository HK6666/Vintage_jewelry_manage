import logging
from flask import Blueprint, request
from ..extensions import db
from ..models import Collection, Era, Category
from ..utils.response import success

logger = logging.getLogger(__name__)
bp = Blueprint('knowledge', __name__)

GROUP_COLORS = {
    'item': '#C4872E',
    'era': '#8B2240',
    'material': '#4A7C59',
    'craft': '#5B6ABF',
    'category': '#B8860B',
}

GROUP_LABELS = {
    'item': '藏品',
    'era': '年代',
    'material': '材质',
    'craft': '工艺',
    'category': '品类',
}


@bp.route('/graph', methods=['GET'])
def graph():
    logger.info(f"GET /knowledge/graph - args: {dict(request.args)}")

    nodes = []
    links = []
    node_ids = set()

    collections = Collection.query.all()

    for c in collections:
        item_id = c.name
        if item_id not in node_ids:
            nodes.append({'id': item_id, 'group': 'item', 'r': 16})
            node_ids.add(item_id)

        # Era link
        if c.era_rel:
            era_name = c.era_rel.name_en or c.era_rel.name
            if era_name not in node_ids:
                nodes.append({'id': era_name, 'group': 'era', 'r': 22})
                node_ids.add(era_name)
            links.append({'source': item_id, 'target': era_name})

        # Category link
        if c.category_rel:
            cat_name = c.category_rel.name
            if cat_name not in node_ids:
                nodes.append({'id': cat_name, 'group': 'category', 'r': 18})
                node_ids.add(cat_name)
            links.append({'source': item_id, 'target': cat_name})

        # Material link (text field, split by /)
        if c.material:
            for mat in c.material.split('/'):
                mat = mat.strip()
                if mat and mat not in node_ids:
                    nodes.append({'id': mat, 'group': 'material', 'r': 18})
                    node_ids.add(mat)
                if mat:
                    links.append({'source': item_id, 'target': mat})

    # If no collections, return static data from graphData.ts
    if not collections:
        return _static_knowledge_graph()

    return success({
        'nodes': nodes,
        'links': links,
        'groupColors': GROUP_COLORS,
        'groupLabels': GROUP_LABELS,
    })


def _static_knowledge_graph():
    """Fallback static knowledge graph data."""
    nodes = [
        {'id': 'Cartier胸针', 'group': 'item', 'r': 16},
        {'id': 'Tiffany项链', 'group': 'item', 'r': 16},
        {'id': 'Lalique胸针', 'group': 'item', 'r': 16},
        {'id': 'Bulgari手链', 'group': 'item', 'r': 16},
        {'id': 'VCA红宝石', 'group': 'item', 'r': 16},
        {'id': '珍珠耳坠', 'group': 'item', 'r': 16},
        {'id': 'Chaumet冠冕', 'group': 'item', 'r': 16},
        {'id': 'Jensen手镯', 'group': 'item', 'r': 16},
        {'id': 'Boucheron戒指', 'group': 'item', 'r': 16},
        {'id': '浮雕胸针', 'group': 'item', 'r': 16},
        {'id': 'Victorian', 'group': 'era', 'r': 22},
        {'id': 'Art Nouveau', 'group': 'era', 'r': 22},
        {'id': 'Edwardian', 'group': 'era', 'r': 18},
        {'id': 'Art Deco', 'group': 'era', 'r': 24},
        {'id': 'Retro', 'group': 'era', 'r': 28},
        {'id': '钻石', 'group': 'material', 'r': 20},
        {'id': '蓝宝石', 'group': 'material', 'r': 18},
        {'id': '黄金', 'group': 'material', 'r': 20},
        {'id': '铂金', 'group': 'material', 'r': 16},
        {'id': '珍珠', 'group': 'material', 'r': 14},
        {'id': '红宝石', 'group': 'material', 'r': 14},
        {'id': '祖母绿', 'group': 'material', 'r': 12},
        {'id': '纯银', 'group': 'material', 'r': 12},
        {'id': '微镶工艺', 'group': 'craft', 'r': 18},
        {'id': '珐琅工艺', 'group': 'craft', 'r': 16},
        {'id': '花丝工艺', 'group': 'craft', 'r': 16},
        {'id': '浮雕工艺', 'group': 'craft', 'r': 14},
        {'id': '包镶工艺', 'group': 'craft', 'r': 14},
        {'id': '戒指', 'group': 'category', 'r': 18},
        {'id': '胸针', 'group': 'category', 'r': 16},
        {'id': '耳饰', 'group': 'category', 'r': 14},
        {'id': '项链', 'group': 'category', 'r': 16},
        {'id': '冠冕', 'group': 'category', 'r': 14},
        {'id': '手链', 'group': 'category', 'r': 12},
    ]
    links = [
        {'source': 'Cartier胸针', 'target': 'Art Deco'},
        {'source': 'Tiffany项链', 'target': 'Victorian'},
        {'source': 'Lalique胸针', 'target': 'Art Nouveau'},
        {'source': 'Bulgari手链', 'target': 'Retro'},
        {'source': 'VCA红宝石', 'target': 'Retro'},
        {'source': '珍珠耳坠', 'target': 'Edwardian'},
        {'source': 'Chaumet冠冕', 'target': 'Edwardian'},
        {'source': 'Jensen手镯', 'target': 'Retro'},
        {'source': 'Boucheron戒指', 'target': 'Art Deco'},
        {'source': '浮雕胸针', 'target': 'Victorian'},
        {'source': 'Cartier胸针', 'target': '铂金'},
        {'source': 'Cartier胸针', 'target': '钻石'},
        {'source': 'Tiffany项链', 'target': '蓝宝石'},
        {'source': 'Lalique胸针', 'target': '黄金'},
        {'source': 'Bulgari手链', 'target': '祖母绿'},
        {'source': 'VCA红宝石', 'target': '红宝石'},
        {'source': '珍珠耳坠', 'target': '珍珠'},
        {'source': 'Chaumet冠冕', 'target': '钻石'},
        {'source': 'Chaumet冠冕', 'target': '铂金'},
        {'source': 'Jensen手镯', 'target': '纯银'},
        {'source': 'Boucheron戒指', 'target': '蓝宝石'},
        {'source': '浮雕胸针', 'target': '黄金'},
        {'source': 'Cartier胸针', 'target': '微镶工艺'},
        {'source': 'Lalique胸针', 'target': '珐琅工艺'},
        {'source': 'Lalique胸针', 'target': '花丝工艺'},
        {'source': '珍珠耳坠', 'target': '花丝工艺'},
        {'source': 'Chaumet冠冕', 'target': '微镶工艺'},
        {'source': 'Boucheron戒指', 'target': '微镶工艺'},
        {'source': '浮雕胸针', 'target': '浮雕工艺'},
        {'source': 'Cartier胸针', 'target': '胸针'},
        {'source': 'Tiffany项链', 'target': '项链'},
        {'source': 'Lalique胸针', 'target': '胸针'},
        {'source': 'Bulgari手链', 'target': '手链'},
        {'source': 'VCA红宝石', 'target': '项链'},
        {'source': '珍珠耳坠', 'target': '耳饰'},
        {'source': 'Chaumet冠冕', 'target': '冠冕'},
        {'source': 'Jensen手镯', 'target': '手链'},
        {'source': 'Boucheron戒指', 'target': '戒指'},
        {'source': '浮雕胸针', 'target': '胸针'},
        {'source': '钻石', 'target': '微镶工艺'},
        {'source': '黄金', 'target': '珐琅工艺'},
        {'source': '黄金', 'target': '花丝工艺'},
        {'source': '铂金', 'target': '微镶工艺'},
    ]
    return success({
        'nodes': nodes,
        'links': links,
        'groupColors': GROUP_COLORS,
        'groupLabels': GROUP_LABELS,
    })
