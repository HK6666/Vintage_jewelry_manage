import logging
from datetime import datetime, timezone, timedelta
from flask import Blueprint, request
from sqlalchemy import func, extract
from ..extensions import db
from ..models import Collection, Era, Category
from ..utils.response import success

logger = logging.getLogger(__name__)
bp = Blueprint('dashboard', __name__)


@bp.route('/stats', methods=['GET'])
def stats():
    logger.info("GET /dashboard/stats")
    total_count = Collection.query.count()
    total_value = db.session.query(func.sum(Collection.estimated_value)).scalar() or 0

    era_count = Era.query.count()
    eras = Era.query.order_by(Era.id.asc()).all()
    era_names = [e.name_en for e in eras]

    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_new = Collection.query.filter(Collection.created_at >= month_start).count()

    prev_month_start = (month_start - timedelta(days=1)).replace(day=1)
    prev_monthly = Collection.query.filter(
        Collection.created_at >= prev_month_start,
        Collection.created_at < month_start,
    ).count()
    monthly_change = monthly_new - prev_monthly

    data = {
        'totalCount': total_count,
        'totalCountChange': monthly_change,
        'totalValue': total_value,
        'totalValueChangePercent': 0,
        'eraCount': era_count,
        'eraNames': era_names,
        'monthlyNew': monthly_new,
        'monthlyNewChange': monthly_change,
    }
    logger.info(f"Dashboard stats: totalCount={total_count}")
    return success(data)


@bp.route('/intake-trend', methods=['GET'])
def intake_trend():
    logger.info(f"GET /dashboard/intake-trend - args: {dict(request.args)}")
    year = request.args.get('year', datetime.now(timezone.utc).year, type=int)

    results = db.session.query(
        extract('month', Collection.created_at).label('month'),
        func.count(Collection.id),
    ).filter(
        extract('year', Collection.created_at) == year
    ).group_by('month').order_by('month').all()

    month_map = {int(r[0]): r[1] for r in results}
    labels = [f'{m}月' for m in range(1, 13)]
    values = [month_map.get(m, 0) for m in range(1, 13)]

    return success({'labels': labels, 'values': values})


@bp.route('/category-distribution', methods=['GET'])
def category_distribution():
    logger.info("GET /dashboard/category-distribution")
    categories = Category.query.order_by(Category.id.asc()).all()
    data = [{'name': c.name, 'nameEn': c.name_en, 'count': c.collections.count()} for c in categories]
    return success(data)


@bp.route('/era-distribution', methods=['GET'])
def era_distribution():
    logger.info("GET /dashboard/era-distribution")
    eras = Era.query.order_by(Era.id.asc()).all()
    data = [{'name': e.name, 'nameEn': e.name_en, 'count': e.collections.count()} for e in eras]
    return success(data)
