from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.orm import selectinload
from typing import List

import models
import schemas
from database import get_db
from services.segmentation import get_inactive_customers

router = APIRouter()


def serialize_customer(customer: models.Customer) -> schemas.CustomerRecord:
    summary = customer.summary
    return {
        "customer_id": customer.customer_id,
        "name": customer.name,
        "email": customer.email,
        "phone": customer.phone,
        "customer_type": customer.customer_type,
        "total_orders": summary.total_orders if summary else 0,
        "total_spent": float(summary.total_spent) if summary else 0.0,
        "last_purchase": summary.last_purchase if summary else None,
        "days_inactive": summary.days_inactive if summary else 0,
    }

@router.get("/customers", response_model=List[schemas.CustomerRecord])
def read_customers(db: Session = Depends(get_db)):
    """
    Retrieve all customers.
    """
    customers = (
        db.query(models.Customer)
        .options(selectinload(models.Customer.summary))
        .order_by(models.Customer.customer_id)
        .all()
    )
    return [serialize_customer(customer) for customer in customers]

@router.get("/customers/inactive", response_model=List[schemas.CustomerRecord])
def read_inactive_customers(db: Session = Depends(get_db)):
    """
    Retrieve customers who have been inactive for more than 45 days.
    """
    return [serialize_customer(customer) for customer in get_inactive_customers(db, days_inactive=45)]
