from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    customer_type = Column(String)

    orders = relationship("Order", back_populates="customer")
    summary = relationship("CustomerSummary", uselist=False, back_populates="customer")
    communication_events = relationship("CommunicationEvent", back_populates="customer")


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.customer_id"))
    amount = Column(Float)
    order_date = Column(DateTime)

    customer = relationship("Customer", back_populates="orders")


class CustomerSummary(Base):
    __tablename__ = "customer_summary"

    customer_id = Column(Integer, ForeignKey("customers.customer_id"), primary_key=True)
    total_orders = Column(Integer)
    total_spent = Column(Float)
    last_purchase = Column(DateTime)
    days_inactive = Column(Integer)

    customer = relationship("Customer", back_populates="summary")


class Campaign(Base):
    __tablename__ = "campaigns"

    campaign_id = Column(Integer, primary_key=True, index=True)
    campaign_name = Column(String)
    segment_name = Column(String)
    message = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    communication_events = relationship("CommunicationEvent", back_populates="campaign")


class CommunicationEvent(Base):
    __tablename__ = "communication_events"

    event_id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.campaign_id"))
    customer_id = Column(Integer, ForeignKey("customers.customer_id"))
    event_type = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    campaign = relationship("Campaign", back_populates="communication_events")
    customer = relationship("Customer", back_populates="communication_events")
