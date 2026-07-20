from typing import TypedDict, List, Dict, Any, Optional
import operator
from typing import Annotated

class AgentState(TypedDict):
    question: str
    original_question: str
    documents: List[Dict[str, Any]]
    evidence: List[Dict[str, Any]]
    contradictions_found: bool
    grounded: bool
    confidence_score: float
    answer: str
    clarification_needed: bool
    clarification_question: str
    retries: int
    log: Annotated[List[str], operator.add]
