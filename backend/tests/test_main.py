from fastapi.testclient import TestClient
from app.main import app
import pytest

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert "version" in data
    assert "description" in data
    assert data["title"] == "NexusAI Hire API"

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_global_exception_handler():
    # We add a temporary route to trigger an unhandled exception.
    # While this modifies the global app instance, it's the most reliable way 
    # to verify the global exception handler is correctly registered and working.
    @app.get("/trigger-unhandled-error")
    async def trigger_unhandled_error():
        raise Exception("Test unhandled exception")
    
    # We set raise_server_exceptions=False to allow the test client 
    # to receive the 500 response instead of re-raising the exception.
    client_with_error = TestClient(app, raise_server_exceptions=False)
    response = client_with_error.get("/trigger-unhandled-error")
    assert response.status_code == 500
    assert response.json() == {"detail": "An unexpected error occurred. Please try again later."}

def test_logging_middleware():
    # This is harder to test directly without checking logs, 
    # but we can at least ensure it doesn't break requests.
    response = client.get("/")
    assert response.status_code == 200
