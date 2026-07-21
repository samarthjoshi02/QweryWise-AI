from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager

from app.core.database import engine, Base
from app.models import document
from app.api.endpoints import documents, chat
from app.core.logging import logger

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    try:
        logger.info("Initializing database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
    yield
    logger.info("Shutting down application...")

tags_metadata = [
    {
        "name": "documents",
        "description": "Operations with documents. Upload, list, and manage files for RAG processing.",
    },
    {
        "name": "chat",
        "description": "Chat endpoints for querying the AI based on uploaded documents.",
    },
]

app = FastAPI(
    title="QueryWise AI API",
    description="Enterprise API for QueryWise AI Self-Correcting RAG Platform. Includes document processing and chat functionality with verifiable citations.",
    version="1.0.0",
    openapi_tags=tags_metadata,
    lifespan=lifespan,
    contact={
        "name": "QueryWise AI Team",
        "url": "https://github.com/your-username/QweryWise-AI",
    }
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred. Please try again later."},
    )

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", os.getenv("NEXT_PUBLIC_API_URL", "")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["health"])
def read_root():
    """Welcome endpoint for the API."""
    return {"message": "Welcome to QueryWise AI API"}

@app.get("/health", tags=["health"])
def health_check():
    """Health check endpoint to verify API status."""
    return {"status": "healthy"}

app.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
