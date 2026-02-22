# backend/app/api/v1/interview_connected.py  (or overwrite original)
from fastapi import APIRouter, Body, HTTPException, Depends
from typing import Optional, List
from pydantic import BaseModel
import random  # for mock trust score until real proctoring
import logging

from app.models.llm import get_llm_response
from app.api.deps import get_current_user
from app.core.supabase import supabase

router = APIRouter()  # No prefix here — we mount with /api/v1 in main.py

class Message(BaseModel):
    role: str
    content: str

class AskRequest(BaseModel):
    interview_id: Optional[str] = None
    question: Optional[str] = None
    messages: Optional[List[Message]] = None
    model: Optional[str] = None
    current_trust_score: Optional[int] = 90

class ProctorReportRequest(BaseModel):
    interview_id: str
    event_type: str
    snapshot: Optional[str] = None

@router.get("/interviews")
async def list_interviews(current_user: object = Depends(get_current_user)):
    try:
        result = supabase.table("interviews").select("*").eq("user_id", current_user.id).order("updated_at", desc=True).execute()
        return result.data
    except Exception as e:
        logging.error(f"Error listing interviews: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch interviews")

@router.get("/interviews/{interview_id}")
async def get_interview(interview_id: str, current_user: object = Depends(get_current_user)):
    try:
        result = supabase.table("interviews").select("*").eq("id", interview_id).eq("user_id", current_user.id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Interview not found")
        return result.data
    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error getting interview: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch interview")

@router.post("/ask")
async def ask_question(
    request: AskRequest,
    current_user: object = Depends(get_current_user)
):
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
        
        # Add AI response to history for persistence
        messages.append({"role": "assistant", "content": answer})

        # 4. Update trust score (simulated logic)
        # Small random fluctuation, but stays within 70-100 range
        base_score = request.current_trust_score or 90
        fluctuation = random.randint(-2, 1)
        trust_score = max(70, min(100, base_score + fluctuation))

        # 5. Persist to Supabase
        interview_data = {
            "user_id": current_user.id,
            "history": messages,
            "trust_score": trust_score,
            "model_used": request.model or "default",
            "status": "active"
        }

        if request.interview_id:
            # Update existing interview
            result = supabase.table("interviews").update(interview_data).eq("id", request.interview_id).eq("user_id", current_user.id).execute()
            interview_id = request.interview_id
        else:
            # Create new interview
            result = supabase.table("interviews").insert(interview_data).execute()
            if result.data:
                interview_id = result.data[0]["id"]
            else:
                interview_id = None

        return {
            "interview_id": interview_id,
            "answer": answer,
            "trust_score": trust_score
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error in ask_question: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get response from AI: {str(e)}")

@router.post("/proctor/report")
async def report_proctor_event(
    request: ProctorReportRequest,
    current_user: object = Depends(get_current_user)
):
    try:
        # 1. Fetch current interview to get the trust score
        result = supabase.table("interviews").select("trust_score").eq("id", request.interview_id).eq("user_id", current_user.id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Interview not found")

        current_score = result.data.get("trust_score", 90)

        # 2. Apply penalties
        penalty = 0
        if request.event_type == "tab_switch":
            penalty = 5
        elif request.event_type == "multiple_faces":
            penalty = 10
        elif request.event_type == "no_face":
            penalty = 2

        new_score = max(0, current_score - penalty)

        # 3. Update in Supabase
        supabase.table("interviews").update({"trust_score": new_score}).eq("id", request.interview_id).eq("user_id", current_user.id).execute()

        return {
            "status": "success",
            "new_trust_score": new_score,
            "event_processed": request.event_type
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error in report_proctor_event: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process proctoring event: {str(e)}")
