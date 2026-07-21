import os
import tempfile
import logging

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
# pyrefly: ignore [missing-import]
from langchain_qdrant import QdrantVectorStore

from app.services.storage_service import client as minio_client, MINIO_BUCKET_NAME
from app.services.qdrant_service import qdrant_service

logger = logging.getLogger(__name__)

# Qdrant Configuration
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
QDRANT_COLLECTION_NAME = os.getenv("QDRANT_COLLECTION_NAME", "documents")



def get_embeddings():
    """
    Initialize the embedding model.
    """
    google_api_key = os.getenv("GOOGLE_API_KEY")
    if not google_api_key or google_api_key == "your_google_api_key_here":
        logger.warning("GOOGLE_API_KEY is missing or invalid. Using a fake embedding model for testing.")
        from langchain_core.embeddings.fake import FakeEmbeddings
        return FakeEmbeddings(size=768)
    
    return GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2")

def process_document(file_name: str, document_id: int):
    """
    Background task to download, parse, chunk, and embed a document.
    """
    logger.info(f"Starting processing for {file_name}")
    try:
        # 1. Download file from MinIO to a temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        temp_file.close() # Close it so MinIO can write to it (Windows limitation)
        temp_file_path = temp_file.name
        
        minio_client.fget_object(MINIO_BUCKET_NAME, file_name, temp_file_path)

        # 2. Parse the PDF
        logger.info(f"Parsing PDF: {file_name}")
        loader = PyPDFLoader(temp_file_path)
        documents = loader.load()

        # 3. Chunk the text
        logger.info(f"Chunking {len(documents)} pages for {file_name}")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ".", " ", ""]
        )
        chunks = text_splitter.split_documents(documents)
        
        # Add metadata to chunks
        for chunk in chunks:
            chunk.metadata["source_file"] = file_name
            chunk.metadata["document_id"] = document_id

        # 4. Generate Embeddings and Store in Qdrant
        logger.info(f"Generating embeddings and storing {len(chunks)} chunks in Qdrant")
        embeddings = get_embeddings()
        
        vector_store = QdrantVectorStore.from_documents(
            chunks,
            embeddings,
            url=QDRANT_URL,
            collection_name=QDRANT_COLLECTION_NAME,
        )

        logger.info(f"Successfully processed {file_name}")
        
        # Clean up temp file
        os.remove(temp_file_path)
        
        # Update document status in mock db to 'Indexed'
        from app.api.endpoints.documents import mock_documents
        for doc in mock_documents:
            if doc["id"] == document_id:
                doc["status"] = "Indexed"
                break
        
    except Exception as e:
        logger.error(f"Failed to process {file_name}: {e}")
        import traceback
        with open("last_rag_error.txt", "w") as err_file:
            traceback.print_exc(file=err_file)
            err_file.write(f"\nException string: {str(e)}")
            
        # Update document status in mock db to 'Failed'
        from app.api.endpoints.documents import mock_documents
        for doc in mock_documents:
            if doc["id"] == document_id:
                doc["status"] = "Failed"
                break
        raise e