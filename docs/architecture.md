graph TD
    A[Frontend Next.js] --> B[FastAPI Backend]
    B --> C[LiteLLM (Model Switch)]
    C --> D[OpenAI / Gemini / Ollama]
    B --> E[Supabase DB]
    A --> F[Clerk Auth]
