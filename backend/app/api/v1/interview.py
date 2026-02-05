# backend/app/api/v1/interview_connected.py  (or overwrite original)
from fastapi import APIRouter, Body
from typing import Optional
from pydantic import BaseModel
import random  # for mock trust score until real proctoring

from app.models.llm import get_llm_response

router = APIRouter()  # No prefix here — we mount with /api/v1 in main.py

class AskRequest(BaseModel):
    question: str
    model: Optional[str] = None

@router.post("/ask")
async def ask_question(request: AskRequest):
    # Optional: add system prompt for better interview behavior
    messages = [
        {"role": "system", "content": "You are an expert technical interviewer. Be concise, probing, and professional."},
        {"role": "user", "content": request.question}
    ]
    
    answer = get_llm_response(messages, request.model)
    
    # Mock trust score (replace with real proctoring later)
    trust_score = random.randint(72, 99)
    
    return {
        "answer": answer,
        "trust_score": trust_score
    }
