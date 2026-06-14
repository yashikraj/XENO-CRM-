"use client";

import Link from "next/link";
import { useCampaigns } from "../lib/campaigns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = {
  sent: "#6366f1",
  delivered: "#22c55e",
  opened: "#3b82f6",
  clicked: "#f59e0b",
  failed: "#ef4444",
};

export default function AnalyticsPage() {
  const { campaigns } = useCampaigns();

  // Calculate totals
  const totalStats = campaigns.reduce(
    (acc, c) => {
      acc.sent += c.metrics.sent;
      acc.delivered += c.metrics.delivered;
      acc.opened += c.metrics.opened;
      acc.clicked += c.metrics.clicked;
      acc.failed += c.metrics.failed;
      return acc;
    },
    { sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0 }
  );

  // Calculate rates
  const deliveryRate = totalStats.sent > 0 ? ((totalStats.delivered / totalStats.sent) * 100).toFixed(1) : "0";
  const openRate = totalStats.delivered > 0 ? ((totalStats.opened / totalStats.delivered) * 100).toFixed(1) : "0";
  const clickRate = totalStats.opened > 0 ? ((totalStats.clicked / totalStats.opened) * 100).toFixed(1) : "0";

  const allMetrics = [
    {
      label: "Total Campaigns",
      value: campaigns.length,
      color: "indigo",
      bgGradient: "from-indigo-500/20 to-purple-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    },
    {
      label: "Total Sent",
      value: totalStats.sent.toLocaleString(),
      color: "indigo",
      bgGradient: "from-indigo-500/20 to-indigo-600/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
    },
    {
      label: "Total Delivered",
      value: totalStats.delivered.toLocaleString(),
      color: "emerald",
      bgGradient: "from-emerald-500/20 to-green-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      label: "Total Opened",
      value: totalStats.opened.toLocaleString(),
      color: "blue",
      bgGradient: "from-blue-500/20 to-indigo-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      label: "Total Clicked",
      value: totalStats.clicked.toLocaleString(),
      color: "amber",
      bgGradient: "from-amber-500/20 to-orange-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
    },
    {
      label: "Delivery Rate",
      value: `${deliveryRate}%`,
      color: "emerald",
      bgGradient: "from-emerald-500/20 to-green-600/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Open Rate",
      value: `${openRate}%`,
      color: "blue",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Click Rate",
      value: `${clickRate}%`,
      color: "amber",
      bgGradient: "from-amber-500/20 to-yellow-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  // Pie chart data (Delivered vs Failed)
  const deliveryPieData = [
    { name: "Delivered", value: totalStats.delivered, color: COLORS.delivered },
    { name: "Failed", value: totalStats.failed, color: COLORS.failed },
  ].filter((d) => d.value > 0);

  // Campaign bar chart data
  const campaignBarData = campaigns.map((c, i) => ({
    name: c.name.length > 20 ? c.name.substring(0, 17) + "..." : c.name,
    sent: c.metrics.sent,
    delivered: c.metrics.delivered,
    opened: c.metrics.opened,
    clicked: c.metrics.clicked,
  }));

  // Campaign line chart data over time
  const campaignLineData = campaigns.map((c) => ({
    name: new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    sent: c.metrics.sent,
    delivered: c.metrics.delivered,
    opened: c.metrics.opened,
  }));

  // Empty state
  if (campaigns.length === 0) {
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
            className="w-20 h-20 mx-auto mb-6 text-zinc-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-3">No Campaigns Yet</h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Start by creating your first campaign to see analytics and performance metrics here.
          </p>
          <Link href="/campaigns">
            <button
              className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
            >
              Create Your First Campaign
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Campaign Analytics</h1>
          <p className="text-zinc-400 mt-1">
            Track and analyze your campaign performance across {campaigns.length} campaigns
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {allMetrics.map((metric, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl p-5 border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-50`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-${metric.color}-400`}>{metric.icon}</span>
              </div>
              <p className="text-sm text-zinc-400 font-medium">{metric.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Campaign vs Metrics */}
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Campaign Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181f",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#f4f4f5",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }} />
                <Bar dataKey="sent" fill={COLORS.sent} radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivered" fill={COLORS.delivered} radius={[4, 4, 0, 0]} />
                <Bar dataKey="opened" fill={COLORS.opened} radius={[4, 4, 0, 0]} />
                <Bar dataKey="clicked" fill={COLORS.clicked} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Delivered vs Failed */}
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Delivery Status</h3>
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deliveryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181f",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#f4f4f5",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-4">
              {deliveryPieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-zinc-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Line Chart: Performance Trend Over Time */}
        <div
          className="rounded-2xl border p-6 lg:col-span-2"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Performance Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={campaignLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181f",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#f4f4f5",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#a1a1aa" }} />
                <Line type="monotone" dataKey="sent" stroke={COLORS.sent} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="delivered" stroke={COLORS.delivered} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="opened" stroke={COLORS.opened} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Campaign Summary */}
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
          <h3 className="text-lg font-semibold text-white">Overall Campaign Summary</h3>
        </div>
        <div className="divide-y divide-zinc-800">
          {[
            { label: "Total Emails Sent", value: totalStats.sent, color: "text-indigo-400" },
            { label: "Successfully Delivered", value: totalStats.delivered, color: "text-emerald-400" },
            { label: "Emails Opened", value: totalStats.opened, color: "text-blue-400" },
            { label: "Links Clicked", value: totalStats.clicked, color: "text-amber-400" },
            { label: "Failed Deliveries", value: totalStats.failed, color: "text-red-400" },
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
                      width: `${totalStats.sent > 0 ? (item.value / totalStats.sent) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span
                  className={`text-sm font-semibold ${item.color} w-16 text-right`}
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
