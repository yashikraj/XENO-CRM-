"use client";

import { useEffect, useState } from "react";
import api from "../api";

const customerTypeStyles = {
  VIP: {
    bg: "bg-amber-500/15",
    border: "border-amber-500/40",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  Regular: {
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  Inactive: {
    bg: "bg-zinc-500/15",
    border: "border-zinc-500/40",
    text: "text-zinc-400",
    dot: "bg-zinc-400",
  },
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
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
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
  );

  const vipCount = customers.filter((c) => c.customer_type === "VIP").length;
  const regularCount = customers.filter((c) => c.customer_type === "Regular").length;
  const inactiveCount = customers.filter((c) => c.customer_type === "Inactive").length;

  const stats = [
    { label: "Total Customers", value: customers.length, color: "text-white" },
    { label: "VIP Customers", value: vipCount, color: "text-amber-400" },
    { label: "Regular Customers", value: regularCount, color: "text-emerald-400" },
    { label: "Inactive Customers", value: inactiveCount, color: "text-zinc-400" },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-zinc-800 rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-zinc-800/50 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Customers</h1>
          <p className="text-zinc-400 mt-1">
            Manage and view all your customer data
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl p-5 border card-hover"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <p className="text-sm text-zinc-400 font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
        <button className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
          Export
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Customer ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredCustomers.map((customer: any, index: number) => {
              const style = customerTypeStyles[customer.customer_type as keyof typeof customerTypeStyles] || customerTypeStyles.Regular;
              return (
                <tr
                  key={customer.customer_id}
                  className="hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-sm font-medium text-indigo-400">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500 font-mono">{customer.customer_id}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.border} ${style.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {customer.customer_type}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <svg className="w-12 h-12 mx-auto text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-zinc-400 font-medium">No customers found</p>
            <p className="text-zinc-600 text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
