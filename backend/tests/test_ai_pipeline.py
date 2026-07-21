import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.agents.nodes import understand_query, evaluate_evidence, validate_groundedness, handle_low_confidence

def test_understand_query():
    state = {"original_question": "What is the capital of France?", "log": []}
    result = understand_query(state)
    assert result["question"] == "What is the capital of France?"
    assert "log" in result
    assert len(result["log"]) == 1

def test_evaluate_evidence_filtering():
    # Should keep score > 0.3
    state = {
        "documents": [
            {"id": "doc1", "score": 0.8, "content": "Good match", "metadata": {}},
            {"id": "doc2", "score": 0.2, "content": "Bad match", "metadata": {}},
            {"id": "doc3", "score": 0.35, "content": "Okay match", "metadata": {}},
        ]
    }
    result = evaluate_evidence(state)
    assert len(result["evidence"]) == 2
    ids = [doc["id"] for doc in result["evidence"]]
    assert "doc1" in ids
    assert "doc3" in ids
    assert "doc2" not in ids

def test_validate_groundedness():
    state = {}
    result = validate_groundedness(state)
    assert result["grounded"] is True
    assert result["confidence_score"] == 0.95

def test_handle_low_confidence():
    state = {}
    result = handle_low_confidence(state)
    assert result["clarification_needed"] is True
    assert "clarification_question" in result
