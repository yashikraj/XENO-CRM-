"use client";

import { useParams } from "next/navigation";
import { useCampaigns } from "../../lib/campaigns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function CampaignDetailsPage() {
  const params = useParams();
  const { getCampaignById } = useCampaigns();
  const campaign = getCampaignById(params.id as string);

  if (!campaign) {
    return (
      <div className="p-8">
        <div
          className="rounded-2xl border p-12 text-center"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <svg
            className="w-16 h-16 mx-auto mb-4 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">Campaign Not Found</h2>
          <p className="text-zinc-400">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const metricsData = [
    { name: "Sent", value: campaign.metrics.sent, fill: "#6366f1" },
    { name: "Delivered", value: campaign.metrics.delivered, fill: "#22c55e" },
    { name: "Opened", value: campaign.metrics.opened, fill: "#3b82f6" },
    { name: "Clicked", value: campaign.metrics.clicked, fill: "#f59e0b" },
    { name: "Failed", value: campaign.metrics.failed, fill: "#ef4444" },
  ];

  const deliveryRate = campaign.metrics.sent
    ? ((campaign.metrics.delivered / campaign.metrics.sent) * 100).toFixed(1)
    : "0";
  const openRate = campaign.metrics.delivered
    ? ((campaign.metrics.opened / campaign.metrics.delivered) * 100).toFixed(1)
    : "0";
  const clickRate = campaign.metrics.opened
    ? ((campaign.metrics.clicked / campaign.metrics.opened) * 100).toFixed(1)
    : "0";

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-zinc-500/15 border-zinc-500/40 text-zinc-400";
      case "scheduled":
        return "bg-amber-500/15 border-amber-500/40 text-amber-400";
      case "completed":
        return "bg-emerald-500/15 border-emerald-500/40 text-emerald-400";
      default:
        return "bg-zinc-500/15 border-zinc-500/40 text-zinc-400";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-zinc-400";
      case "scheduled":
        return "bg-amber-400";
      case "completed":
        return "bg-emerald-400";
      default:
        return "bg-zinc-400";
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{campaign.name}</h1>
        <p className="text-zinc-400 mt-1">
          Created on {new Date(campaign.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="relative overflow-hidden rounded-2xl p-5 border"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <p className="text-sm text-zinc-400 font-medium">Total Sent</p>
          <p className="text-2xl font-bold text-white">{campaign.metrics.sent.toLocaleString()}</p>
        </div>
        <div
          className="relative overflow-hidden rounded-2xl p-5 border"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <p className="text-sm text-zinc-400 font-medium">Delivery Rate</p>
          <p className="text-2xl font-bold text-emerald-400">{deliveryRate}%</p>
        </div>
        <div
          className="relative overflow-hidden rounded-2xl p-5 border"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <p className="text-sm text-zinc-400 font-medium">Open Rate</p>
          <p className="text-2xl font-bold text-blue-400">{openRate}%</p>
        </div>
        <div
          className="relative overflow-hidden rounded-2xl p-5 border"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <p className="text-sm text-zinc-400 font-medium">Click Rate</p>
          <p className="text-2xl font-bold text-amber-400">{clickRate}%</p>
        </div>
      </div>

      {campaign.campaignStrategy && (
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Campaign Strategy
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 rounded-xl p-4">
                <h4 className="font-semibold text-indigo-400 mb-1">Campaign Goal</h4>
                <p className="text-zinc-300">{campaign.campaignStrategy.campaign_goal}</p>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-4">
                <h4 className="font-semibold text-purple-400 mb-1">Target Segment</h4>
                <p className="text-zinc-300">{campaign.campaignStrategy.target_segment}</p>
              </div>
              <div className="bg-zinc-900/50 rounded-xl p-4">
                <h4 className="font-semibold text-amber-400 mb-1">Customers Found</h4>
                <p className="text-zinc-300">{campaign.campaignStrategy.customers_found}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-teal-400 mb-1">Reasoning</h4>
              <p className="text-zinc-300">{campaign.campaignStrategy.reasoning}</p>
            </div>
          </div>
        </div>
      )}

      {campaign.campaignContent && (
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Content
          </h3>
          <div className="space-y-4">
            <div className="bg-zinc-900/50 rounded-xl p-4">
              <h4 className="font-semibold text-indigo-400 mb-1">Subject Line</h4>
              <p className="text-zinc-300">{campaign.campaignContent.email_subject}</p>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4">
              <h4 className="font-semibold text-purple-400 mb-1">Email Message</h4>
              <p className="text-zinc-300 whitespace-pre-line">{campaign.campaignContent.email_message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Campaign Info</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Segment</label>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mt-1 ${
                  campaign.segment === "VIP"
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                    : campaign.segment === "Regular"
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-zinc-500/15 border-zinc-500/40 text-zinc-400"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    campaign.segment === "VIP"
                      ? "bg-amber-400"
                      : campaign.segment === "Regular"
                      ? "bg-emerald-400"
                      : "bg-zinc-400"
                  }`}
                />
                {campaign.segment}
              </span>
            </div>
            <div>
              <label className="text-sm text-zinc-400">Status</label>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(campaign.status)} mt-1`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(campaign.status)} animate-pulse`} />
                {campaign.status}
              </span>
            </div>
            <div>
              <label className="text-sm text-zinc-400">Message</label>
              <div
                className="mt-2 p-4 rounded-xl"
                style={{ backgroundColor: "var(--background)" }}
              >
                <p className="text-sm text-white whitespace-pre-line">{campaign.message}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Campaign Funnel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  horizontal={false}
                />
                <XAxis type="number" stroke="#71717a" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#71717a"
                  fontSize={12}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181f",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#f4f4f5",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {metricsData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="p-6 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h3 className="text-lg font-semibold text-white">Detailed Metrics</h3>
        </div>
        <div className="divide-y divide-zinc-800">
          {[
            {
              label: "Total Emails Sent",
              value: campaign.metrics.sent,
              color: "text-indigo-400",
            },
            {
              label: "Successfully Delivered",
              value: campaign.metrics.delivered,
              color: "text-emerald-400",
            },
            {
              label: "Emails Opened",
              value: campaign.metrics.opened,
              color: "text-blue-400",
            },
            {
              label: "Links Clicked",
              value: campaign.metrics.clicked,
              color: "text-amber-400",
            },
            {
              label: "Failed Deliveries",
              value: campaign.metrics.failed,
              color: "text-red-400",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-6 py-4"
            >
              <span className="text-sm text-zinc-400">{item.label}</span>
              <div className="flex items-center gap-4">
                <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color.replace("text-", "bg-")} rounded-full`}
                    style={{
                      width: `${
                        campaign.metrics.sent > 0
                          ? (item.value / campaign.metrics.sent) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span
                  className={`text-sm font-semibold ${item.color} w-12 text-right`}
                >
                  {item.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
