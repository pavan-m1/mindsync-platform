"use client";

import { useState, useEffect } from "react";
import { Sparkles, Save, BookOpen } from "lucide-react";

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/journal");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setContent("");
        fetchEntries();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Editor Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="text-amber-400" />
            AI Journal
          </h1>
          <p className="text-slate-400">Pour your thoughts out. The AI will summarize and find patterns.</p>
        </div>

        <div className="glass-panel p-6 flex flex-col h-[500px]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today?"
            className="flex-1 bg-transparent border-none resize-none text-slate-200 placeholder:text-slate-600 focus:ring-0 text-lg custom-scrollbar"
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
            <div className="text-sm text-slate-500">
              {content.length} characters
            </div>
            <button
              onClick={handleSave}
              disabled={saving || !content.trim()}
              className="glass-button px-6 py-2 rounded-full font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Saving & Analyzing..." : "Save Entry"}
            </button>
          </div>
        </div>
      </div>

      {/* History & AI Summary Section */}
      <div className="space-y-6 lg:mt-16">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Sparkles className="text-amber-400 w-5 h-5" />
          Recent Insights
        </h2>

        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
          {loading ? (
            <p className="text-slate-500 text-sm">Loading history...</p>
          ) : entries.length === 0 ? (
            <p className="text-slate-500 text-sm">No journal entries yet. Start writing to see AI insights!</p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="glass-panel p-4 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                  <span>{new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm text-slate-300 line-clamp-3">{entry.content}</p>
                {entry.aiSummary && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex gap-3">
                    <Sparkles className="text-amber-400 w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-200">{entry.aiSummary}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
