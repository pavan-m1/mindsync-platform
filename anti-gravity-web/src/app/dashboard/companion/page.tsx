"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Sparkles } from "lucide-react";

const PERSONALITIES = [
  { id: "Supportive Friend", emoji: "🤝", desc: "Empathetic and always there to listen." },
  { id: "Professional Therapist", emoji: "👨‍⚕️", desc: "Analytical, probing, and insightful." },
  { id: "Motivational Coach", emoji: "🚀", desc: "High energy, focused on action and goals." },
  { id: "Funny Buddy", emoji: "🤡", desc: "Uses humor to lighten the mood." },
  { id: "Spiritual Guide", emoji: "🧘", desc: "Calming, focuses on mindfulness and peace." }
];

export default function CompanionPage() {
  const [activePersona, setActivePersona] = useState(PERSONALITIES[0].id);
  const [messages, setMessages] = useState<{role: "user" | "assistant", content: string}[]>([
    { role: "assistant", content: `Hi there! I'm your ${PERSONALITIES[0].id}. How are you feeling today?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePersonaChange = (personaId: string) => {
    setActivePersona(personaId);
    setMessages([
      { role: "assistant", content: `Hi! I am now acting as your ${personaId}. What's on your mind?` }
    ]);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/companion/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, persona: activePersona }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Persona Selector Sidebar */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Companion</h1>
          <p className="text-sm text-slate-400">Choose who you want to talk to today.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
          {PERSONALITIES.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePersonaChange(p.id)}
              className={`w-full text-left p-4 rounded-xl transition-all ${activePersona === p.id ? 'glass-panel border-pink-500/50 bg-pink-500/10' : 'glass-panel hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <p className="font-semibold text-slate-200">{p.id}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 glass-panel flex flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-slate-900/50 flex items-center gap-3">
          <Sparkles className="text-pink-400" />
          <span className="font-semibold text-slate-200">Chatting with {activePersona}</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-pink-400" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl p-4 ${m.role === "user" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-200 border border-slate-700"}`}>
                <p className="text-sm leading-relaxed">{m.content}</p>
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-blue-400" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Bot size={16} className="text-pink-400" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="p-4 bg-slate-900/50 border-t border-white/10">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Say something to your ${activePersona}...`}
              className="w-full bg-slate-800 border border-slate-700 rounded-full pl-6 pr-12 py-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-2 p-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
