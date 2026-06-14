"use client";

import { useState } from "react";
import { useCampaigns } from "../lib/campaigns";
import { useRouter } from "next/navigation";

export default function CampaignsPage() {
  const [campaignName, setCampaignName] = useState("");
  const [segment, setSegment] = useState("VIP");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addCampaign } = useCampaigns();
  const router = useRouter();

  const handleSubmit = () => {
    if (!campaignName.trim() || !message.trim()) return;
    
    // Determine customers found based on segment
    const customersFound = segment === "VIP" ? 24 : segment === "Regular" ? 156 : 42;
    
    setIsSubmitting(true);
    setTimeout(() => {
      addCampaign({
        name: campaignName,
        segment,
        message,
        customersFound,
      });
      setShowSuccess(true);
      setIsSubmitting(false);
      setCampaignName("");
      setMessage("");
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/campaigns/history");
      }, 1500);
    }, 1000);
  };

  const segments = [
    { value: "VIP", label: "VIP Customers", description: "High-value premium customers", color: "amber" },
    { value: "Regular", label: "Regular Customers", description: "Standard engagement customers", color: "emerald" },
    { value: "Inactive", label: "Inactive Customers", description: "Re-engagement target", color: "zinc" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Create Campaign</h1>
        <p className="text-zinc-400 mt-1">
          Design and launch a new marketing campaign
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="rounded-xl p-4 border bg-emerald-500/15 border-emerald-500/30 text-emerald-400 flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Campaign created successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-semibold text-white mb-6">Campaign Details</h2>
            
            <div className="space-y-5">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Summer Sale 2024"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
              </div>

              {/* Segment Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Target Segment
                </label>
                <div className="space-y-3">
                  {segments.map((seg) => (
                    <button
                      key={seg.value}
                      onClick={() => setSegment(seg.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                        segment === seg.value
                          ? seg.color === "amber"
                            ? "border-amber-500/50 bg-amber-500/10"
                            : seg.color === "emerald"
                            ? "border-emerald-500/50 bg-emerald-500/10"
                            : "border-zinc-500/50 bg-zinc-500/10"
                          : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/30"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        segment === seg.value
                          ? seg.color === "amber"
                            ? "border-amber-500"
                            : seg.color === "emerald"
                            ? "border-emerald-500"
                            : "border-zinc-500"
                          : "border-zinc-600"
                      }`}>
                        {segment === seg.value && (
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            seg.color === "amber" ? "bg-amber-500" :
                            seg.color === "emerald" ? "bg-emerald-500" :
                            "bg-zinc-400"
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{seg.label}</p>
                        <p className="text-xs text-zinc-400">{seg.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Campaign Message
                </label>
                <textarea
                  placeholder="Write your campaign message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border text-sm bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  {message.length} characters
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="rounded-2xl border p-6 sticky top-8" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-semibold text-white mb-4">Campaign Preview</h2>
            
            <div className="space-y-4">
              {/* Preview Card */}
              <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">From: XENO CRM</p>
                    <p className="text-sm font-medium text-white truncate">
                      {campaignName || "Campaign Name"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500">To: {segments.find(s => s.value === segment)?.label}</p>
                  <p className="text-sm text-zinc-300 line-clamp-4">
                    {message || "Your campaign message will appear here..."}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3 bg-zinc-900/50">
                  <p className="text-xs text-zinc-400">Est. Recipients</p>
                  <p className="text-lg font-semibold text-white">
                    {segment === "VIP" ? "24" : segment === "Regular" ? "156" : "42"}
                  </p>
                </div>
                <div className="rounded-lg p-3 bg-zinc-900/50">
                  <p className="text-xs text-zinc-400">Est. Delivery</p>
                  <p className="text-lg font-semibold text-white">
                    {segment === "VIP" ? "92%" : segment === "Regular" ? "88%" : "75%"}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!campaignName.trim() || !message.trim() || isSubmitting}
                className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Creating Campaign...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Launch Campaign
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
