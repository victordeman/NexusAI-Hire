import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
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
        mock_execute_single = MagicMock()
        mock_execute_single.data = {"trust_score": 90}

        mock_table = MagicMock()
        # Mock select().eq().eq().single().execute()
        mock_table.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value = mock_execute_single
        # Mock update().eq().eq().execute()
        mock_table.update.return_value.eq.return_value.eq.return_value.execute.return_value = MagicMock()

        mock.table.return_value = mock_table
        yield mock

def test_report_proctor_event_tab_switch(mock_supabase):
    response = client.post(
        "/api/v1/proctor/report",
        json={"interview_id": "test-uuid", "event_type": "tab_switch"},
        headers={"Authorization": "Bearer fake-token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["new_trust_score"] == 85
    assert data["event_processed"] == "tab_switch"

def test_report_proctor_event_multiple_faces(mock_supabase):
    response = client.post(
        "/api/v1/proctor/report",
        json={"interview_id": "test-uuid", "event_type": "multiple_faces"},
        headers={"Authorization": "Bearer fake-token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["new_trust_score"] == 80

def test_report_proctor_event_interview_not_found(mock_supabase):
    # Mock no data found
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.single.return_value.execute.return_value.data = None

    response = client.post(
        "/api/v1/proctor/report",
        json={"interview_id": "wrong-id", "event_type": "tab_switch"},
        headers={"Authorization": "Bearer fake-token"}
    )
    assert response.status_code == 404
