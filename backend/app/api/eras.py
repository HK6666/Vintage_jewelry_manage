import logging
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from ..extensions import db
from ..models.era import Era
from ..utils.response import success, error

logger = logging.getLogger(__name__)
bp = Blueprint('eras', __name__)


@bp.route('', methods=['GET'])
def list_eras():
    logger.info(f"GET /eras - args: {dict(request.args)}")
    keyword = request.args.get('keyword', '')
    page = request.args.get('page', type=int)
    page_size = request.args.get('pageSize', 20, type=int)

    query = Era.query
    if keyword:
        query = query.filter(db.or_(
            Era.name.ilike(f'%{keyword}%'),
            Era.name_en.ilike(f'%{keyword}%'),
        ))

    if page:
        total = query.count()
        items = query.order_by(Era.id.asc()).offset((page - 1) * page_size).limit(page_size).all()
        import math
        return success({
            'items': [e.to_dict() for e in items],
            'total': total,
            'page': page,
            'pageSize': page_size,
            'totalPages': math.ceil(total / page_size),
        })

    items = query.order_by(Era.id.asc()).all()
    return success([e.to_dict() for e in items])


@bp.route('/<int:id>', methods=['GET'])
def get_era(id):
    logger.info(f"GET /eras/{id}")
    item = db.session.get(Era, id)
    if not item:
        logger.warning(f"Era id={id} not found")
        return error('年代不存在', 404)
    return success(item.to_dict())


@bp.route('', methods=['POST'])
@jwt_required()
def create_era():
    data = request.get_json(silent=True) or {}
    logger.info(f"POST /eras - name: {data.get('name')}")

    if not data.get('name'):
        return error('名称不能为空', 400)

    if Era.query.filter_by(name=data['name']).first():
        return error('该年代已存在', 409)

    item = Era(
        name=data['name'],
        name_en=data.get('nameEn', ''),
        period=data.get('period', ''),
        description=data.get('description', ''),
    )

    try:
        db.session.add(item)
        db.session.commit()
        logger.info(f"Created era id={item.id}")
        return success(item.to_dict(), '创建成功', 201)
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to create era: {e}", exc_info=True)
        return error('创建失败', 500)


@bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_era(id):
    data = request.get_json(silent=True) or {}
    logger.info(f"PUT /eras/{id}")

    item = db.session.get(Era, id)
    if not item:
        return error('年代不存在', 404)

    if 'name' in data:
        item.name = data['name']
    if 'nameEn' in data:
        item.name_en = data['nameEn']
    if 'period' in data:
        item.period = data['period']
    if 'description' in data:
        item.description = data['description']

    try:
        db.session.commit()
        logger.info(f"Updated era id={id}")
        return success(item.to_dict(), '更新成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to update era id={id}: {e}", exc_info=True)
        return error('更新失败', 500)


@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_era(id):
    logger.info(f"DELETE /eras/{id}")
    item = db.session.get(Era, id)
    if not item:
        return error('年代不存在', 404)

    if item.collections.count() > 0:
        return error('该年代下存在关联藏品，请先解除关联', 409)

    try:
        db.session.delete(item)
        db.session.commit()
        logger.info(f"Deleted era id={id}")
        return success(message='删除成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to delete era id={id}: {e}", exc_info=True)
        return error('删除失败', 500)


@bp.route('/batch', methods=['DELETE'])
@jwt_required()
def batch_delete_eras():
    data = request.get_json(silent=True) or {}
    ids = data.get('ids', [])
    logger.info(f"DELETE /eras/batch - ids: {ids}")

    if not ids:
        return error('请提供要删除的ID列表', 400)

    from ..models.collection import Collection
    conflict = Era.query.filter(Era.id.in_(ids)).join(Collection).first()
    if conflict:
        return error('部分年代存在关联藏品，请先解除关联', 409)

    try:
        Era.query.filter(Era.id.in_(ids)).delete(synchronize_session=False)
        db.session.commit()
        logger.info(f"Batch deleted eras: {ids}")
        return success(message='批量删除成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to batch delete eras: {e}", exc_info=True)
        return error('批量删除失败', 500)
