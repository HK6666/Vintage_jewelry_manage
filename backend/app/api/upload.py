import logging
from datetime import datetime, timezone
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
from ..utils.response import success, error
from ..utils.storage import upload_file

logger = logging.getLogger(__name__)
bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@bp.route('/image', methods=['POST'])
@jwt_required()
def upload_image():
    logger.info("POST /upload/image")

    if 'file' not in request.files:
        return error('请选择图片文件', 400)

    f = request.files['file']
    if f.filename == '':
        return error('文件名为空', 400)

    if not allowed_file(f.filename):
        return error('不支持的文件格式，仅支持 JPG/PNG/WebP/GIF', 400)

    now = datetime.now(timezone.utc)
    prefix = f'{now.year}/{now.month:02d}'

    url, filename, file_size = upload_file(f, secure_filename(f.filename) or 'image', prefix)

    logger.info(f"Uploaded image: {url}, size: {file_size}")
    return success({
        'url': url,
        'filename': filename,
        'size': file_size,
        'mimeType': f.content_type,
    }, '上传成功', 201)
