import logging
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from ..extensions import db
from ..models.color import Color
from ..utils.response import success, error

logger = logging.getLogger(__name__)
bp = Blueprint('colors', __name__)


@bp.route('', methods=['GET'])
def list_colors():
    logger.info(f"GET /colors - args: {dict(request.args)}")
    keyword = request.args.get('keyword', '')
    query = Color.query
    if keyword:
        query = query.filter(db.or_(
            Color.name.ilike(f'%{keyword}%'),
            Color.name_en.ilike(f'%{keyword}%'),
        ))
    items = query.order_by(Color.id.asc()).all()
    return success([c.to_dict() for c in items])


@bp.route('/<int:id>', methods=['GET'])
def get_color(id):
    logger.info(f"GET /colors/{id}")
    item = db.session.get(Color, id)
    if not item:
        return error('色系不存在', 404)
    return success(item.to_dict())


@bp.route('', methods=['POST'])
@jwt_required()
def create_color():
    data = request.get_json(silent=True) or {}
    logger.info(f"POST /colors - name: {data.get('name')}")
    if not data.get('name'):
        return error('名称不能为空', 400)
    if Color.query.filter_by(name=data['name']).first():
        return error('该色系已存在', 409)

    item = Color(
        name=data['name'],
        name_en=data.get('nameEn', ''),
        hex=data.get('hex', ''),
        description=data.get('description', ''),
    )
    try:
        db.session.add(item)
        db.session.commit()
        logger.info(f"Created color id={item.id}")
        return success(item.to_dict(), '创建成功', 201)
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to create color: {e}", exc_info=True)
        return error('创建失败', 500)


@bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_color(id):
    data = request.get_json(silent=True) or {}
    logger.info(f"PUT /colors/{id}")
    item = db.session.get(Color, id)
    if not item:
        return error('色系不存在', 404)

    if 'name' in data:
        item.name = data['name']
    if 'nameEn' in data:
        item.name_en = data['nameEn']
    if 'hex' in data:
        item.hex = data['hex']
    if 'description' in data:
        item.description = data['description']

    try:
        db.session.commit()
        logger.info(f"Updated color id={id}")
        return success(item.to_dict(), '更新成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to update color: {e}", exc_info=True)
        return error('更新失败', 500)


@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_color(id):
    logger.info(f"DELETE /colors/{id}")
    item = db.session.get(Color, id)
    if not item:
        return error('色系不存在', 404)
    if item.collections.count() > 0:
        return error('该色系下存在关联藏品，请先解除关联', 409)
    try:
        db.session.delete(item)
        db.session.commit()
        logger.info(f"Deleted color id={id}")
        return success(message='删除成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to delete color: {e}", exc_info=True)
        return error('删除失败', 500)


@bp.route('/batch', methods=['DELETE'])
@jwt_required()
def batch_delete_colors():
    data = request.get_json(silent=True) or {}
    ids = data.get('ids', [])
    logger.info(f"DELETE /colors/batch - ids: {ids}")
    if not ids:
        return error('请提供要删除的ID列表', 400)

    from ..models.collection import Collection
    conflict = Color.query.filter(Color.id.in_(ids)).join(Collection).first()
    if conflict:
        return error('部分色系存在关联藏品，请先解除关联', 409)

    try:
        Color.query.filter(Color.id.in_(ids)).delete(synchronize_session=False)
        db.session.commit()
        logger.info(f"Batch deleted colors: {ids}")
        return success(message='批量删除成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to batch delete colors: {e}", exc_info=True)
        return error('批量删除失败', 500)
