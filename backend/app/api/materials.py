import logging
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from ..extensions import db
from ..models.material import Material
from ..utils.response import success, error

logger = logging.getLogger(__name__)
bp = Blueprint('materials', __name__)


@bp.route('', methods=['GET'])
def list_materials():
    logger.info(f"GET /materials - args: {dict(request.args)}")
    keyword = request.args.get('keyword', '')
    category = request.args.get('category', '')
    query = Material.query
    if keyword:
        query = query.filter(db.or_(
            Material.name.ilike(f'%{keyword}%'),
            Material.name_en.ilike(f'%{keyword}%'),
        ))
    if category:
        query = query.filter_by(category=category)
    items = query.order_by(Material.id.asc()).all()
    return success([m.to_dict() for m in items])


@bp.route('/<int:id>', methods=['GET'])
def get_material(id):
    logger.info(f"GET /materials/{id}")
    item = db.session.get(Material, id)
    if not item:
        return error('材质不存在', 404)
    return success(item.to_dict())


@bp.route('', methods=['POST'])
@jwt_required()
def create_material():
    data = request.get_json(silent=True) or {}
    logger.info(f"POST /materials - name: {data.get('name')}")
    if not data.get('name'):
        return error('名称不能为空', 400)
    if Material.query.filter_by(name=data['name']).first():
        return error('该材质已存在', 409)

    item = Material(
        name=data['name'],
        name_en=data.get('nameEn', ''),
        category=data.get('category', ''),
        description=data.get('description', ''),
    )
    try:
        db.session.add(item)
        db.session.commit()
        logger.info(f"Created material id={item.id}")
        return success(item.to_dict(), '创建成功', 201)
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to create material: {e}", exc_info=True)
        return error('创建失败', 500)


@bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_material(id):
    data = request.get_json(silent=True) or {}
    logger.info(f"PUT /materials/{id}")
    item = db.session.get(Material, id)
    if not item:
        return error('材质不存在', 404)

    if 'name' in data:
        item.name = data['name']
    if 'nameEn' in data:
        item.name_en = data['nameEn']
    if 'category' in data:
        item.category = data['category']
    if 'description' in data:
        item.description = data['description']

    try:
        db.session.commit()
        logger.info(f"Updated material id={id}")
        return success(item.to_dict(), '更新成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to update material: {e}", exc_info=True)
        return error('更新失败', 500)


@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_material(id):
    logger.info(f"DELETE /materials/{id}")
    item = db.session.get(Material, id)
    if not item:
        return error('材质不存在', 404)
    try:
        db.session.delete(item)
        db.session.commit()
        logger.info(f"Deleted material id={id}")
        return success(message='删除成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to delete material: {e}", exc_info=True)
        return error('删除失败', 500)


@bp.route('/batch', methods=['DELETE'])
@jwt_required()
def batch_delete_materials():
    data = request.get_json(silent=True) or {}
    ids = data.get('ids', [])
    logger.info(f"DELETE /materials/batch - ids: {ids}")
    if not ids:
        return error('请提供要删除的ID列表', 400)
    try:
        Material.query.filter(Material.id.in_(ids)).delete(synchronize_session=False)
        db.session.commit()
        logger.info(f"Batch deleted materials: {ids}")
        return success(message='批量删除成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to batch delete materials: {e}", exc_info=True)
        return error('批量删除失败', 500)
