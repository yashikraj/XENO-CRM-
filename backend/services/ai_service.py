import os
import json
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from models import Customer, CustomerSummary, Campaign
import openai
import google.generativeai as genai

load_dotenv()

# AI Provider Configuration
AI_PROVIDER = os.getenv("AI_PROVIDER", "openai")
AI_API_KEY = os.getenv("AI_API_KEY", "YOUR_API_KEY")

# Initialize AI client based on provider
if AI_PROVIDER == "openai":
    client = openai.OpenAI(api_key=AI_API_KEY)
    model = "gpt-4o"
elif AI_PROVIDER == "gemini":
    genai.configure(api_key=AI_API_KEY)
    client = genai.GenerativeModel("gemini-2.0-flash")
    model = "gemini-2.0-flash"
elif AI_PROVIDER == "groq":
    client = openai.OpenAI(
        api_key=AI_API_KEY,
        base_url="https://api.groq.com/openai/v1"
    )
    model = "llama-3.3-70b-versatile"
else:
    client = None
    model = "gpt-4o"


def get_crm_data(db: Session) -> Dict[str, Any]:
    """
    Fetch all CRM data to give the AI Copilot context:
    - Customers (with summary)
    - Segments
    - Campaigns
    """
    customers = db.query(Customer).all()
    customer_list = []
    for c in customers:
        summary = db.query(CustomerSummary).filter(CustomerSummary.customer_id == c.customer_id).first()
        customer_dict = {
            "customer_id": c.customer_id,
            "name": c.name,
            "email": c.email,
            "customer_type": c.customer_type,
            "total_orders": summary.total_orders if summary else 0,
            "total_spent": summary.total_spent if summary else 0.0,
            "days_inactive": summary.days_inactive if summary else 0
        }
        customer_list.append(customer_dict)

    campaigns = db.query(Campaign).all()
    campaign_list = [
        {
            "campaign_id": c.campaign_id,
            "campaign_name": c.campaign_name,
            "segment_name": c.segment_name,
            "message": c.message,
            "created_at": str(c.created_at)
        }
        for c in campaigns
    ]

    return {
        "customers": customer_list,
        "campaigns": campaign_list
    }


def process_ai_query(query: str, db: Session) -> Dict[str, Any]:
    """
    Process user query with AI, using CRM data context, and return structured response.
    """
    crm_data = get_crm_data(db)

    system_prompt = """You are an AI Marketing Copilot for a CRM system. Your job is to analyze customer data and provide complete marketing campaign recommendations.

Given:
1. A natural language query from the user
2. Full CRM data (customers, campaigns)

Respond strictly with a JSON object in this EXACT format:
{
  "summary": "A clear, concise summary of your analysis",
  "strategy": {
    "campaign_name": "A compelling campaign name",
    "target_segment": "Name of the recommended customer segment (e.g., 'Inactive >30 Days', 'VIP High-Spending', etc.)",
    "campaign_goal": "Clear goal of the campaign",
    "reasoning": "Brief explanation of why you made these recommendations",
    "customers_found": 0
  },
  "content": {
    "email_subject": "Catchy email subject line",
    "email_message": "Personalized email message. You can use {{customer_name}} as a placeholder."
  }
}

IMPORTANT:
- 'customers_found' should be the number of customers matching the criteria in the query
- Only return JSON, no additional text
- Use the provided CRM data to compute accurate numbers
- Be specific and actionable
- The email message should be friendly and professional
"""

    user_prompt = f"""
CRM Data:
{json.dumps(crm_data, indent=2)}

User Query: {query}
"""

    # If API key is still placeholder, return mock data for testing
    if AI_API_KEY == "YOUR_API_KEY":
        return get_mock_response(query, crm_data)

    # Call actual AI API
    try:
        if AI_PROVIDER == "gemini":
            full_prompt = system_prompt + "\n" + user_prompt
            response = client.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json"
                )
            )
            ai_response = json.loads(response.text)
        elif AI_PROVIDER == "openai":
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"}
            )
            ai_response = json.loads(response.choices[0].message.content)
        else:
            ai_response = get_mock_response(query, crm_data)
        return ai_response
    except Exception as e:
        print(f"AI API error: {e}")
        return get_mock_response(query, crm_data)


