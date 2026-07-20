import os
import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import List

from app.services.storage_service import upload_file
from app.services.rag_pipeline import process_document

router = APIRouter()

# Temporary mock database for MVP since we don't have the SQLAlchemy models fully fleshed out here yet
# In a real app, this would be interacting with PostgreSQL
mock_documents = []

class DocumentResponse(BaseModel):
    id: str
    filename: str
    status: str
    upload_date: str
    size: int

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported currently.")

    # 1. Generate a unique ID and filename
    doc_id = str(uuid.uuid4())
    safe_filename = f"{doc_id}_{file.filename}"
    
    # 2. Read file to get size
    file_bytes = await file.read()
    file_size = len(file_bytes)
    
    # Reset file cursor for the MinIO upload
    await file.seek(0)
    
    # 3. Upload to MinIO
    try:
        object_name = upload_file(safe_filename, file.file, file_size, file.content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store file: {str(e)}")

    # 4. Save to mock database (would be PostgreSQL)
    doc_record = {
        "id": doc_id,
        "filename": file.filename,
        "status": "Processing",
        "upload_date": datetime.utcnow().isoformat(),
        "size": file_size,
        "storage_path": object_name
    }
    mock_documents.append(doc_record)
    
    # 5. Trigger background processing (RAG Pipeline)
    background_tasks.add_task(process_document, object_name, doc_id)
    
    return DocumentResponse(**doc_record)

@router.get("/", response_model=List[DocumentResponse])
async def list_documents():
    return [DocumentResponse(**doc) for doc in mock_documents]
