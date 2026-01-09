# NexusAI Hire

AI-powered automated interview platform with adaptive voice/video, proctoring, and trust scoring.

## Features (MVP)
- Adaptive text interviews (voice/video next)
- Dynamic LLM switching (OpenAI, Gemini, Ollama/local via LiteLLM)
- Recruiter dashboard with model selector
- Supabase auth/database

## Setup
1. Clone repo
2. Copy .env.example → .env
3. Backend: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload`
4. Frontend: `cd frontend && npm install && npm run dev`
