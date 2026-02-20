# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.interview import router as interview_router
from app.config import settings

app = FastAPI(
    title=settings.APP_TITLE,
    description="Backend for AI-powered interviews",
    version=settings.APP_VERSION,
    debug=settings.DEBUG
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
    return {"message": f"{settings.APP_TITLE} backend running", "version": settings.APP_VERSION}
