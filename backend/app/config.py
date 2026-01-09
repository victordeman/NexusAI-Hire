from dotenv import load_dotenv
import os

load_dotenv()

# LiteLLM handles switching
LITELLM_MODEL = os.getenv("LITELLM_MODEL", "gpt-4o-mini")  # Default
LITELLM_API_KEY = os.getenv("OPENAI_API_KEY")  # Or Gemini/Ollama key
LITELLM_BASE_URL = os.getenv("OLLAMA_BASE_URL", None)  # For local fallback

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
