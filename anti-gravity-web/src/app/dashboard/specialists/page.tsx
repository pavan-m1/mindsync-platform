"use client";

import { useState } from "react";
import { HeartHandshake, MapPin, Star, Calendar, MessageCircle, X, CheckCircle } from "lucide-react";

const MOCK_SPECIALISTS = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    role: "Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "CBT"],
    rating: 4.9,
    reviews: 124,
    location: "New York, NY (Telehealth)",
    availability: "Available Tomorrow",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4",
  },
  {
    id: 2,
    name: "Mark Thompson, LCSW",
    role: "Licensed Clinical Social Worker",
    specialties: ["Stress Management", "Burnout", "Career"],
    rating: 4.8,
    reviews: 89,
    location: "San Francisco, CA (Telehealth)",
    availability: "Available This Week",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark&backgroundColor=c0aede",
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    role: "Psychiatrist",
    specialties: ["ADHD", "Mood Disorders", "Medication Management"],
    rating: 5.0,
    reviews: 210,
    location: "Chicago, IL (Telehealth)",
    availability: "Waitlist",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffdfbf",
  }
];

export default function SpecialistsPage() {
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "booking" | "success">("idle");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00 AM");
  const [reason, setReason] = useState("");

  const handleBook = (spec: any) => {
    setSelectedSpecialist(spec);
    setBookingStatus("idle");
    setDate("");
    setReason("");
  };

  const confirmBooking = async () => {
    if (!date) {
      alert("Please select a date.");
      return;
    }
    setBookingStatus("booking");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialistId: selectedSpecialist.id,
          specialistName: selectedSpecialist.name,
          date,
          time,
          reason
        }),
      });

      if (!res.ok) throw new Error("Failed to book");
      setBookingStatus("success");
    } catch (err) {
      console.error(err);
      setBookingStatus("idle");
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <HeartHandshake className="text-rose-400" />
            Specialist Network
          </h1>
          <p className="text-slate-400">Connect with licensed professionals tailored to your emotional journey.</p>
        </div>
        <div className="flex gap-2">
          <button className="glass-button px-4 py-2 rounded-full text-sm font-medium">
            Filter by Specialty
          </button>
          <button className="glass-button px-4 py-2 rounded-full text-sm font-medium">
            Telehealth Only
          </button>
        </div>
      </div>

      {/* Specialists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_SPECIALISTS.map((spec) => (
          <div key={spec.id} className="glass-panel p-6 flex flex-col sm:flex-row gap-6 hover:border-rose-500/30 transition-colors">
            
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center sm:items-start flex-shrink-0">
              <img src={spec.image} alt={spec.name} className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700" />
              <div className="flex items-center gap-1 mt-3 text-amber-400">
                <Star size={16} className="fill-amber-400" />
                <span className="font-bold">{spec.rating}</span>
                <span className="text-xs text-slate-500">({spec.reviews})</span>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{spec.name}</h3>
                <p className="text-rose-400 font-medium text-sm">{spec.role}</p>
                
                <div className="flex items-center gap-2 mt-2 text-slate-400 text-sm">
                  <MapPin size={14} />
                  <span>{spec.location}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {spec.specialties.map((tag, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleBook(spec)}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar size={16} />
                  Book Session
                </button>
                <button className="glass-button p-2 rounded-lg text-slate-300 hover:text-white" title="Send a Message">
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedSpecialist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedSpecialist(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            {bookingStatus === "success" ? (
              <div className="text-center space-y-4 py-6 text-white">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                <p className="text-slate-400">An email confirmation has been sent for your appointment with {selectedSpecialist.name}.</p>
                <button 
                  onClick={() => setSelectedSpecialist(null)}
                  className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Book an Appointment</h2>
                  <p className="text-sm text-slate-400">Select a time to speak with {selectedSpecialist.name}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">Time</label>
                    <select value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500">
                      <option>09:00 AM</option>
                      <option>10:30 AM</option>
                      <option>01:00 PM</option>
                      <option>03:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300">Reason for visit</label>
                    <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500 resize-none"></textarea>
                  </div>
                </div>

                <button 
                  onClick={confirmBooking}
                  disabled={bookingStatus === "booking"}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  {bookingStatus === "booking" ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
