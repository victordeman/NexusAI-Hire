# backend/app/api/v1/interview_connected.py  (or overwrite original)
from fastapi import APIRouter, Body, HTTPException
from typing import Optional, List
from pydantic import BaseModel
import random  # for mock trust score until real proctoring
import logging

from app.models.llm import get_llm_response

router = APIRouter()  # No prefix here — we mount with /api/v1 in main.py

class Message(BaseModel):
    role: str
    content: str

class AskRequest(BaseModel):
    question: Optional[str] = None
    messages: Optional[List[Message]] = None
    model: Optional[str] = None
    current_trust_score: Optional[int] = 90

@router.post("/ask")
async def ask_question(request: AskRequest):
    try:
        # 1. Prepare messages
        messages = []
        if request.messages:
            messages = [m.model_dump() for m in request.messages]
        elif request.question:
            messages = [{"role": "user", "content": request.question}]
        else:
            raise HTTPException(status_code=400, detail="Either 'question' or 'messages' must be provided.")

        # 2. Ensure system prompt is present
        system_prompt = "You are an expert technical interviewer. Be concise, probing, and professional. Focus on technical skills and problem-solving. Stay in character."
        has_system = any(m["role"] == "system" for m in messages)
        if not has_system:
            messages.insert(0, {"role": "system", "content": system_prompt})

        # 3. Get LLM response
        answer = await get_llm_response(messages, request.model)

        # 4. Update trust score (simulated logic)
        # Small random fluctuation, but stays within 70-100 range
        base_score = request.current_trust_score or 90
        fluctuation = random.randint(-2, 1)
        trust_score = max(70, min(100, base_score + fluctuation))

        return {
            "answer": answer,
            "trust_score": trust_score
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error in ask_question: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get response from AI: {str(e)}")
