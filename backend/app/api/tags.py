import logging
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from ..extensions import db
from ..models.tag import Tag
from ..models.collection import collection_tag
from ..utils.response import success, error

logger = logging.getLogger(__name__)
bp = Blueprint('tags', __name__)


@bp.route('', methods=['GET'])
def list_tags():
    keyword = request.args.get('keyword', '')
    limit = request.args.get('limit', 20, type=int)
    logger.info(f"GET /tags - keyword: {keyword}, limit: {limit}")

    query = db.session.query(
        Tag.name,
        func.count(collection_tag.c.collection_id).label('cnt'),
    ).outerjoin(collection_tag, Tag.id == collection_tag.c.tag_id).group_by(Tag.id)

    if keyword:
        query = query.filter(Tag.name.ilike(f'{keyword}%'))

    results = query.order_by(func.count(collection_tag.c.collection_id).desc()).limit(limit).all()
    data = [{'name': r[0], 'count': r[1]} for r in results]
    return success(data)


@bp.route('', methods=['POST'])
@jwt_required()
def create_tag():
    data = request.get_json(silent=True) or {}
    name = data.get('name', '').strip()
    logger.info(f"POST /tags - name: {name}")

    if not name:
        return error('标签名不能为空', 400)

    if Tag.query.filter_by(name=name).first():
        return error('标签已存在', 409)

    tag = Tag(name=name)
    try:
        db.session.add(tag)
        db.session.commit()
        logger.info(f"Created tag: {name}")
        return success(tag.to_dict(), '创建成功', 201)
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to create tag: {e}", exc_info=True)
        return error('创建失败', 500)


@bp.route('/<string:name>', methods=['DELETE'])
@jwt_required()
def delete_tag(name):
    logger.info(f"DELETE /tags/{name}")
    tag = Tag.query.filter_by(name=name).first()
    if not tag:
        return error('标签不存在', 404)

    try:
        db.session.delete(tag)
        db.session.commit()
        logger.info(f"Deleted tag: {name}")
        return success(message='删除成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to delete tag: {e}", exc_info=True)
        return error('删除失败', 500)
