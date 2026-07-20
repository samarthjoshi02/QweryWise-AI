from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.agents.graph import querywise_agent_app

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    answer: str
    confidence: float
    grounded: bool
    contradictions: bool
    sources: List[str]
    timeline: List[Dict[str, Any]]

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Initialize state
        initial_state = {
            "original_question": request.message,
            "retries": 0,
            "log": []
        }
        
        # Run graph
        final_state = querywise_agent_app.invoke(initial_state)
        
        # Extract sources from evidence
        evidence = final_state.get("evidence", [])
        sources = list(set([doc["metadata"].get("source", "Unknown") for doc in evidence if "metadata" in doc]))
        
        # Construct timeline from logs
        timeline = [{"id": str(i), "name": log, "status": "completed"} for i, log in enumerate(final_state.get("log", []))]
        
        return ChatResponse(
            answer=final_state.get("answer", "No answer generated."),
            confidence=final_state.get("confidence_score", 0.0),
            grounded=final_state.get("grounded", False),
            contradictions=final_state.get("contradictions_found", False),
            sources=sources,
            timeline=timeline
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
