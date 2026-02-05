# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.interview import router as interview_router

app = FastAPI(
    title="NexusAI Hire API",
    description="Backend for AI-powered interviews",
    version="1.0.0"
)

# Allow frontend on different port (live-server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to ["http://localhost:8080"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the interview router at /api/v1
app.include_router(interview_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "NexusAI Hire backend running"}
