import io
import csv
import json
import logging
from flask import Blueprint, request, Response
from ..extensions import db
from ..models import Collection, Era, Category, Brand, Color
from ..utils.response import error

logger = logging.getLogger(__name__)
bp = Blueprint('export', __name__)


@bp.route('/collections', methods=['GET'])
def export_collections():
    fmt = request.args.get('format', 'json')
    ids_str = request.args.get('ids', '')
    logger.info(f"GET /export/collections - format: {fmt}, ids: {ids_str}")

    query = Collection.query

    if ids_str:
        ids = [int(x) for x in ids_str.split(',') if x.strip().isdigit()]
        query = query.filter(Collection.id.in_(ids))

    # Apply same filters as collection list
    keyword = request.args.get('keyword', '')
    if keyword:
        query = query.filter(db.or_(
            Collection.name.ilike(f'%{keyword}%'),
            Collection.description.ilike(f'%{keyword}%'),
        ))

    status = request.args.get('status', '')
    if status:
        query = query.filter_by(status=status)

    items = query.order_by(Collection.id.asc()).all()

    if fmt == 'csv':
        return _export_csv(items)
    else:
        return _export_json(items)


def _export_json(items):
    data = [item.to_dict() for item in items]
    content = json.dumps(data, ensure_ascii=False, indent=2)
    return Response(
        content,
        mimetype='application/json',
        headers={'Content-Disposition': 'attachment; filename=collections.json'},
    )


def _export_csv(items):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        'ID', '名称', '年代', '品类', '材质', '品牌', '色系',
        '购入价格', '预估价值', '保存状态', '来源', '入手日期', '标签', '描述',
    ])
    for item in items:
        d = item.to_dict()
        writer.writerow([
            d['id'], d['name'], d['era'], d['cat'], d['material'],
            d['brand'], d['colorScheme'], d['purchasePrice'], d['estimatedValue'],
            d['status'], d['source'], d['date'],
            ','.join(d['tags']), d['description'],
        ])

    content = output.getvalue()
    return Response(
        '\ufeff' + content,  # BOM for Excel UTF-8 compatibility
        mimetype='text/csv; charset=utf-8',
        headers={'Content-Disposition': 'attachment; filename=collections.csv'},
    )
