"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, HeartHandshake, MapPin, Loader2, FileText, CheckCircle2 } from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return (
    <div className="flex h-64 items-center justify-center text-rose-400 space-x-3">
      <Loader2 className="w-8 h-8 animate-spin" />
      <span className="text-xl font-medium">Loading appointments...</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <CalendarIcon className="text-rose-400" />
            My Appointments
          </h1>
          <p className="text-slate-400">View and manage your upcoming and past specialist sessions.</p>
        </div>
        <button className="glass-button px-4 py-2 rounded-full text-sm font-medium">
          History & Invoices
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="glass-panel p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center">
            <HeartHandshake className="w-10 h-10 text-rose-400 opacity-50" />
          </div>
          <h2 className="text-xl font-bold text-white">No Appointments Yet</h2>
          <p className="text-slate-400 max-w-sm">You haven't booked any sessions. Explore our Specialist Network to find the right professional for you.</p>
          <a href="/dashboard/specialists" className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors mt-4 inline-block">
            Find a Specialist
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((apt) => (
            <div key={apt.id} className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-rose-500/30 transition-all">
              {/* Status Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 size={14} />
                {apt.status}
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-orange-400 flex flex-col items-center justify-center text-white shadow-lg shadow-rose-500/20">
                  <span className="text-sm font-black uppercase">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-xl font-bold leading-none">{new Date(apt.date).getDate()}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{apt.specialistName}</h3>
                  <p className="text-rose-400 text-sm font-medium flex items-center gap-1">
                    <HeartHandshake size={14} />
                    Telehealth Session
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Time</span>
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <Clock size={16} className="text-slate-400" />
                    {apt.time}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Location</span>
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <MapPin size={16} className="text-slate-400" />
                    Video Call
                  </div>
                </div>
              </div>

              {apt.reason && (
                <div className="mt-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <FileText size={12} /> Notes
                  </span>
                  <p className="text-sm text-slate-300 italic">"{apt.reason}"</p>
                </div>
              )}

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                  Reschedule
                </button>
                <button className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                  Join Call
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
