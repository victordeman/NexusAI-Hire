import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_llm_response():
    with patch("app.api.v1.interview.get_llm_response", new_callable=AsyncMock) as mock:
        mock.return_value = "Mocked LLM answer"
        yield mock

def test_ask_question_single_turn(mock_llm_response):
    response = client.post(
        "/api/v1/ask",
        json={"question": "Hello", "model": "gpt-4o-mini"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "Mocked LLM answer"
    assert "trust_score" in data
    assert 70 <= data["trust_score"] <= 100

def test_ask_question_multi_turn(mock_llm_response):
    messages = [
        {"role": "user", "content": "Hi"},
        {"role": "assistant", "content": "Hello! How can I help?"},
        {"role": "user", "content": "Let's talk about React."}
    ]
    response = client.post(
        "/api/v1/ask",
        json={"messages": messages, "current_trust_score": 85}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "Mocked LLM answer"
    # Trust score fluctuation logic in code: fluctuation = random.randint(-2, 1)
    # So 85 + (-2 to 1) = 83 to 86
    assert 83 <= data["trust_score"] <= 86

def test_ask_question_missing_input():
    response = client.post(
        "/api/v1/ask",
        json={"model": "gpt-4o-mini"}
    )
    assert response.status_code == 400
    assert "detail" in response.json()

def test_ask_question_error_handling():
    with patch("app.api.v1.interview.get_llm_response", side_effect=Exception("LLM Error")):
        response = client.post(
            "/api/v1/ask",
            json={"question": "Should fail"}
        )
        assert response.status_code == 500
        assert "Failed to get response from AI" in response.json()["detail"]

def test_ask_question_with_session(mock_llm_response):
    # First call: No session_id, starts a new session
    response = client.post(
        "/api/v1/ask",
        json={"question": "Hello, I am Jules."}
    )
    assert response.status_code == 200
    data = response.json()
    session_id = data.get("session_id")
    assert session_id is not None

    # Second call: Use session_id, history should persist
    response = client.post(
        "/api/v1/ask",
        json={"question": "What is my name?", "session_id": session_id}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"] == session_id

    # Verify that the LLM was called with the full history
    # The history should contain:
    # [system, user: Hello, assistant: Mocked LLM answer, user: What is my name?]
    args, kwargs = mock_llm_response.call_args
    messages = args[0]
    assert len(messages) == 4
    assert messages[0]["role"] == "system"
    assert messages[1] == {"role": "user", "content": "Hello, I am Jules."}
    assert messages[2] == {"role": "assistant", "content": "Mocked LLM answer"}
    assert messages[3] == {"role": "user", "content": "What is my name?"}
