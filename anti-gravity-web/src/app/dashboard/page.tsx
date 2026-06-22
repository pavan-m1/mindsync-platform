"use client";

import { useEffect, useState } from "react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import Link from "next/link";
import { Calendar, Smile, Send } from "lucide-react";

export default function DashboardOverview() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({ averageMood: "0.0", stressLevel: "Unknown", currentStreak: 0 });
  const [loading, setLoading] = useState(true);

  const [moodScore, setMoodScore] = useState(5);
  const [stressScore, setStressScore] = useState(5);
  const [logging, setLogging] = useState(false);

  const fetchOverview = async () => {
    try {
      const res = await fetch("/api/dashboard/overview");
      if (res.ok) {
        const json = await res.json();
        setData(json.chartData);
        setStats(json.stats);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleMoodSubmit = async () => {
    setLogging(true);
    try {
      const res = await fetch("/api/journal/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moodScore, stressScore }),
      });
      if (res.ok) {
        await fetchOverview(); // Refresh the chart with the real data
        alert("Mood logged successfully! Check your updated chart.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLogging(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading your insights...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back.</h1>
          <p className="text-slate-400 mt-2">Here is your wellness summary for this week.</p>
        </div>
        <Link href="/dashboard/specialists">
          <button className="glass-button flex items-center gap-2 px-6 py-3 rounded-xl font-bold">
            <Calendar className="w-5 h-5" />
            Book Appointment
          </button>
        </Link>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-t-4 border-t-blue-500 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Average Mood</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{stats.averageMood}</span>
            {stats.averageMood !== "0.0" && <span className="text-sm text-blue-400">All time</span>}
          </div>
        </div>
        <div className="glass-panel p-6 border-t-4 border-t-purple-500 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Stress Level</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{stats.stressLevel}</span>
          </div>
        </div>
        <div className="glass-panel p-6 border-t-4 border-t-teal-500 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Current Streak</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{stats.currentStreak} Days</span>
            <span className="text-sm text-teal-400">Keep it up!</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-panel p-6 border-slate-700/50 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          <h2 className="text-lg font-semibold text-white mb-6">Emotional Trends</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }} 
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
                <Area type="monotone" dataKey="stress" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorStress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Check-in Widget */}
        <div className="glass-panel p-6 border-slate-700/50 flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700">
          <div className="flex items-center gap-2 text-white">
            <Smile className="text-amber-400" />
            <h2 className="text-lg font-semibold">Quick Check-in</h2>
          </div>
          <p className="text-sm text-slate-400">Log your current mood to update your Emotional Trends chart.</p>
          
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Mood (1-10)</label>
              <div className="flex items-center gap-4">
                <input type="range" min="1" max="10" value={moodScore} onChange={(e) => setMoodScore(Number(e.target.value))} className="w-full accent-blue-500" />
                <span className="text-white font-bold w-6">{moodScore}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Stress (1-10)</label>
              <div className="flex items-center gap-4">
                <input type="range" min="1" max="10" value={stressScore} onChange={(e) => setStressScore(Number(e.target.value))} className="w-full accent-purple-500" />
                <span className="text-white font-bold w-6">{stressScore}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleMoodSubmit}
            disabled={logging}
            className="glass-button w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold mt-auto"
          >
            {logging ? "Saving..." : "Save Log"}
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
