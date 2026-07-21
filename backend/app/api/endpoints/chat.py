import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from app.agents.graph import querywise_agent_app
from app.core.logging import logger

router = APIRouter()

class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's query")
    history: Optional[List[Dict[str, str]]] = Field(default=[], description="Optional chat history")

class ChatResponse(BaseModel):
    answer: str = Field(..., description="The generated answer")
    confidence: float = Field(..., description="Confidence score from 0.0 to 1.0")
    grounded: bool = Field(..., description="True if the answer is grounded in evidence")
    contradictions: bool = Field(..., description="True if contradictions were found in the evidence")
    sources: List[str] = Field(..., description="List of source document names used for the answer")
    timeline: List[Dict[str, Any]] = Field(..., description="LangGraph execution timeline")

@router.post("/", response_model=ChatResponse, summary="Submit Chat Query", description="Processes a user's question through the LangGraph multi-agent pipeline and returns a self-corrected answer.")
async def chat_endpoint(request: ChatRequest):
    logger.info(f"Received chat request: '{request.message}'")
    try:
        # Initialize state
        initial_state = {
            "original_question": request.message,
            "retries": 0,
            "log": []
        }
        
        logger.debug(f"Starting agent pipeline for query: '{request.message}'")
        # Run graph in a separate thread so it doesn't block the ASGI loop
        final_state = await asyncio.to_thread(querywise_agent_app.invoke, initial_state)
        logger.debug(f"Agent pipeline completed for query: '{request.message}'")
        
        # Extract sources from evidence
        evidence = final_state.get("evidence", [])
        sources = list(set([doc["metadata"].get("source", "Unknown") for doc in evidence if "metadata" in doc]))
        
        # Construct timeline from logs
        timeline = [{"id": str(i), "name": log, "status": "completed"} for i, log in enumerate(final_state.get("log", []))]
        
        logger.info(f"Generated answer with confidence {final_state.get('confidence_score', 0.0)}")
        return ChatResponse(
            answer=final_state.get("answer", "No answer generated."),
            confidence=final_state.get("confidence_score", 0.0),
            grounded=final_state.get("grounded", False),
            contradictions=final_state.get("contradictions_found", False),
            sources=sources,
            timeline=timeline
        )
    except Exception as e:
        logger.error(f"Error during chat processing: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
