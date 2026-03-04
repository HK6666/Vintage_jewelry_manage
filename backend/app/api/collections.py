import logging
import os
from datetime import datetime, timedelta
from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from ..extensions import db
from ..models import Collection, Image, Tag, Era, Category, Brand, Color
from ..utils.response import success, error
from ..utils.pagination import parse_pagination, paginated_response

logger = logging.getLogger(__name__)
bp = Blueprint('collections', __name__)


@bp.route('', methods=['GET'])
def list_collections():
    logger.info(f"GET /collections - args: {dict(request.args)}")
    page, page_size, sort_by, order = parse_pagination()

    query = Collection.query.filter_by(is_deleted=False)

    keyword = request.args.get('keyword', '')
    if keyword:
        query = query.filter(
            db.or_(
                Collection.name.ilike(f'%{keyword}%'),
                Collection.description.ilike(f'%{keyword}%'),
            )
        )

    cat = request.args.get('cat', '')
    if cat:
        cat_obj = Category.query.filter_by(name=cat).first()
        if cat_obj:
            query = query.filter_by(category_id=cat_obj.id)

    era = request.args.get('era', '')
    if era:
        era_obj = Era.query.filter(db.or_(Era.name.ilike(f'%{era}%'), Era.name_en.ilike(f'%{era}%'))).first()
        if era_obj:
            query = query.filter_by(era_id=era_obj.id)

    brand = request.args.get('brand', '')
    if brand:
        brand_obj = Brand.query.filter(db.or_(Brand.name.ilike(f'%{brand}%'), Brand.name_en.ilike(f'%{brand}%'))).first()
        if brand_obj:
            query = query.filter_by(brand_id=brand_obj.id)

    color_scheme = request.args.get('colorScheme', '')
    if color_scheme:
        color_obj = Color.query.filter_by(name=color_scheme).first()
        if color_obj:
            query = query.filter_by(color_id=color_obj.id)

    material = request.args.get('material', '')
    if material:
        query = query.filter(Collection.material.ilike(f'%{material}%'))

    status = request.args.get('status', '')
    if status:
        query = query.filter_by(status=status)

    price_min = request.args.get('priceMin', type=float)
    if price_min is not None:
        query = query.filter(Collection.purchase_price >= price_min)
    price_max = request.args.get('priceMax', type=float)
    if price_max is not None:
        query = query.filter(Collection.purchase_price <= price_max)

    value_min = request.args.get('valueMin', type=float)
    if value_min is not None:
        query = query.filter(Collection.estimated_value >= value_min)
    value_max = request.args.get('valueMax', type=float)
    if value_max is not None:
        query = query.filter(Collection.estimated_value <= value_max)

    date_from = request.args.get('dateFrom', '')
    if date_from:
        query = query.filter(Collection.date >= date_from)
    date_to = request.args.get('dateTo', '')
    if date_to:
        query = query.filter(Collection.date <= date_to)

    data = paginated_response(query, page, page_size, sort_by, order, Collection)
    logger.info(f"Returned {len(data['items'])} collections, total: {data['total']}")
    return success(data)


@bp.route('/<int:id>', methods=['GET'])
def get_collection(id):
    logger.info(f"GET /collections/{id}")
    item = db.session.get(Collection, id)
    if not item or item.is_deleted:
        logger.warning(f"Collection id={id} not found")
        return error('藏品不存在', 404)
    return success(item.to_dict())


