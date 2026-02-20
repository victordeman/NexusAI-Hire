from litellm import completion
from app.config import settings

def get_llm_response(messages: list, model: str = None):
    selected_model = model or settings.LITELLM_MODEL
    # LiteLLM unifies calls: openai/gpt-4o, gemini/gemini-1.5, ollama/llama3
    response = completion(
        model=selected_model,  # e.g., "openai/gpt-4o", "gemini/gemini-pro", "ollama/llama3"
        messages=messages,
        api_key=settings.LITELLM_API_KEY,
        api_base=settings.LITELLM_BASE_URL,  # For Ollama
        temperature=0.7,
    )
    return response.choices[0].message.content

# Example usage in endpoint: allow override via query param or header
