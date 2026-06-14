from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

import models
import schemas
from database import get_db

router = APIRouter()

@router.get("/dashboard", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Retrieve dashboard statistics.
    """
    total_customers = db.query(models.Customer).count()
    inactive_customers = db.query(models.CustomerSummary).filter(models.CustomerSummary.days_inactive > 45).count()
    active_customers = max(total_customers - inactive_customers, 0)
    total_revenue = db.query(func.sum(models.Order.amount)).scalar() or 0.0

    return {
        "total_customers": total_customers,
        "active_customers": active_customers,
        "inactive_customers": inactive_customers,
        "total_revenue": total_revenue
    }
