from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import schemas
from database import get_db
from services.segmentation import get_customers_by_segment
from routers.customers import serialize_customer

router = APIRouter()

@router.post("/segment", response_model=List[schemas.CustomerRecord])
def get_segment(payload: schemas.SegmentPayload, db: Session = Depends(get_db)):
    """
    Get customers belonging to a specific segment.
    """
    customers = get_customers_by_segment(db, segment_type=payload.type, days=payload.days, min_spent=payload.min_spent)
    if not customers:
        raise HTTPException(status_code=404, detail="No customers found for this segment")
    return [serialize_customer(customer) for customer in customers]
