from sqlalchemy.orm import Session

import models
import schemas

def create_campaign(db: Session, campaign_payload: schemas.CampaignPayload):
    """
    Creates a new campaign.
    """
    campaign = models.Campaign(
        campaign_name=campaign_payload.campaign_name or f"Campaign for {campaign_payload.segment_name}",
        segment_name=campaign_payload.segment_name,
        message=campaign_payload.message,
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign
