from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class CustomerRecord(ORMModel):
    customer_id: int
    name: str
    email: str
    phone: Optional[str] = None
    customer_type: Optional[str] = None
    total_orders: int = 0
    total_spent: float = 0.0
    last_purchase: Optional[datetime] = None
    days_inactive: int = 0

# Customer Schemas
class CustomerBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    customer_type: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase, ORMModel):
    customer_id: int

# Order Schemas
class OrderBase(BaseModel):
    customer_id: int
    amount: float
    order_date: datetime

class OrderCreate(OrderBase):
    pass

class Order(OrderBase, ORMModel):
    order_id: int

# Customer Summary Schemas
class CustomerSummaryBase(BaseModel):
    customer_id: int
    total_orders: int
    total_spent: float
    last_purchase: datetime
    days_inactive: int

class CustomerSummaryCreate(CustomerSummaryBase):
    pass

class CustomerSummary(CustomerSummaryBase, ORMModel):
    pass

# Campaign Schemas
class CampaignBase(BaseModel):
    campaign_name: str
    segment_name: str
    message: str

class CampaignCreate(CampaignBase):
    pass

class Campaign(CampaignBase, ORMModel):
    campaign_id: int
    created_at: datetime

# Communication Event Schemas
class CommunicationEventBase(BaseModel):
    campaign_id: int
    customer_id: int
    event_type: str

class CommunicationEventCreate(CommunicationEventBase):
    pass

class CommunicationEvent(CommunicationEventBase, ORMModel):
    event_id: int
    timestamp: datetime

# Dashboard Schema
class DashboardStats(BaseModel):
    total_customers: int
    active_customers: int
    inactive_customers: int
    total_revenue: float

# Segmentation Schemas
class SegmentPayload(BaseModel):
    type: str
    days: int = 45
    min_spent: float = 20000.0

# Campaign Schemas
class CampaignPayload(BaseModel):
    campaign_name: Optional[str] = None
    segment_name: str
    message: str


class CampaignHistoryItem(ORMModel):
    campaign_id: int
    campaign_name: str
    segment_name: str
    message: str
    created_at: datetime


class AnalyticsStats(BaseModel):
    sent: int
    delivered: int
    opened: int
    clicked: int
    failed: int


# AI Schemas
class AICampaignStrategy(BaseModel):
    campaign_name: str
    target_segment: str
    campaign_goal: str
    reasoning: str
    customers_found: int


class AICampaignContent(BaseModel):
    email_subject: str
    email_message: str


class AIQueryResponse(BaseModel):
    summary: str
    strategy: AICampaignStrategy
    content: AICampaignContent
