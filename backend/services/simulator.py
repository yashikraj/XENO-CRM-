import random
from sqlalchemy.orm import Session

import models
from services.segmentation import get_customers_by_segment

def simulate_campaign_events(db: Session, campaign_id: int):
    """
    Simulates sending a campaign and generates communication events.
    """
    campaign = db.query(models.Campaign).filter(models.Campaign.campaign_id == campaign_id).first()
    if not campaign:
        return None

    if campaign.segment_name == "inactive_customers":
        customers = get_customers_by_segment(db, "inactive", 45)
    else:
        customers = []

    events = []
    event_types = ["DELIVERED", "OPENED", "CLICKED", "FAILED"]
    for customer in customers:
        event_type = random.choice(event_types)
        event = models.CommunicationEvent(
            campaign_id=campaign.campaign_id,
            customer_id=customer.customer_id,
            event_type=event_type,
        )
        events.append(event)

    db.add_all(events)
    db.commit()
    return events
