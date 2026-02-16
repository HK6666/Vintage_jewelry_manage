from flask import request
import math


def parse_pagination():
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('pageSize', 20, type=int)
    sort_by = request.args.get('sortBy', 'id')
    order = request.args.get('order', 'desc')
    page = max(1, page)
    page_size = max(1, min(100, page_size))
    return page, page_size, sort_by, order


def paginated_response(query, page, page_size, sort_by, order, model):
    sort_col = getattr(model, sort_by, model.id)
    if order == 'asc':
        query = query.order_by(sort_col.asc())
    else:
        query = query.order_by(sort_col.desc())

    total = query.count()
    total_pages = math.ceil(total / page_size) if page_size else 0
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        'items': [item.to_dict() for item in items],
        'total': total,
        'page': page,
        'pageSize': page_size,
        'totalPages': total_pages,
    }
