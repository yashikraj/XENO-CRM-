from sqlalchemy.orm import Session

import models

def get_inactive_customers(db: Session, days_inactive: int):
    """
    Retrieves customers who have been inactive for a specified number of days.
    """
    return (
        db.query(models.Customer)
        .join(models.CustomerSummary)
        .filter(models.CustomerSummary.days_inactive > days_inactive)
        .all()
    )


def get_vip_customers(db: Session):
    return db.query(models.Customer).filter(models.Customer.customer_type == "VIP").all()


def get_high_spenders(db: Session, minimum_spent: float):
    return (
        db.query(models.Customer)
        .join(models.CustomerSummary)
        .filter(models.CustomerSummary.total_spent >= minimum_spent)
        .all()
    )


def get_customers_by_segment(db: Session, segment_type: str, days: int, min_spent: float = 20000.0):
    """
    Returns customers based on a given segment type.
    """
    if segment_type == "inactive":
        return get_inactive_customers(db, days)
    if segment_type == "vip":
        return get_vip_customers(db)
    if segment_type == "high_spenders":
        return get_high_spenders(db, minimum_spent=min_spent)
    return []
