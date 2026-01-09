from litellm import completion
from app.config import LITELLM_MODEL, LITELLM_API_KEY, LITELLM_BASE_URL

def get_llm_response(messages: list, model: str = None):
    selected_model = model or LITELLM_MODEL
    # LiteLLM unifies calls: openai/gpt-4o, gemini/gemini-1.5, ollama/llama3
    response = completion(
        model=selected_model,  # e.g., "openai/gpt-4o", "gemini/gemini-pro", "ollama/llama3"
        messages=messages,
        api_key=LITELLM_API_KEY,
        api_base=LITELLM_BASE_URL,  # For Ollama
        temperature=0.7,
    )
    return response.choices[0].message.content

# Example usage in endpoint: allow override via query param or header
