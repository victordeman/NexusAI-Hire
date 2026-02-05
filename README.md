# NexusAI Hire

AI-powered automated interview platform with adaptive voice/video (MVP focus on text), proctoring, and trust scoring. Built with FastAPI backend (using LiteLLM for dynamic LLM switching) and a static vanilla JS frontend (with web components for modularity).

## Features (Updated MVP)
- **Adaptive Text Interviews**: Real-time chat with AI interviewer, integrated with backend for LLM responses (e.g., GPT-4o, Gemini, Llama3).
- **Dynamic LLM Switching**: Select models via UI (persisted in localStorage); backend handles via LiteLLM (OpenAI, Gemini, Ollama/local).
- **Recruiter Dashboard**: Static views for live interviews, stats, and recent assessments (no dynamic data yet; extendable).
- **Proctoring & Trust Scoring**: Simulated in frontend (e.g., alerts, score overlays); backend mocks trust scores (expand to real behavioral analysis).
- **Web Components**: Modular UI elements like `<nexus-navbar>`, `<nexus-sidebar>`, `<nexus-model-selector>` for easy reuse.
- **Backend API**: `/api/v1/ask` endpoint for questions, with CORS for frontend integration.
- **Supabase Integration**: Configured but not yet used (future: auth/database for sessions).
- **Static Frontend**: HTML/CSS/JS pages (index, dashboard, interview) with glassmorphism UI, animations, and feather icons.

## Changes Summary
### Backend Updates
- Added CORS middleware in `main.py` for frontend cross-origin requests.
- Mounted API router at `/api/v1` for organized endpoints.
- Updated `/ask` endpoint in `interview.py` to use Pydantic models, add system prompt for interviewer role, and return mocked trust scores.
- No new dependencies; still relies on FastAPI, Uvicorn, Pydantic, Supabase, LiteLLM, python-dotenv.

### Frontend Additions & Changes
- Shifted from minimal React/TSX (original ModelSelector.tsx) to vanilla JS web components for simplicity and static serving.
- New pages: `index.html` (landing/hero), `dashboard.html` (stats, live interviews), `interview.html` (chat/code with AI).
- Shared files: `style.css` (Tailwind-inspired dark theme), `script.js` (utils like time formatting, API simulation — now partially real).
- Components folder: `navbar.js`, `sidebar.js`, `ModelSelector.js` (custom elements for reusable UI).
- Integration: Chat in `interview.html` now fetches real LLM responses from backend via Fetch API; model selector updates requests.
- Connected version: `interview_connected.html` (optional; rename to interview.html for live use).
- Dependencies: Feather icons (CDN), Tailwind (CDN in HTML); optional `live-server` for dev.

## Setup
1. Clone the repo:
