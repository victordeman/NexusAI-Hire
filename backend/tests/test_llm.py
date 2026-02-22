import pytest
import asyncio
from unittest.mock import patch, AsyncMock
from app.models.llm import get_llm_response, get_llm_streaming_response
from app.config import settings
from litellm.exceptions import OpenAIError

@patch("app.models.llm.acompletion")
def test_get_llm_response_success(mock_acompletion):
    # Mock the response from acompletion
    mock_response = AsyncMock()
    mock_response.choices = [AsyncMock()]
    mock_response.choices[0].message.content = "Test response"
    mock_acompletion.return_value = mock_response

    messages = [{"role": "user", "content": "Hello"}]
    result = asyncio.run(get_llm_response(messages))

    assert result == "Test response"
    mock_acompletion.assert_called_once()
    args, kwargs = mock_acompletion.call_args
    assert kwargs["messages"] == messages
    assert kwargs["model"] == settings.LITELLM_MODEL # default

@patch("app.models.llm.acompletion")
def test_get_llm_response_with_model(mock_acompletion):
    mock_response = AsyncMock()
    mock_response.choices = [AsyncMock()]
    mock_response.choices[0].message.content = "Test response"
    mock_acompletion.return_value = mock_response

    messages = [{"role": "user", "content": "Hello"}]
    result = asyncio.run(get_llm_response(messages, model="gpt-4"))

    assert result == "Test response"
    args, kwargs = mock_acompletion.call_args
    assert kwargs["model"] == "gpt-4"

@patch("app.models.llm.acompletion")
def test_get_llm_response_error(mock_acompletion):
    mock_acompletion.side_effect = Exception("General error")

    messages = [{"role": "user", "content": "Hello"}]
    with pytest.raises(Exception) as excinfo:
        asyncio.run(get_llm_response(messages))
    
    assert "General error" in str(excinfo.value)

@patch("app.models.llm.acompletion")
def test_get_llm_streaming_response_success(mock_acompletion):
    mock_acompletion.return_value = AsyncMock()

    messages = [{"role": "user", "content": "Hello"}]
    result = asyncio.run(get_llm_streaming_response(messages))

    assert result is not None
    mock_acompletion.assert_called_once()
    args, kwargs = mock_acompletion.call_args
    assert kwargs["stream"] is True
