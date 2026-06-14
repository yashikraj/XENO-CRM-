"use client";

import { useEffect, useState } from "react";
import api from "./api";

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!data) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-zinc-800 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 bg-zinc-800/50 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Customers",
      value: data.total_customers,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-indigo-500/20 to-purple-500/20",
      iconColor: "text-indigo-400",
    },
    {
      label: "Active Customers",
      value: data.active_customers,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      ),
      gradient: "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-400",
    },
    {
      label: "Total Revenue",
      value: `₹${Number(data.total_revenue).toLocaleString("en-IN")}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-400",
    },
  ];

  const quickActions = [
    {
      label: "Create Campaign",
      description: "Launch a new marketing campaign",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      href: "/campaigns",
      color: "bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20",
    },
    {
      label: "View Segments",
      description: "Browse customer segments",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      href: "/segments",
      color: "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20",
    },
    {
      label: "Analytics",
      description: "View campaign performance",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: "/analytics",
      color: "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-zinc-400 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your CRM.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            System Online
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl p-6 card-hover gradient-border"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className={`${stat.iconColor}`}>{stat.icon}</span>
                <span className="text-xs text-zinc-500 font-medium">
                  {index === 0 ? "All Time" : index === 1 ? "This Month" : "Revenue"}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white tracking-tight">
                {stat.value}
              </p>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-2xl" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${action.color}`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{action.label}</p>
                <p className="text-xs text-zinc-500">{action.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-sm text-zinc-300">VIP Customers</span>
              </div>
              <span className="text-sm font-medium text-white">
                {data.vip_customers || 0}
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(((data.vip_customers || 0) / data.total_customers) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-sm text-zinc-300">Active Customers</span>
              </div>
              <span className="text-sm font-medium text-white">
                {data.active_customers}
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-green-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((data.active_customers / data.total_customers) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { event: "New VIP customer added", time: "2 minutes ago", type: "success" },
              { event: "Campaign 'Summer Sale' sent", time: "15 minutes ago", type: "info" },
              { event: "Segment 'Inactive' updated", time: "1 hour ago", type: "warning" },
              { event: "New customer registered", time: "2 hours ago", type: "success" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  item.type === "success" ? "bg-emerald-400" :
                  item.type === "info" ? "bg-blue-400" :
                  "bg-amber-400"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300 truncate">{item.event}</p>
                  <p className="text-xs text-zinc-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
