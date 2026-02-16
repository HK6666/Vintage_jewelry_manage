import logging
from flask import Blueprint, request
from ..utils.response import success

logger = logging.getLogger(__name__)
bp = Blueprint('correlations', __name__)

# Static correlation data matching the frontend graphData.ts
CORRELATION_NODES = [
    {'id': '钻石', 'group': 'material', 'r': 28},
    {'id': '铂金', 'group': 'material', 'r': 22},
    {'id': '黄金', 'group': 'material', 'r': 24},
    {'id': '珍珠', 'group': 'material', 'r': 18},
    {'id': 'Art Deco', 'group': 'era', 'r': 30},
    {'id': 'Victorian', 'group': 'era', 'r': 26},
    {'id': 'Edwardian', 'group': 'era', 'r': 20},
    {'id': 'Art Nouveau', 'group': 'era', 'r': 16},
    {'id': '胸针', 'group': 'type', 'r': 20},
    {'id': '戒指', 'group': 'type', 'r': 22},
    {'id': '项链', 'group': 'type', 'r': 18},
    {'id': '冠冕', 'group': 'type', 'r': 14},
    {'id': '微镶', 'group': 'craft', 'r': 20},
    {'id': '珐琅', 'group': 'craft', 'r': 16},
    {'id': '花丝', 'group': 'craft', 'r': 18},
]

CORRELATION_LINKS = [
    {'source': '钻石', 'target': 'Art Deco', 'value': 0.92},
    {'source': '钻石', 'target': '微镶', 'value': 0.85},
    {'source': '钻石', 'target': '戒指', 'value': 0.7},
    {'source': '铂金', 'target': 'Edwardian', 'value': 0.78},
    {'source': '铂金', 'target': '项链', 'value': 0.82},
    {'source': '黄金', 'target': '珐琅', 'value': 0.87},
    {'source': '黄金', 'target': '冠冕', 'value': 0.75},
    {'source': '黄金', 'target': 'Victorian', 'value': 0.68},
    {'source': '珍珠', 'target': 'Edwardian', 'value': 0.6},
    {'source': '珍珠', 'target': '项链', 'value': 0.55},
    {'source': '戒指', 'target': '微镶', 'value': 0.65},
    {'source': '戒指', 'target': 'Art Deco', 'value': 0.58},
    {'source': '胸针', 'target': 'Art Nouveau', 'value': 0.72},
    {'source': '冠冕', 'target': 'Edwardian', 'value': 0.7},
    {'source': '花丝', 'target': 'Victorian', 'value': 0.8},
    {'source': '珐琅', 'target': 'Art Nouveau', 'value': 0.75},
    {'source': '微镶', 'target': 'Art Deco', 'value': 0.6},
    {'source': 'Victorian', 'target': '胸针', 'value': 0.55},
]

GROUP_COLORS = {
    'material': '#4A7C59',
    'era': '#8B2240',
    'type': '#B8860B',
    'craft': '#5B6ABF',
}


@bp.route('/graph', methods=['GET'])
def graph():
    logger.info(f"GET /correlations/graph - args: {dict(request.args)}")
    dimension = request.args.get('dimension', '')
    era = request.args.get('era', '')

    nodes = CORRELATION_NODES
    links = CORRELATION_LINKS

    if dimension:
        node_ids = {n['id'] for n in nodes if n['group'] == dimension}
        related_links = [l for l in links if l['source'] in node_ids or l['target'] in node_ids]
        related_ids = node_ids.copy()
        for l in related_links:
            related_ids.add(l['source'])
            related_ids.add(l['target'])
        nodes = [n for n in nodes if n['id'] in related_ids]
        links = related_links

    if era:
        related_links = [l for l in links if l['source'] == era or l['target'] == era]
        related_ids = {era}
        for l in related_links:
            related_ids.add(l['source'])
            related_ids.add(l['target'])
        nodes = [n for n in CORRELATION_NODES if n['id'] in related_ids]
        links = related_links

    return success({
        'nodes': nodes,
        'links': links,
        'groupColors': GROUP_COLORS,
    })


@bp.route('/strong-pairs', methods=['GET'])
def strong_pairs():
    limit = request.args.get('limit', 10, type=int)
    threshold = request.args.get('threshold', 0.5, type=float)
    dimension = request.args.get('dimension', '')
    logger.info(f"GET /correlations/strong-pairs - limit: {limit}, threshold: {threshold}")

    pairs = sorted(CORRELATION_LINKS, key=lambda x: x['value'], reverse=True)

    if dimension:
        dim_ids = {n['id'] for n in CORRELATION_NODES if n['group'] == dimension}
        pairs = [p for p in pairs if p['source'] in dim_ids or p['target'] in dim_ids]

    pairs = [p for p in pairs if p['value'] >= threshold][:limit]

    insights = {
        ('钻石', 'Art Deco'): 'Art Deco 时期大量使用钻石微镶工艺，几何造型为标志性设计语言',
        ('钻石', '微镶'): '钻石与微镶工艺高度关联，精密镶嵌展现宝石火彩',
        ('黄金', '珐琅'): '黄金是珐琅工艺的理想基底，新艺术时期珐琅首饰多用黄金',
        ('铂金', '项链'): '铂金因其白色光泽和强度，成为项链特别是钻石项链的首选',
        ('花丝', 'Victorian'): '维多利亚时期花丝工艺达到巅峰，精细金丝编织展现手工极致',
    }

    data = []
    for p in pairs:
        key = (p['source'], p['target'])
        insight = insights.get(key, insights.get((p['target'], p['source']), ''))
        data.append({
            'nodeA': p['source'],
            'nodeB': p['target'],
            'strength': p['value'],
            'sharedCount': int(p['value'] * 180),
            'insight': insight,
        })

    return success(data)
