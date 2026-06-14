"use client";

import { useEffect, useState } from "react";
import api from "../api";

export default function SegmentsPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [segment, setSegment] = useState("VIP");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/customers")
      .then((res: any) => {
        setCustomers(res.data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const filteredCustomers = customers.filter(
    (customer) => customer.customer_type === segment
  );

  const segmentInfo = {
    VIP: {
      title: "VIP Customers",
      description: "High-value customers with premium benefits",
      color: "amber",
      bgGradient: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30",
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    Regular: {
      title: "Regular Customers",
      description: "Standard customers with regular engagement",
      color: "emerald",
      bgGradient: "from-emerald-500/20 to-green-500/20",
      borderColor: "border-emerald-500/30",
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    Inactive: {
      title: "Inactive Customers",
      description: "Customers who haven't engaged recently",
      color: "zinc",
      bgGradient: "from-zinc-500/20 to-zinc-600/20",
      borderColor: "border-zinc-500/30",
      icon: (
        <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const currentSegment = segmentInfo[segment as keyof typeof segmentInfo];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-zinc-800 rounded-lg" />
          <div className="h-48 bg-zinc-800/50 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Customer Segments</h1>
        <p className="text-zinc-400 mt-1">
          View and manage your customer segments
        </p>
      </div>

      {/* Segment Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(segmentInfo).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setSegment(key)}
            className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 text-left ${
              segment === key
                ? `${info.borderColor} shadow-lg`
                : "border-zinc-800 hover:border-zinc-700"
            }`}
            style={{ backgroundColor: segment === key ? 'var(--card)' : 'var(--background)' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${info.bgGradient} opacity-0 transition-opacity duration-300 ${segment === key ? 'opacity-100' : ''}`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${segment === key ? 'bg-zinc-800' : 'bg-zinc-800/50'}`}>
                  {info.icon}
                </div>
                {segment === key && (
                  <span className="text-xs font-medium text-white px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-white">{info.title}</p>
              <p className="text-xs text-zinc-400 mt-1">{info.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Segment Details */}
      <div className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${currentSegment.bgGradient}`}>
              {currentSegment.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{currentSegment.title}</h2>
              <p className="text-sm text-zinc-400">{currentSegment.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-400">Segment Size</p>
            <p className="text-3xl font-bold text-white">{filteredCustomers.length}</p>
          </div>
        </div>

        {/* Customer Table */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Customer ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.customer_id}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-xs font-medium text-indigo-400">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-400">{customer.email}</td>
                  <td className="px-4 py-3 text-sm text-zinc-500 font-mono">{customer.customer_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
