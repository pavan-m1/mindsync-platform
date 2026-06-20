"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, AlertCircle } from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for the demonstration since we don't have historical mood data right away
  useEffect(() => {
    setTimeout(() => {
      setData([
        { date: "Mon", mood: 6, stress: 5 },
        { date: "Tue", mood: 7, stress: 4 },
        { date: "Wed", mood: 4, stress: 8 },
        { date: "Thu", mood: 5, stress: 7 },
        { date: "Fri", mood: 8, stress: 3 },
        { date: "Sat", mood: 9, stress: 2 },
        { date: "Sun", mood: 8, stress: 4 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Emotional Journey</h1>
        <p className="text-slate-400">Track your mood patterns and predict potential stress triggers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 rounded-2xl">
            <TrendingUp className="text-emerald-400 w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Weekly Average</p>
            <p className="text-2xl font-bold text-white">7.2 <span className="text-sm text-emerald-400">/ 10</span></p>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 bg-rose-500/20 rounded-2xl">
            <AlertCircle className="text-rose-400 w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Stress Prediction</p>
            <p className="text-2xl font-bold text-white">Moderate</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 bg-blue-500/20 rounded-2xl">
            <Calendar className="text-blue-400 w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Days Tracked</p>
            <p className="text-2xl font-bold text-white">14</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8 h-[400px] flex flex-col">
        <h3 className="text-xl font-semibold text-white mb-6">Mood vs Stress Tracker</h3>
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 animate-pulse">
            Loading analytics...
          </div>
        ) : (
          <div className="flex-1 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="mood" name="Mood Score" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="stress" name="Stress Level" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
