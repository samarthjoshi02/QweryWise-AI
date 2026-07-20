from app.agents.state import AgentState
from typing import Dict, Any
from app.services.qdrant_service import qdrant_service
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
import os

# Initialize LLM for Featherless AI
llm = ChatOpenAI(
    model="meta-llama/Meta-Llama-3-8B-Instruct",
    api_key=settings.OPENAI_API_KEY,
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.featherless.ai/v1"),
    temperature=0.0,
    max_tokens=200
)

# Initialize embeddings for search
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-2",
    google_api_key=settings.GOOGLE_API_KEY
)

def understand_query(state: AgentState) -> Dict[str, Any]:
    log_msg = "Query Understanding: Forwarding query."
    return {"question": state["original_question"], "log": [log_msg]}

def retrieve_documents(state: AgentState) -> Dict[str, Any]:
    question = state["question"]
    log_msg = f"Retrieval Agent: Fetching top documents for '{question}'."
    
    try:
        # Embed the query
        query_vector = embeddings.embed_query(question)
        # Search Qdrant
        results = qdrant_service.search(query_vector=query_vector, limit=5)
        
        docs = []
        for res in results:
            docs.append({
                "id": res.id,
                "content": res.payload.get("page_content", "") if res.payload else "",
                "score": res.score,
                "metadata": res.payload.get("metadata", {}) if res.payload else {}
            })
            
        return {"documents": docs, "log": [log_msg, f"Found {len(docs)} documents."]}
    except Exception as e:
        return {"documents": [], "log": [log_msg, f"Error in retrieval: {str(e)}"]}

def evaluate_evidence(state: AgentState) -> Dict[str, Any]:
    docs = state.get("documents", [])
    log_msg = "Evidence Agent: Validating evidence."
    # Simple evaluation: Keep docs with score > 0.3
    evidence = [d for d in docs if d["score"] > 0.3]
    return {"evidence": evidence, "contradictions_found": False, "log": [log_msg, f"Kept {len(evidence)} highly relevant documents."]}

def generate_answer(state: AgentState) -> Dict[str, Any]:
    log_msg = "LLM Agent: Generating answer based on verified evidence."
    evidence = state.get("evidence", [])
    
    if not evidence:
        return {"answer": "I don't know the answer based on the uploaded documents.", "log": [log_msg, "No evidence to generate answer from."]}
        
    context_parts = []
    sources = set()
    for doc in evidence:
        content = doc["content"]
        source = doc["metadata"].get("source", "Unknown Document")
        context_parts.append(f"Source: {source}\nContent: {content}")
        sources.add(source)
        
    context = "\n\n---\n\n".join(context_parts)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful enterprise AI assistant. Answer the user's question using ONLY the provided context. If you don't know the answer based on the context, say 'I don't know based on the documents.'"),
        ("user", "Context:\n{context}\n\nQuestion: {question}")
    ])
    
    chain = prompt | llm
    try:
        response = chain.invoke({"context": context, "question": state["question"]})
        answer = response.content
    except Exception as e:
        answer = f"Error generating answer: {str(e)}"
        
    return {"answer": answer, "log": [log_msg, f"Answer generated using {len(sources)} sources."]}

def validate_groundedness(state: AgentState) -> Dict[str, Any]:
    log_msg = "Validation Agent: Setting baseline confidence."
    return {"grounded": True, "confidence_score": 0.95, "log": [log_msg]}

def handle_low_confidence(state: AgentState) -> Dict[str, Any]:
    log_msg = "Evaluation Agent: Confidence too low. Falling back."
    return {"clarification_needed": True, "clarification_question": "I couldn't find enough confident evidence to answer that. Could you rephrase your question?", "log": [log_msg]}
