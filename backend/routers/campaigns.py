from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

import models
import schemas
from database import get_db
from services import campaign as campaign_service
from services import simulator as simulator_service

router = APIRouter()

@router.post("/campaign", response_model=schemas.Campaign)
def create_campaign(payload: schemas.CampaignPayload, db: Session = Depends(get_db)):
    """
    Create a new campaign based on a segment.
    """
    return campaign_service.create_campaign(db=db, campaign_payload=payload)

@router.post("/simulate")
def simulate_campaign(campaign_id: int, db: Session = Depends(get_db)):
    """
    Simulate the events for a given campaign.
    """
    events = simulator_service.simulate_campaign_events(db, campaign_id)
    if not events:
        raise HTTPException(status_code=404, detail="Campaign not found or no customers in segment")
    return {"message": f"Simulated {len(events)} events for campaign {campaign_id}"}


@router.get("/campaigns", response_model=list[schemas.CampaignHistoryItem])
def list_campaigns(db: Session = Depends(get_db)):
    return db.query(models.Campaign).order_by(models.Campaign.created_at.desc()).all()


@router.get("/analytics", response_model=schemas.AnalyticsStats)
def get_analytics(db: Session = Depends(get_db)):
    totals = {
        "sent": db.query(models.CommunicationEvent).count(),
        "delivered": db.query(models.CommunicationEvent).filter(models.CommunicationEvent.event_type == "DELIVERED").count(),
        "opened": db.query(models.CommunicationEvent).filter(models.CommunicationEvent.event_type == "OPENED").count(),
        "clicked": db.query(models.CommunicationEvent).filter(models.CommunicationEvent.event_type == "CLICKED").count(),
        "failed": db.query(models.CommunicationEvent).filter(models.CommunicationEvent.event_type == "FAILED").count(),
    }
    return totals