def get_mock_response(query: str, crm_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Return a realistic mock response when AI API key is not set (for testing/demo purposes).
    """
    query_lower = query.lower()

    customers = crm_data.get("customers", [])
    inactive_customers = [c for c in customers if c.get("days_inactive", 0) > 30]
    vip_customers = [c for c in customers if c.get("customer_type") == "VIP"]
    high_spending = [c for c in customers if c.get("total_spent", 0) > 10000]

    if "inactive" in query_lower:
        return {
            "summary": "Found customers who have been inactive for more than 30 days. These customers are at risk of churning and should be targeted with a win-back campaign.",
            "strategy": {
                "campaign_name": "We Miss You - Win Back Campaign",
                "target_segment": "Inactive >30 Days",
                "campaign_goal": "Re-engage inactive customers and reduce churn",
                "reasoning": "Inactive customers have a high churn probability. A targeted discount campaign can effectively re-engage them.",
                "customers_found": len(inactive_customers)
            },
            "content": {
                "email_subject": "We Miss You! Here's 15% Off Your Next Purchase",
                "email_message": "Hi {{customer_name}},\n\nIt's been a while since we've seen you! As a valued customer, we'd like to welcome you back with 15% off your next purchase.\n\nThank you for being part of our community.\n\nBest regards,\nThe AI CRM Team"
            }
        }
    elif "vip" in query_lower:
        return {
            "summary": "Identified VIP customers who contribute significantly to revenue. These high-value customers should receive exclusive offers to boost loyalty.",
            "strategy": {
                "campaign_name": "VIP Loyalty Program",
                "target_segment": "VIP Customers",
                "campaign_goal": "Increase VIP retention and engagement",
                "reasoning": "VIP customers have higher lifetime value. Investing in their retention yields strong returns.",
                "customers_found": len(vip_customers)
            },
            "content": {
                "email_subject": "Exclusive VIP Access Just for You",
                "email_message": "Hi {{customer_name}},\n\nAs one of our most valued customers, we are giving you early access to new products and exclusive rewards.\n\nThank you for your loyalty.\n\nBest regards,\nThe AI CRM Team"
            }
        }
    elif "churn" in query_lower:
        return {
            "summary": "Identified customers at high risk of churning based on inactivity and purchase patterns. Immediate action is recommended.",
            "strategy": {
                "campaign_name": "Churn Prevention Campaign",
                "target_segment": "High Churn Risk",
                "campaign_goal": "Prevent at-risk customers from churning",
                "reasoning": "Preventing churn is more cost-effective than acquiring new customers.",
                "customers_found": len(inactive_customers)
            },
            "content": {
                "email_subject": "We Want You Back! Special Offer Inside",
                "email_message": "Hi {{customer_name}},\n\nWe've noticed you haven't been around lately. We'd love to see you again, so we're sending you this special offer to welcome you back.\n\nBest regards,\nThe AI CRM Team"
            }
        }
    elif "high-value" in query_lower or "high spending" in query_lower:
        return {
            "summary": "Found high-value customers who have spent significant amounts. These should be prioritized for retention and upselling.",
            "strategy": {
                "campaign_name": "High-Value Customer Appreciation",
                "target_segment": "High-Value Customers",
                "campaign_goal": "Increase loyalty and upsell premium products",
                "reasoning": "High-value customers drive most revenue; focusing on them maximizes ROI.",
                "customers_found": len(high_spending)
            },
            "content": {
                "email_subject": "Exclusive Offer for Our Top Customers",
                "email_message": "Hi {{customer_name}},\n\nThank you for being one of our top customers! We've prepared an exclusive offer just for you.\n\nBest regards,\nThe AI CRM Team"
            }
        }
    elif "campaign" in query_lower and ("inactive" in query_lower or "win-back" in query_lower):
        return {
            "summary": "Created a win-back campaign strategy for inactive customers with realistic engagement projections.",
            "strategy": {
                "campaign_name": "Win-Back Campaign 2026",
                "target_segment": "Inactive >30 Days",
                "campaign_goal": "Re-engage 30% of inactive customers",
                "reasoning": "Combining discount with free shipping increases conversion rates for inactive customers.",
                "customers_found": len(inactive_customers)
            },
            "content": {
                "email_subject": "Come Back! 20% Off + Free Shipping",
                "email_message": "Hi {{customer_name}},\n\nWe miss you! To welcome you back, enjoy 20% off your next order plus free shipping.\n\nBest regards,\nThe AI CRM Team"
            }
        }
    else:
        return {
            "summary": "Analyzed your customer base and identified key opportunities for engagement.",
            "strategy": {
                "campaign_name": "General Engagement Campaign",
                "target_segment": "All Customers",
                "campaign_goal": "Increase overall customer engagement",
                "reasoning": "A broad campaign can increase overall engagement and awareness.",
                "customers_found": len(customers)
            },
            "content": {
                "email_subject": "New Products and Special Offers Inside!",
                "email_message": "Hi {{customer_name}},\n\nCheck out our latest products and special offers available now!\n\nBest regards,\nThe AI CRM Team"
            }
        }
