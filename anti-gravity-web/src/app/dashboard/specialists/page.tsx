"use client";

import { HeartHandshake, MapPin, Star, Calendar, MessageCircle } from "lucide-react";

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
                <button className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
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

    </div>
  );
}
