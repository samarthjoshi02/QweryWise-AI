from fastapi.testclient import TestClient
import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to QueryWise AI API"}

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_list_documents():
    response = client.get("/api/v1/documents/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_chat_endpoint_validation_error():
    # Sending missing required field 'message'
    response = client.post("/api/v1/chat/", json={"wrong_field": "hello"})
    assert response.status_code == 422
