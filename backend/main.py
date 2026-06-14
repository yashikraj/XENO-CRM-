from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "https://xeno-crm-wn7p-xi.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import database
import models
from import_data import import_data_from_csv
from routers import campaigns, customers, dashboard, segments, ai

# Create all tables in the database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="AI-Native Marketing CRM",
    description="Backend for an AI-Native Marketing CRM using FastAPI.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    """
    Populate the database with initial data from CSV files on startup.
    """
    db = database.SessionLocal()
    import_data_from_csv(db)
    db.close()

@app.get("/")
def read_root():
    """
    Returns the service status.
    """
    return {"status": "AI-Native Marketing CRM is running"}

# Include routers
app.include_router(customers.router, tags=["Customers"])
app.include_router(dashboard.router, tags=["Dashboard"])
app.include_router(campaigns.router, tags=["Campaigns"])
app.include_router(segments.router, tags=["Segments"])
app.include_router(ai.router, prefix="/ai", tags=["AI Copilot"])
