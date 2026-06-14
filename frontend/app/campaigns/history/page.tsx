"use client";

import { useCampaigns } from "../../lib/campaigns";
import Link from "next/link";

export default function CampaignHistoryPage() {
  const { campaigns } = useCampaigns();

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Campaign History</h1>
          <p className="text-zinc-400 mt-1">View all your marketing campaigns</p>
        </div>
        <Link href="/campaigns">
          <button className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}>
            Create New Campaign
          </button>
        </Link>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--border)" }}>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Campaign Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Segment</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-zinc-400">
                    <svg className="w-12 h-12 mx-auto mb-3 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    <p className="font-medium">No campaigns yet</p>
                    <p className="text-sm mt-1">Create your first campaign to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{campaign.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
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
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {new Date(campaign.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(campaign.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(campaign.status)} animate-pulse`} />
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/campaigns/${campaign.id}`}>
                      <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
