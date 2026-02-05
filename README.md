# NexusAI Hire

This project develops an AI-powered automated interview platform that leverages a Multi-AI-Agent architecture using LiteLLM to conduct adaptive text-based interviews with dynamic LLM switching. The system supports recruiter dashboards, real-time proctoring simulations, and trust scoring, targeting efficient technical screenings for hiring teams. It combines a FastAPI backend for LLM interactions with a static frontend for user interfaces..

## Features (MVP + Enhancements)
- **Adaptive Interviews**: Text-based chat interviews with dynamic questioning (voice/video planned).
- **Dynamic LLM Switching**: Seamlessly select between OpenAI (GPT-4o-mini/GPT-4o), Google Gemini, Ollama/Llama3 (local), or Anthropic Claude via LiteLLM proxy.
- **Recruiter Dashboard**: View live interviews, stats, recent completions, and model performance analytics.
- **Proctoring & Trust Scoring**: Real-time behavioral monitoring (mocked in backend; e.g., tab-switching alerts) with dynamic trust scores (72-99 range).
- **Frontend UI**: Modern glassmorphism design with web components for navbar, sidebar, model selector. Static pages: landing (index.html), dashboard, interview.
- **Backend API**: FastAPI endpoints for asking questions (/api/v1/ask) with model override and response generation.
- **Integration**: Frontend chat connects to backend for real LLM responses; model selection persists via localStorage.
- **Auth/Database**: Supabase integration (configured but not yet wired in enhanced code).
- **Additional**: Simulated typing indicators, auto-resizing inputs, theme toggling, and basic animations.

## Repository Structure
```
NexusAI-Hire/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── interview.py  # API endpoint for asking questions
│   │   ├── models/
│   │   │   └── llm.py  # LLM response handler via LiteLLM
│   │   ├── config.py  # Environment config loader
│   │   └── main.py  # FastAPI app entry with CORS
│   └── requirements.txt  # Python dependencies (FastAPI, LiteLLM, etc.)
├── docs/
│   └── architecture.md  # High-level system diagram (Mermaid graph)
├── frontend/
│   ├── components/
│   │   ├── ModelSelector.js  # Web component for LLM dropdown
│   │   ├── navbar.js  # Web component for top nav
│   │   └── sidebar.js  # Web component for side nav
│   ├── dashboard.html  # Recruiter dashboard page
│   ├── index.html  # Landing page
│   ├── interview.html  # Interview simulation page
│   ├── interview_connected.html  # Connected version (optional; merge into interview.html)
│   ├── script.js  # Shared utilities (e.g., time formatting, mock API)
│   └── style.css  # Global styles (dark theme, glass panels)
└── README.md  # This file
text
```

### New Changes
#### Frontend Updates
- Added static HTML pages: `index.html` (landing/hero), `dashboard.html` (stats, live interviews, assessments), `interview.html` (video/chat/code interface with proctoring overlays).
- Shared assets: `style.css` (global styles, glass panels, animations), `script.js` (utils like time formatting, API simulation, theme management).
- Web Components in `components/`:
  - `navbar.js`: Responsive top navigation with links, theme toggle, and avatar.
  - `ModelSelector.js`: Dropdown for LLM selection; persists choice and dispatches events.
  - `sidebar.js`: Collapsible sidebar with nav items (dashboard, interviews, etc.); responsive for mobile.
- Connection: `interview_connected.html` (or overwrite interview.html) now fetches real responses from backend via POST to `/api/v1/ask`, updates trust score dynamically, and reflects model choice in UI badge.

#### Backend Updates
- Enhanced `main.py`: Added CORS middleware for frontend access (allow all origins for dev; restrict in prod).
- Updated `interview.py`: Now uses Pydantic model for requests (question + optional model); adds system prompt for interviewer role; mocks trust score.
- LLM Handling: Unified via LiteLLM in `llm.py` — supports model switching without code changes.
- Config: `.env` for API keys, base URLs (e.g., Ollama local).

No breaking changes; original bash setup remains compatible, but frontend now runs statically.

## Setup
1. Clone repo: `git clone https://github.com/victordeman/NexusAI-Hire.git`
2. Copy `.env.example` to `.env` and fill in keys (e.g., OPENAI_API_KEY, SUPABASE_URL).

### Backend
1. `cd backend`
2. Install: `pip install -r requirements.txt`
3. Run: `uvicorn app.main:app --reload --port 8000`
   - Test: Visit http://localhost:8000/docs for Swagger UI; try POST /api/v1/ask.

### Frontend
1. `cd frontend`
2. No build needed (static) — install dev server: `npm install -g live-server` (or use package.json if added).
3. Run: `live-server . --port=8080` (or `npm run dev` if package.json configured).
   - Pages: http://localhost:8080/index.html (landing), /dashboard.html, /interview_connected.html (connected chat).
   - Test chat: Type a question → gets real LLM response + updated trust score.

### Full System Test
- Run backend + frontend simultaneously.
- In interview page: Select model, send message → verifies connection.
- Notes: Chat is single-turn (no history yet); trust score mocked.
