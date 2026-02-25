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
    with patch("app.api.v1.profile.supabase") as mock:
        # Data for upsert (returns a list)
        mock_execute_upsert = MagicMock()
        mock_execute_upsert.data = [{
            "id": "test-user-id",
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "home_address": "123 Main St",
            "date_of_birth": "1990-01-01",
            "department": "Engineering",
            "job_designation": "Software Engineer",
            "is_admin": True
        }]

        # Data for single select (returns a dict)
        mock_execute_single = MagicMock()
        mock_execute_single.data = mock_execute_upsert.data[0]

        mock_table = MagicMock()
        mock_table.upsert.return_value.execute.return_value = mock_execute_upsert
        mock_table.select.return_value.eq.return_value.single.return_value.execute.return_value = mock_execute_single

        mock.table.return_value = mock_table
        yield mock

def test_get_profile(mock_supabase):
    response = client.get("/api/v1/profile/me", headers={"Authorization": "Bearer fake-token"})
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "John"
    assert data["is_admin"] is True

def test_update_profile(mock_supabase):
    profile_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "home_address": "123 Main St",
        "date_of_birth": "1990-01-01",
        "department": "Engineering",
        "job_designation": "Software Engineer",
        "is_admin": True
    }
    response = client.post(
        "/api/v1/profile/me",
        json=profile_data,
        headers={"Authorization": "Bearer fake-token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "John"
    assert data["is_admin"] is True
