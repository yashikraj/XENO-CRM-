from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel
from services.ai_service import process_ai_query
from schemas import AIQueryResponse

router = APIRouter()

class AIQueryRequest(BaseModel):
    query: str

@router.post("/query", response_model=AIQueryResponse)
def ai_query(request: AIQueryRequest, db: Session = Depends(get_db)):
    """
    Process a natural language query with the AI Marketing Copilot.
    Returns structured marketing analysis and recommendations.
    """
    result = process_ai_query(request.query, db)
    return result
