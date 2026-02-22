# backend/app/api/v1/interview_connected.py  (or overwrite original)
from fastapi import APIRouter, Body, HTTPException
from typing import Optional, List, Dict
from pydantic import BaseModel
import random  # for mock trust score until real proctoring
import uuid
import logging

from app.models.llm import get_llm_response, to_llm_messages

router = APIRouter()  # No prefix here — we mount with /api/v1 in main.py

# Global in-memory history storage
conversation_history: Dict[str, List[dict]] = {}

class Message(BaseModel):
    role: str
    content: str

class AskRequest(BaseModel):
    session_id: Optional[str] = None
    question: Optional[str] = None
    messages: Optional[List[Message]] = None
    model: Optional[str] = None
    current_trust_score: Optional[int] = 90

@router.post("/ask")
async def ask_question(request: AskRequest):
    try:
        # 1. Handle session ID and retrieve/initialize history
        session_id = request.session_id
        if not session_id:
            session_id = str(uuid.uuid4())

        if session_id not in conversation_history:
            conversation_history[session_id] = []

        history = conversation_history[session_id]

        # 2. Prepare current turn's messages
        if request.messages:
            # If explicit messages provided, use them to seed/overwrite history for this session
            history = [m.model_dump() for m in request.messages]
            conversation_history[session_id] = history
        elif request.question:
            # Append new user question to history
            history.append({"role": "user", "content": request.question})
        else:
            raise HTTPException(status_code=400, detail="Either 'question' or 'messages' must be provided.")

        # 3. Convert history to LiteLLM format (adds system prompt)
        llm_messages = to_llm_messages(history)

        # 4. Get LLM response
        answer = await get_llm_response(llm_messages, request.model)

        # 5. Append AI response to history
        history.append({"role": "assistant", "content": answer})

        # 6. Update trust score (simulated logic)
        # Small random fluctuation, but stays within 70-100 range
        base_score = request.current_trust_score or 90
        fluctuation = random.randint(-2, 1)
        trust_score = max(70, min(100, base_score + fluctuation))

        return {
            "answer": answer,
            "trust_score": trust_score,
            "session_id": session_id
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error in ask_question: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get response from AI: {str(e)}")
