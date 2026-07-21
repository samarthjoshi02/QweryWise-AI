import os
import uuid
import re
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from pydantic import BaseModel, Field
from typing import List

from app.services.storage_service import upload_file
from app.services.rag_pipeline import process_document
from app.core.logging import logger

router = APIRouter()

# Temporary mock database for MVP since we don't have the SQLAlchemy models fully fleshed out here yet
# In a real app, this would be interacting with PostgreSQL
mock_documents = []

class DocumentResponse(BaseModel):
    id: str = Field(..., description="Unique document ID")
    filename: str = Field(..., description="Original filename")
    status: str = Field(..., description="Processing status (Processing, Completed, Error)")
    upload_date: str = Field(..., description="ISO 8601 upload timestamp")
    size: int = Field(..., description="File size in bytes")

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent directory traversal and invalid characters."""
    # Keep only alphanumeric characters, dashes, and underscores
    sanitized = re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)
    return sanitized.lstrip('.')

@router.post("/upload", response_model=DocumentResponse, summary="Upload Document", description="Uploads a PDF document for processing into the RAG pipeline.")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    logger.info(f"Received file upload request: {file.filename}")
    
    if not file.filename.lower().endswith(".pdf"):
        logger.warning(f"Invalid file type uploaded: {file.filename}")
        raise HTTPException(status_code=400, detail="Only PDF files are supported currently.")

    # 1. Generate a unique ID and sanitize filename
    doc_id = str(uuid.uuid4())
    safe_filename = f"{doc_id}_{sanitize_filename(file.filename)}"
    
    # 2. Read file to get size
    try:
        file_bytes = await file.read()
        file_size = len(file_bytes)
        logger.debug(f"File size for {safe_filename}: {file_size} bytes")
        
        # Reset file cursor for the MinIO upload
        await file.seek(0)
    except Exception as e:
        logger.error(f"Error reading file {file.filename}: {e}")
        raise HTTPException(status_code=400, detail="Error reading the uploaded file.")
    
    # 3. Upload to MinIO
    try:
        object_name = upload_file(safe_filename, file.file, file_size, file.content_type)
        logger.info(f"File {safe_filename} uploaded to MinIO successfully.")
    except Exception as e:
        logger.error(f"MinIO upload failed for {safe_filename}: {e}")
        raise HTTPException(status_code=500, detail="Failed to store file in object storage.")

    # 4. Save to mock database (would be PostgreSQL)
    doc_record = {
        "id": doc_id,
        "filename": sanitize_filename(file.filename),
        "status": "Processing",
        "upload_date": datetime.utcnow().isoformat(),
        "size": file_size,
        "storage_path": object_name
    }
    mock_documents.append(doc_record)
    
    # 5. Trigger background processing (RAG Pipeline)
    logger.info(f"Triggering background processing for document {doc_id}")
    background_tasks.add_task(process_document, object_name, doc_id)
    
    return DocumentResponse(**doc_record)

@router.get("/", response_model=List[DocumentResponse], summary="List Documents", description="Retrieve a list of all uploaded documents and their processing status.")
async def list_documents():
    logger.info(f"Listing {len(mock_documents)} documents")
    return [DocumentResponse(**doc) for doc in mock_documents]
