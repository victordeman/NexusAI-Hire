from fastapi import APIRouter, Depends
from app.models.llm import get_llm_response

router = APIRouter(prefix="/interview")

@router.post("/ask")
async def ask_question(question: str, model: str = None):
    messages = [{"role": "user", "content": question}]
    answer = get_llm_response(messages, model)
    # Simple trust score placeholder (later: sentiment + proctoring)
    trust_score = 85  # Mock 0-100
    return {"answer": answer, "trust_score": trust_score}
