import logging
import sentry_sdk
from litellm import acompletion
from litellm.exceptions import OpenAIError
from app.config import settings

logger = logging.getLogger(__name__)

async def get_llm_response(
    messages: list, 
    model: str = None, 
    temperature: float = 0.7, 
    max_tokens: int = 1000,
    **kwargs
):
    """
    Get a non-streaming response from the LLM using LiteLLM.
    """
    selected_model = model or settings.LITELLM_MODEL
    
    try:
        logger.info(f"Requesting LLM response from model: {selected_model}")
        
        # Prepare parameters
        completion_params = {
            "model": selected_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            **kwargs
        }
        
        # Only add api_key and api_base if they are provided/needed
        if settings.LITELLM_API_KEY:
            completion_params["api_key"] = settings.LITELLM_API_KEY
        if settings.LITELLM_BASE_URL:
            completion_params["api_base"] = settings.LITELLM_BASE_URL
            
        with sentry_sdk.start_span(op="llm.completion", name=f"LiteLLM: {selected_model}"):
            response = await acompletion(**completion_params)
        
        # Capture token usage
        usage = getattr(response, 'usage', None)
        if usage:
            sentry_sdk.set_tag("llm.model", selected_model)
            sentry_sdk.set_extra("llm.usage.prompt_tokens", getattr(usage, 'prompt_tokens', 0))
            sentry_sdk.set_extra("llm.usage.completion_tokens", getattr(usage, 'completion_tokens', 0))
            sentry_sdk.set_extra("llm.usage.total_tokens", getattr(usage, 'total_tokens', 0))
            logger.info(f"LLM Usage: {usage}")

        logger.info(f"Successfully received response from {selected_model}")
        return response.choices[0].message.content

    except OpenAIError as e:
        logger.error(f"LiteLLM error: {str(e)}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in get_llm_response: {str(e)}")
        raise e

async def get_llm_streaming_response(
    messages: list, 
    model: str = None, 
    temperature: float = 0.7, 
    max_tokens: int = 1000,
    **kwargs
):
    """
    Get a streaming response from the LLM using LiteLLM.
    """
    selected_model = model or settings.LITELLM_MODEL
    
    try:
        logger.info(f"Requesting streaming LLM response from model: {selected_model}")
        
        # Prepare parameters
        completion_params = {
            "model": selected_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True,
            **kwargs
        }
        
        if settings.LITELLM_API_KEY:
            completion_params["api_key"] = settings.LITELLM_API_KEY
        if settings.LITELLM_BASE_URL:
            completion_params["api_base"] = settings.LITELLM_BASE_URL
            
        with sentry_sdk.start_span(op="llm.completion.stream", name=f"LiteLLM Stream: {selected_model}"):
            response = await acompletion(**completion_params)
        
        # Note: Usage for streaming is usually only available in the last chunk
        # and depends on the provider/LiteLLM settings.
        # For now, we just trace the call start.
        
        return response

    except OpenAIError as e:
        logger.error(f"LiteLLM streaming error: {str(e)}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in get_llm_streaming_response: {str(e)}")
        raise e
