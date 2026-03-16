import io
import logging
import os
import uuid
from minio import Minio
from minio.error import S3Error

logger = logging.getLogger(__name__)

BUCKET = 'vintage-vault'

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = Minio(
            os.getenv('MINIO_ENDPOINT', 'minio:9000'),
            access_key=os.getenv('MINIO_ACCESS_KEY', 'minioadmin'),
            secret_key=os.getenv('MINIO_SECRET_KEY', 'minioadmin123'),
            secure=False,
        )
        # Ensure bucket exists with public read policy
        if not _client.bucket_exists(BUCKET):
            _client.make_bucket(BUCKET)
            policy = '''{
                "Version": "2012-10-17",
                "Statement": [{
                    "Effect": "Allow",
                    "Principal": {"AWS": ["*"]},
                    "Action": ["s3:GetObject"],
                    "Resource": ["arn:aws:s3:::%s/*"]
                }]
            }''' % BUCKET
            _client.set_bucket_policy(BUCKET, policy)
            logger.info(f"Created bucket '{BUCKET}' with public read policy")
    return _client


def upload_file(file_obj, original_filename, prefix=''):
    """Upload a file to MinIO and return the storage path.

    Args:
        file_obj: File-like object (e.g., from request.files)
        original_filename: Original filename for extension detection
        prefix: Path prefix (e.g., 'collections/12')

    Returns:
        URL path like '/storage/collections/12/abc123.jpg'
    """
    ext = 'jpg'
    if original_filename and '.' in original_filename:
        ext = original_filename.rsplit('.', 1)[1].lower()

    filename = f'{uuid.uuid4().hex}.{ext}'
    object_name = f'{prefix}/{filename}' if prefix else filename

    # Read file content to get size
    data = file_obj.read()
    size = len(data)
    content_type = file_obj.content_type or 'application/octet-stream'

    client = _get_client()
    client.put_object(
        BUCKET,
        object_name,
        io.BytesIO(data),
        length=size,
        content_type=content_type,
    )

    logger.info(f"Uploaded to MinIO: {object_name} ({size} bytes)")
    return f'/storage/{object_name}', filename, size


def delete_file(url):
    """Delete a file from MinIO by its URL path."""
    if not url or not url.startswith('/storage/'):
        return
    object_name = url[len('/storage/'):]
    try:
        client = _get_client()
        client.remove_object(BUCKET, object_name)
        logger.info(f"Deleted from MinIO: {object_name}")
    except S3Error as e:
        logger.warning(f"Failed to delete from MinIO: {object_name}: {e}")
