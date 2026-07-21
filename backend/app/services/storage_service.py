import os
from minio import Minio
from minio import S3Error
from typing import BinaryIO
import logging

logger = logging.getLogger(__name__)

# MinIO Configuration
MINIO_URL = os.getenv("MINIO_URL", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "admin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "password123")
MINIO_BUCKET_NAME = os.getenv("MINIO_BUCKET_NAME", "querywise-docs")

client = Minio(
    MINIO_URL,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

def ensure_bucket_exists():
    try:
        if not client.bucket_exists(MINIO_BUCKET_NAME):
            client.make_bucket(MINIO_BUCKET_NAME)
            logger.info(f"Created bucket: {MINIO_BUCKET_NAME}")
    except Exception as e:
        logger.error(f"MinIO connection error on startup: {e}. Ensure MinIO is running and credentials are correct.")

# Initialize bucket on startup
ensure_bucket_exists()

def upload_file(file_name: str, file_data: BinaryIO, file_size: int, content_type: str) -> str:
    """
    Uploads a file to MinIO and returns the object name.
    """
    try:
        client.put_object(
            bucket_name=MINIO_BUCKET_NAME,
            object_name=file_name,
            data=file_data,
            length=file_size,
            content_type=content_type
        )
        logger.info(f"Successfully uploaded {file_name} to MinIO")
        return file_name
    except S3Error as e:
        logger.error(f"Failed to upload {file_name}: {e}")
        raise e

def get_file_url(file_name: str) -> str:
    """
    Returns a presigned URL to access the file.
    """
    try:
        return client.presigned_get_object(MINIO_BUCKET_NAME, file_name)
    except S3Error as e:
        logger.error(f"Failed to generate URL for {file_name}: {e}")
        return ""
