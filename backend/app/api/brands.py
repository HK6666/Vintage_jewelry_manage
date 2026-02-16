import logging
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from ..extensions import db
from ..models.brand import Brand
from ..utils.response import success, error

logger = logging.getLogger(__name__)
bp = Blueprint('brands', __name__)


@bp.route('', methods=['GET'])
def list_brands():
    logger.info(f"GET /brands - args: {dict(request.args)}")
    keyword = request.args.get('keyword', '')
    country = request.args.get('country', '')
    query = Brand.query
    if keyword:
        query = query.filter(db.or_(
            Brand.name.ilike(f'%{keyword}%'),
            Brand.name_en.ilike(f'%{keyword}%'),
        ))
    if country:
        query = query.filter_by(country=country)
    items = query.order_by(Brand.id.asc()).all()
    return success([b.to_dict() for b in items])


@bp.route('/<int:id>', methods=['GET'])
def get_brand(id):
    logger.info(f"GET /brands/{id}")
    item = db.session.get(Brand, id)
    if not item:
        return error('品牌不存在', 404)
    return success(item.to_dict())


@bp.route('', methods=['POST'])
@jwt_required()
def create_brand():
    data = request.get_json(silent=True) or {}
    logger.info(f"POST /brands - name: {data.get('name')}")
    if not data.get('name'):
        return error('名称不能为空', 400)
    if Brand.query.filter_by(name=data['name']).first():
        return error('该品牌已存在', 409)

    item = Brand(
        name=data['name'],
        name_en=data.get('nameEn', ''),
        country=data.get('country', ''),
        description=data.get('description', ''),
    )
    try:
        db.session.add(item)
        db.session.commit()
        logger.info(f"Created brand id={item.id}")
        return success(item.to_dict(), '创建成功', 201)
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to create brand: {e}", exc_info=True)
        return error('创建失败', 500)


@bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_brand(id):
    data = request.get_json(silent=True) or {}
    logger.info(f"PUT /brands/{id}")
    item = db.session.get(Brand, id)
    if not item:
        return error('品牌不存在', 404)

    if 'name' in data:
        item.name = data['name']
    if 'nameEn' in data:
        item.name_en = data['nameEn']
    if 'country' in data:
        item.country = data['country']
    if 'description' in data:
        item.description = data['description']

    try:
        db.session.commit()
        logger.info(f"Updated brand id={id}")
        return success(item.to_dict(), '更新成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to update brand: {e}", exc_info=True)
        return error('更新失败', 500)


@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_brand(id):
    logger.info(f"DELETE /brands/{id}")
    item = db.session.get(Brand, id)
    if not item:
        return error('品牌不存在', 404)
    if item.collections.count() > 0:
        return error('该品牌下存在关联藏品，请先解除关联', 409)
    try:
        db.session.delete(item)
        db.session.commit()
        logger.info(f"Deleted brand id={id}")
        return success(message='删除成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to delete brand: {e}", exc_info=True)
        return error('删除失败', 500)


@bp.route('/batch', methods=['DELETE'])
@jwt_required()
def batch_delete_brands():
    data = request.get_json(silent=True) or {}
    ids = data.get('ids', [])
    logger.info(f"DELETE /brands/batch - ids: {ids}")
    if not ids:
        return error('请提供要删除的ID列表', 400)

    from ..models.collection import Collection
    conflict = Brand.query.filter(Brand.id.in_(ids)).join(Collection).first()
    if conflict:
        return error('部分品牌存在关联藏品，请先解除关联', 409)

    try:
        Brand.query.filter(Brand.id.in_(ids)).delete(synchronize_session=False)
        db.session.commit()
        logger.info(f"Batch deleted brands: {ids}")
        return success(message='批量删除成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to batch delete brands: {e}", exc_info=True)
        return error('批量删除失败', 500)
