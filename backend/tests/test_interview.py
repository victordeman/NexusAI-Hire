import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock, MagicMock
from app.main import app
from app.api.deps import get_current_user

client = TestClient(app)

# Mock user
class MockUser:
    def __init__(self, id):
        self.id = id

async def override_get_current_user():
    return MockUser(id="test-user-id")

@pytest.fixture(autouse=True)
def setup_auth_override():
    app.dependency_overrides[get_current_user] = override_get_current_user
    yield
    app.dependency_overrides = {}

@pytest.fixture
def mock_supabase():
    with patch("app.api.v1.interview.supabase") as mock:
        # Mock the table().insert().execute() chain
        mock_execute = MagicMock()
        mock_execute.data = [{"id": "test-interview-id"}]
        
        mock_execute_single = MagicMock()
        mock_execute_single.data = {"id": "test-interview-id"}
        
        mock_table = MagicMock()
        mock_table.insert.return_value.execute.return_value = mock_execute
        mock_table.update.return_value.eq.return_value.eq.return_value.execute.return_value = mock_execute
        mock_table.select.return_value.eq.return_value.order.return_value.execute.return_value = mock_execute
        mock_table.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value = mock_execute_single
        
        mock.table.return_value = mock_table
        yield mock

@pytest.fixture
def mock_llm_response():
    with patch("app.api.v1.interview.get_llm_response", new_callable=AsyncMock) as mock:
        mock.return_value = "Mocked LLM answer"
        yield mock

def test_ask_question_single_turn(mock_llm_response, mock_supabase):
    response = client.post(
        "/api/v1/ask",
        json={"question": "Hello", "model": "gpt-4o-mini"},
        headers={"Authorization": "Bearer fake-token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["answer"] == "Mocked LLM answer"
    assert "trust_score" in data
    assert 70 <= data["trust_score"] <= 100
    assert data["interview_id"] == "test-interview-id"

def test_ask_question_multi_turn(mock_llm_response, mock_supabase):
    messages = [
        {"role": "user", "content": "Hi"},
        {"role": "assistant", "content": "Hello! How can I help?"},
        {"role": "user", "content": "Let's talk about React."}
    ]
    response = client.post(
        "/api/v1/ask",
        json={"messages": messages, "current_trust_score": 85},
        headers={"Authorization": "Bearer fake-token"}
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
        json={"model": "gpt-4o-mini"},
        headers={"Authorization": "Bearer fake-token"}
    )
    assert response.status_code == 400
    assert "detail" in response.json()

def test_ask_question_error_handling():
    with patch("app.api.v1.interview.get_llm_response", side_effect=Exception("LLM Error")):
        response = client.post(
            "/api/v1/ask",
            json={"question": "Should fail"},
            headers={"Authorization": "Bearer fake-token"}
        )
        assert response.status_code == 500
        assert "Failed to get response from AI" in response.json()["detail"]

def test_list_interviews(mock_supabase):
    response = client.get("/api/v1/interviews", headers={"Authorization": "Bearer fake-token"})
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_interview(mock_supabase):
    response = client.get("/api/v1/interviews/test-id", headers={"Authorization": "Bearer fake-token"})
    assert response.status_code == 200
    assert response.json()["id"] == "test-interview-id"
