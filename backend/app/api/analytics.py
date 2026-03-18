import logging
from datetime import datetime, timezone, timedelta
from flask import Blueprint, request
from sqlalchemy import func, extract
from ..extensions import db
from ..models import Collection, Era, Category, Material, Brand
from ..utils.response import success

logger = logging.getLogger(__name__)
bp = Blueprint('analytics', __name__)


@bp.route('/summary', methods=['GET'])
def summary():
    logger.info("GET /analytics/summary")
    avg_value = db.session.query(func.avg(Collection.estimated_value)).filter(Collection.is_deleted == False).scalar() or 0
    max_value = db.session.query(func.max(Collection.estimated_value)).filter(Collection.is_deleted == False).scalar() or 0
    material_count = Material.query.count()
    brand_count = Brand.query.count()

    return success({
        'avgValue': round(avg_value, 2),
        'maxValue': max_value,
        'materialTypeCount': material_count,
        'brandCount': brand_count,
    })


@bp.route('/value-by-material', methods=['GET'])
def value_by_material():
    logger.info("GET /analytics/value-by-material")
    results = db.session.query(
        Collection.material,
        func.avg(Collection.estimated_value).label('avg_val'),
        func.max(Collection.estimated_value).label('max_val'),
    ).filter(Collection.is_deleted == False, Collection.material != '').group_by(Collection.material).all()

    data = [
        {'material': r[0], 'avgValue': round(r[1], 2), 'maxValue': r[2]}
        for r in results
    ]
    return success(data)


@bp.route('/era-category-heatmap', methods=['GET'])
def era_category_heatmap():
    logger.info("GET /analytics/era-category-heatmap")
    eras = Era.query.order_by(Era.id.asc()).all()
    categories = Category.query.order_by(Category.id.asc()).all()

    era_names = [e.name_en for e in eras]
    cat_names = [c.name for c in categories]

    counts = db.session.query(
        Collection.era_id,
        Collection.category_id,
        func.count(Collection.id),
    ).filter(Collection.is_deleted == False).group_by(
        Collection.era_id, Collection.category_id
    ).all()
    count_map = {(row[0], row[1]): row[2] for row in counts}

    matrix = []
    for era in eras:
        row = [count_map.get((era.id, cat.id), 0) for cat in categories]
        matrix.append(row)

    return success({
        'eras': era_names,
        'categories': cat_names,
        'matrix': matrix,
    })


@bp.route('/status-distribution', methods=['GET'])
def status_distribution():
    logger.info("GET /analytics/status-distribution")
    results = db.session.query(
        Collection.status,
        func.count(Collection.id),
    ).filter(Collection.is_deleted == False).group_by(Collection.status).all()

    data = [{'status': r[0], 'count': r[1]} for r in results]
    return success(data)


@bp.route('/source-distribution', methods=['GET'])
def source_distribution():
    logger.info("GET /analytics/source-distribution")
    results = db.session.query(
        Collection.source,
        func.count(Collection.id),
    ).filter(Collection.is_deleted == False, Collection.source != '').group_by(Collection.source).order_by(
        func.count(Collection.id).desc()
    ).all()

    data = [{'source': r[0], 'count': r[1]} for r in results]
    return success(data)


@bp.route('/value-trend', methods=['GET'])
def value_trend():
    months = request.args.get('months', 12, type=int)
    logger.info(f"GET /analytics/value-trend - months: {months}")

    now = datetime.now(timezone.utc)
    labels = []
    values = []

    for i in range(months - 1, -1, -1):
        dt = now - timedelta(days=30 * i)
        year, month = dt.year, dt.month
        label = f'{year}-{month:02d}'
        labels.append(label)

        total = db.session.query(func.sum(Collection.estimated_value)).filter(
            Collection.is_deleted == False,
            extract('year', Collection.created_at) <= year,
            db.or_(
                extract('year', Collection.created_at) < year,
                extract('month', Collection.created_at) <= month,
            ),
        ).scalar() or 0
        values.append(total)

    return success({'labels': labels, 'values': values})
