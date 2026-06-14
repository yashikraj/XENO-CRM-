"use client";

import { useState, useRef, useEffect } from "react";
import api from "../api";
import { useCampaigns, AIRecommendation } from "../lib/campaigns";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  data?: AIRecommendation;
}

export default function AICopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I'm your AI Marketing Copilot. How can I help you today?\n\nTry asking things like:\n- Find inactive customers\n- Show VIP customers\n- Suggest a campaign for inactive customers",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addCampaign } = useCampaigns();
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.post("/ai/query", { query: input });
      const aiData = response.data;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "",
        data: aiData,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending query", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Sorry, I encountered an error. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = (aiData: AIRecommendation) => {
    const campaignName = aiData.strategy.campaign_name;
    const segment = aiData.strategy.target_segment.includes("VIP") 
      ? "VIP" 
      : aiData.strategy.target_segment.includes("Regular") 
      ? "Regular" 
      : "All";

    addCampaign({
      name: campaignName,
      segment: segment,
      message: aiData.content.email_message,
      emailSubject: aiData.content.email_subject,
      emailMessage: aiData.content.email_message,
      aiRecommendation: aiData,
      campaignStrategy: aiData.strategy,
      campaignContent: aiData.content,
    });

    setNotification("Campaign created successfully!");
    setTimeout(() => {
      setNotification(null);
      router.push("/campaigns/history");
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">{notification}</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Marketing Copilot</h1>
        <p className="text-zinc-400">Get AI-powered insights and recommendations for your marketing campaigns</p>
      </div>

      <div className="rounded-2xl border border-zinc-800 overflow-hidden" style={{ backgroundColor: "var(--card)" }}>
        {/* Chat Messages */}
        <div className="p-6 h-[500px] overflow-y-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                    : "bg-gradient-to-br from-emerald-500 to-teal-600"
                }`}
              >
                {msg.role === "user" ? (
                  <span className="text-white font-semibold">A</span>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                    : "bg-zinc-800 text-zinc-100"
                }`}
              >
                {msg.content && <p className="whitespace-pre-line">{msg.content}</p>}
                {msg.data && (
                  <div className="space-y-4 mt-2">
                    <div>
                      <h4 className="font-semibold text-emerald-400 mb-1">Summary</h4>
                      <p>{msg.data.summary}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-zinc-900/50 rounded-xl p-4">
                        <h4 className="font-semibold text-indigo-400 mb-1">Campaign Name</h4>
                        <p>{msg.data.strategy.campaign_name}</p>
                      </div>
                      <div className="bg-zinc-900/50 rounded-xl p-4">
                        <h4 className="font-semibold text-purple-400 mb-1">Target Segment</h4>
                        <p>{msg.data.strategy.target_segment}</p>
                      </div>
                      <div className="bg-zinc-900/50 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-400 mb-1">Campaign Goal</h4>
                        <p>{msg.data.strategy.campaign_goal}</p>
                      </div>
                      <div className="bg-zinc-900/50 rounded-xl p-4">
                        <h4 className="font-semibold text-amber-400 mb-1">Customers Found</h4>
                        <p>{msg.data.strategy.customers_found}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-teal-400 mb-1">Email Subject</h4>
                      <p>{msg.data.content.email_subject}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-400 mb-1">Email Message</h4>
                      <p className="whitespace-pre-line">{msg.data.content.email_message}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-400 mb-1">Reasoning</h4>
                      <p>{msg.data.strategy.reasoning}</p>
                    </div>
                    <button
                      onClick={() => handleCreateCampaign(msg.data!)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Campaign
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="bg-zinc-800 rounded-2xl px-5 py-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-zinc-800">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI Copilot..."
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
