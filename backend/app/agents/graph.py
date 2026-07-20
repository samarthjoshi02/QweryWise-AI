from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.nodes import (
    understand_query,
    retrieve_documents,
    evaluate_evidence,
    generate_answer,
    validate_groundedness,
    handle_low_confidence
)

def decide_next_step(state: AgentState) -> str:
    if state.get("contradictions_found") or len(state.get("evidence", [])) == 0:
        if state.get("retries", 0) < 2:
            return "handle_low_confidence"
    return "generate_answer"

def decide_final_validation(state: AgentState) -> str:
    if state.get("confidence_score", 1.0) < 0.7:
        return "handle_low_confidence"
    return END

def build_graph():
    workflow = StateGraph(AgentState)

    workflow.add_node("understand_query", understand_query)
    workflow.add_node("retrieve_documents", retrieve_documents)
    workflow.add_node("evaluate_evidence", evaluate_evidence)
    workflow.add_node("generate_answer", generate_answer)
    workflow.add_node("validate_groundedness", validate_groundedness)
    workflow.add_node("handle_low_confidence", handle_low_confidence)

    workflow.set_entry_point("understand_query")
    workflow.add_edge("understand_query", "retrieve_documents")
    workflow.add_edge("retrieve_documents", "evaluate_evidence")
    
    workflow.add_conditional_edges(
        "evaluate_evidence",
        decide_next_step,
        {
            "generate_answer": "generate_answer",
            "handle_low_confidence": "handle_low_confidence"
        }
    )

    workflow.add_edge("generate_answer", "validate_groundedness")
    
    workflow.add_conditional_edges(
        "validate_groundedness",
        decide_final_validation,
        {
            END: END,
            "handle_low_confidence": "handle_low_confidence"
        }
    )
    
    workflow.add_edge("handle_low_confidence", END) # Or loop back if retrying

    return workflow.compile()

querywise_agent_app = build_graph()
