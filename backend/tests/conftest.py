import pytest
from unittest.mock import MagicMock, patch

# Start patching at module level to ensure it's active when app modules are imported
mock_supabase_client = MagicMock()
patcher = patch("supabase.create_client", return_value=mock_supabase_client)
patcher.start()

@pytest.fixture(scope="session", autouse=True)
def supabase_patcher_lifecycle():
    """
    Ensure the global patcher is stopped after the test session.
    """
    yield
    patcher.stop()
