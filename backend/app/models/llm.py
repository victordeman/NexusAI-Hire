import logging
from litellm import acompletion
from litellm.exceptions import OpenAIError
from app.config import settings

logger = logging.getLogger(__name__)

def to_llm_messages(history: list) -> list:
    """
    Convert conversation history to LiteLLM-compatible messages.
    Ensures a system prompt is present.
    """
    system_prompt = "You are an expert technical interviewer. Be concise, probing, and professional. Focus on technical skills and problem-solving. Stay in character."

    # Check if system prompt already exists in history
    has_system = any(m.get("role") == "system" for m in history)

    if has_system:
        return history

    return [{"role": "system", "content": system_prompt}] + history

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
            
        response = await acompletion(**completion_params)
        
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
            
        response = await acompletion(**completion_params)
        return response

    except OpenAIError as e:
        logger.error(f"LiteLLM streaming error: {str(e)}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error in get_llm_streaming_response: {str(e)}")
        raise e
