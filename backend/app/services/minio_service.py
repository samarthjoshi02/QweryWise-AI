from minio import Minio
from app.core.config import settings
from io import BytesIO

class MinioService:
    def __init__(self):
        self.client = Minio(
            settings.MINIO_URL,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=False # Local dev is false
        )
        self.bucket_name = settings.MINIO_BUCKET_NAME
        self._ensure_bucket()

    def _ensure_bucket(self):
        if not self.client.bucket_exists(self.bucket_name):
            self.client.make_bucket(self.bucket_name)

    def upload_file(self, object_name: str, file_data: bytes, content_type: str = "application/pdf"):
        self.client.put_object(
            self.bucket_name,
            object_name,
            data=BytesIO(file_data),
            length=len(file_data),
            content_type=content_type
        )
        return f"{self.bucket_name}/{object_name}"

    def get_file_url(self, object_name: str):
        return self.client.presigned_get_object(self.bucket_name, object_name)

minio_service = MinioService()
