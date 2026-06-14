"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
}

export interface AICampaignStrategy {
  campaign_name: string;
  target_segment: string;
  campaign_goal: string;
  reasoning: string;
  customers_found: number;
}

export interface AICampaignContent {
  email_subject: string;
  email_message: string;
}

export interface AIRecommendation {
  summary: string;
  strategy: AICampaignStrategy;
  content: AICampaignContent;
}

export interface Campaign {
  id: string;
  name: string;
  segment: string;
  message: string;
  emailSubject?: string;
  emailMessage?: string;
  createdAt: Date;
  status: "draft" | "scheduled" | "completed";
  metrics: CampaignMetrics;
  aiRecommendation?: AIRecommendation;
  campaignStrategy?: AICampaignStrategy;
  campaignContent?: AICampaignContent;
}

interface CampaignContextType {
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, "id" | "createdAt" | "metrics" | "status"> & { aiRecommendation?: AIRecommendation, campaignStrategy?: AICampaignStrategy, campaignContent?: AICampaignContent, customersFound?: number }) => void;
  getCampaignById: (id: string) => Campaign | undefined;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

// Helper function to simulate campaign metrics
const simulateMetrics = (customersFound: number): CampaignMetrics => {
  const sent = customersFound;
  const deliveryRate = 0.9 + Math.random() * 0.08; // 90-98%
  const delivered = Math.floor(sent * deliveryRate);
  const failed = sent - delivered;
  const openRate = 0.5 + Math.random() * 0.3; // 50-80% of delivered
  const opened = Math.floor(delivered * openRate);
  const clickRate = 0.1 + Math.random() * 0.3; // 10-40% of opened
  const clicked = Math.floor(opened * clickRate);
  return { sent, delivered, opened, clicked, failed };
};

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("campaigns");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert string dates back to Date objects
        const hydrated = parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        }));
        setCampaigns(hydrated);
      } catch (e) {
        console.error("Failed to load campaigns", e);
      }
    }
  }, []);

  // Save to localStorage whenever campaigns change
  useEffect(() => {
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
  }, [campaigns]);

  const addCampaign = (campaignData: Omit<Campaign, "id" | "createdAt" | "metrics" | "status"> & { aiRecommendation?: AIRecommendation, campaignStrategy?: AICampaignStrategy, campaignContent?: AICampaignContent, customersFound?: number }) => {
    // Determine customersFound: use provided value, or from strategy, or default to 10
    let customersFound = campaignData.customersFound || 10;
    if (campaignData.campaignStrategy) {
      customersFound = campaignData.campaignStrategy.customers_found;
    } else if (campaignData.aiRecommendation) {
      customersFound = campaignData.aiRecommendation.strategy.customers_found;
    }
    
    const newCampaign: Campaign = {
      ...campaignData,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: "completed",
      metrics: simulateMetrics(customersFound),
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  const getCampaignById = (id: string) => {
    return campaigns.find((c) => c.id === id);
  };

  return (
    <CampaignContext.Provider value={{ campaigns, addCampaign, getCampaignById }}>
      {children}
    </CampaignContext.Provider>
  );
};

// Custom hook to use the context
export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaigns must be used within a CampaignProvider");
  }
  return context;
};