@bp.route('', methods=['POST'])
@jwt_required()
def create_collection():
    data = request.get_json(silent=True) or {}
    logger.info(f"POST /collections - name: {data.get('name')}")

    if not data.get('name'):
        return error('藏品名称不能为空', 400)

    # Dedup: reject if same name was created within last 5 seconds
    recent_cutoff = datetime.utcnow() - timedelta(seconds=5)
    duplicate = Collection.query.filter(
        Collection.name == data['name'],
        Collection.created_at >= recent_cutoff,
    ).first()
    if duplicate:
        logger.warning(f"Duplicate submission blocked: name={data['name']}")
        return success(duplicate.to_dict(), '藏品已保存，请勿重复提交')

    item = Collection(
        name=data['name'],
        material=data.get('material', ''),
        purchase_price=data.get('purchasePrice', 0),
        estimated_value=data.get('estimatedValue', 0),
        status=data.get('status', '完好'),
        description=data.get('description', ''),
        source=data.get('source', ''),
        date=data.get('date', ''),
    )

    # Resolve foreign keys
    era_name = data.get('era', '')
    if era_name:
        era_obj = Era.query.filter(db.or_(Era.name.ilike(f'%{era_name}%'), Era.name_en.ilike(f'%{era_name}%'))).first()
        if era_obj:
            item.era_id = era_obj.id

    cat_name = data.get('cat', '')
    if cat_name:
        cat_obj = Category.query.filter_by(name=cat_name).first()
        if cat_obj:
            item.category_id = cat_obj.id

    brand_name = data.get('brand', '')
    if brand_name:
        brand_obj = Brand.query.filter(db.or_(Brand.name.ilike(f'%{brand_name}%'), Brand.name_en.ilike(f'%{brand_name}%'))).first()
        if brand_obj:
            item.brand_id = brand_obj.id

    color_name = data.get('colorScheme', '')
    if color_name:
        color_obj = Color.query.filter_by(name=color_name).first()
        if color_obj:
            item.color_id = color_obj.id

    # Handle tags
    tag_names = data.get('tags', [])
    for tag_name in tag_names:
        tag = Tag.query.filter_by(name=tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.session.add(tag)
        item.tags.append(tag)

    try:
        db.session.add(item)
        db.session.commit()
        logger.info(f"Created collection id={item.id}")
        return success(item.to_dict(), '创建成功', 201)
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to create collection: {e}", exc_info=True)
        return error('创建失败', 500)


@bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_collection(id):
    data = request.get_json(silent=True) or {}
    logger.info(f"PUT /collections/{id}")

    item = db.session.get(Collection, id)
    if not item or item.is_deleted:
        logger.warning(f"Collection id={id} not found")
        return error('藏品不存在', 404)

    if 'name' in data:
        item.name = data['name']
    if 'material' in data:
        item.material = data['material']
    if 'purchasePrice' in data:
        item.purchase_price = data['purchasePrice']
    if 'estimatedValue' in data:
        item.estimated_value = data['estimatedValue']
    if 'status' in data:
        item.status = data['status']
    if 'description' in data:
        item.description = data['description']
    if 'source' in data:
        item.source = data['source']
    if 'date' in data:
        item.date = data['date']

    if 'era' in data:
        era_obj = Era.query.filter(db.or_(Era.name.ilike(f'%{data["era"]}%'), Era.name_en.ilike(f'%{data["era"]}%'))).first()
        item.era_id = era_obj.id if era_obj else None

    if 'cat' in data:
        cat_obj = Category.query.filter_by(name=data['cat']).first()
        item.category_id = cat_obj.id if cat_obj else None

    if 'brand' in data:
        brand_obj = Brand.query.filter(db.or_(Brand.name.ilike(f'%{data["brand"]}%'), Brand.name_en.ilike(f'%{data["brand"]}%'))).first()
        item.brand_id = brand_obj.id if brand_obj else None

    if 'colorScheme' in data:
        color_obj = Color.query.filter_by(name=data['colorScheme']).first()
        item.color_id = color_obj.id if color_obj else None

    if 'tags' in data:
        item.tags.clear()
        for tag_name in data['tags']:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            item.tags.append(tag)

    try:
        db.session.commit()
        logger.info(f"Updated collection id={id}")
        return success(item.to_dict(), '更新成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to update collection id={id}: {e}", exc_info=True)
        return error('更新失败', 500)


@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_collection(id):
    logger.info(f"DELETE /collections/{id}")
    item = db.session.get(Collection, id)
    if not item or item.is_deleted:
        logger.warning(f"Collection id={id} not found")
        return error('藏品不存在', 404)

    try:
        item.is_deleted = True
        db.session.commit()
        logger.info(f"Soft-deleted collection id={id}")
        return success(message='删除成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to delete collection id={id}: {e}", exc_info=True)
        return error('删除失败', 500)


@bp.route('/batch', methods=['DELETE'])
@jwt_required()
def batch_delete_collections():
    data = request.get_json(silent=True) or {}
    ids = data.get('ids', [])
    logger.info(f"DELETE /collections/batch - ids: {ids}")

    if not ids:
        return error('请提供要删除的藏品ID列表', 400)

    try:
        Collection.query.filter(Collection.id.in_(ids)).update({'is_deleted': True}, synchronize_session=False)
        db.session.commit()
        logger.info(f"Batch soft-deleted collections: {ids}")
        return success(message='批量删除成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to batch delete: {e}", exc_info=True)
        return error('批量删除失败', 500)


@bp.route('/<int:id>/images', methods=['POST'])
@jwt_required()
def upload_images(id):
    logger.info(f"POST /collections/{id}/images")
    item = db.session.get(Collection, id)
    if not item or item.is_deleted:
        return error('藏品不存在', 404)

    files = request.files.getlist('images')
    if not files:
        return error('请选择图片文件', 400)

    upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'collections', str(id))
    os.makedirs(upload_dir, exist_ok=True)

    max_sort = db.session.query(db.func.max(Image.sort)).filter_by(collection_id=id).scalar() or 0
    created_images = []

    for f in files:
        filename = secure_filename(f.filename)
        filepath = os.path.join(upload_dir, filename)
        f.save(filepath)

        max_sort += 1
        img = Image(collection_id=id, url=f'/uploads/collections/{id}/{filename}', sort=max_sort)
        db.session.add(img)
        created_images.append(img)

    try:
        db.session.commit()
        logger.info(f"Uploaded {len(created_images)} images for collection id={id}")
        return success({'images': [img.to_dict() for img in created_images]}, '上传成功', 201)
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to upload images: {e}", exc_info=True)
        return error('上传失败', 500)


@bp.route('/<int:id>/images/<int:image_id>', methods=['DELETE'])
@jwt_required()
def delete_image(id, image_id):
    logger.info(f"DELETE /collections/{id}/images/{image_id}")
    img = Image.query.filter_by(id=image_id, collection_id=id).first()
    if not img:
        return error('图片不存在', 404)

    try:
        db.session.delete(img)
        db.session.commit()
        logger.info(f"Deleted image id={image_id}")
        return success(message='删除成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to delete image: {e}", exc_info=True)
        return error('删除失败', 500)


@bp.route('/<int:id>/images/sort', methods=['PUT'])
@jwt_required()
def sort_images(id):
    data = request.get_json(silent=True) or {}
    image_ids = data.get('imageIds', [])
    logger.info(f"PUT /collections/{id}/images/sort - imageIds: {image_ids}")

    for idx, img_id in enumerate(image_ids):
        img = Image.query.filter_by(id=img_id, collection_id=id).first()
        if img:
            img.sort = idx

    try:
        db.session.commit()
        logger.info(f"Sorted images for collection id={id}")
        return success(message='排序更新成功')
    except Exception as e:
        db.session.rollback()
        logger.error(f"Failed to sort images: {e}", exc_info=True)
        return error('排序更新失败', 500)


@bp.route('/recent', methods=['GET'])
def recent_collections():
    limit = request.args.get('limit', 10, type=int)
    logger.info(f"GET /collections/recent - limit: {limit}")
    items = Collection.query.filter_by(is_deleted=False).order_by(Collection.created_at.desc()).limit(limit).all()
    return success([item.to_dict() for item in items])
