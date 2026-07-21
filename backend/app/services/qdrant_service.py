from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from app.core.config import settings

class QdrantService:
    def __init__(self):
        self.client = QdrantClient(url=settings.QDRANT_URL, check_compatibility=False)
        self.collection_name = settings.QDRANT_COLLECTION_NAME
        self._ensure_collection()

    def _ensure_collection(self):
        collections = self.client.get_collections().collections
        exists = any(c.name == self.collection_name for c in collections)
        if not exists:
            # Assuming using Gemini embeddings with 768 dimensions, or OpenAI with 1536
            # We'll use 768 as default for Gemini 
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=768, distance=Distance.COSINE),
            )

    def insert_vectors(self, points):
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )

    def search(self, query_vector, limit=5):
        return self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit
        )

qdrant_service = QdrantService()
