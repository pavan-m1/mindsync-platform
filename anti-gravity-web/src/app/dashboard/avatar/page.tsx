"use client";

import { useState } from "react";
import { Smile, Frown, Meh, Angry, MessageCircle, Heart, Sparkles, Brain } from "lucide-react";

type Mood = "Happy" | "Neutral" | "Sad" | "Stressed";

export default function MoodAvatarPage() {
  const [currentMood, setCurrentMood] = useState<Mood>("Happy");

  // Avatar representations for each mood
  const avatarDetails = {
    Happy: {
      emoji: "😊",
      color: "bg-amber-400 text-amber-900",
      glow: "shadow-amber-500/50",
      message: "I'm so glad to see you feeling great today! Let's carry this energy forward.",
      icon: <Smile className="w-5 h-5" />
    },
    Neutral: {
      emoji: "😐",
      color: "bg-slate-400 text-slate-900",
      glow: "shadow-slate-500/30",
      message: "Just a regular day. I'm here for you whenever you need to chat or reflect.",
      icon: <Meh className="w-5 h-5" />
    },
    Sad: {
      emoji: "😔",
      color: "bg-blue-400 text-blue-900",
      glow: "shadow-blue-500/50",
      message: "I'm sorry you're feeling down. Take all the time you need. I'm right here with you.",
      icon: <Frown className="w-5 h-5" />
    },
    Stressed: {
      emoji: "😣",
      color: "bg-rose-400 text-rose-900",
      glow: "shadow-rose-500/50",
      message: "Take a deep breath. Things might feel overwhelming, but we'll get through it together.",
      icon: <Angry className="w-5 h-5" />
    }
  };

  const activeDetails = avatarDetails[currentMood];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Sparkles className="text-amber-400" />
          Mood Avatar
        </h1>
        <p className="text-slate-400">Your virtual companion that reflects your current emotional state.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Main Avatar Display */}
        <div className="md:col-span-2 glass-panel p-8 md:p-16 flex flex-col items-center justify-center space-y-8 relative overflow-hidden text-center min-h-[400px]">
          {/* Dynamic Background Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-3xl opacity-20 rounded-full transition-all duration-1000 ${activeDetails.color}`} />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* The Avatar */}
            <div 
              className={`w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center text-7xl md:text-9xl shadow-2xl transition-all duration-500 ease-spring hover:scale-105 animate-float ${activeDetails.color} ${activeDetails.glow}`}
            >
              {activeDetails.emoji}
            </div>

            {/* Companion Message */}
            <div className="mt-8 max-w-md">
              <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-xl relative inline-block text-left">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-800 border-l border-t border-slate-700 transform rotate-45" />
                <p className="relative z-10 text-slate-200 text-lg font-medium leading-relaxed">
                  "{activeDetails.message}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              How are you feeling?
            </h3>
            <p className="text-sm text-slate-400">Select a mood below to see your companion react instantly.</p>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              {(Object.keys(avatarDetails) as Mood[]).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    currentMood === mood
                      ? "bg-white text-slate-900 shadow-lg scale-105"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  {avatarDetails[mood].icon}
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              Why this matters
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Having a virtual companion mirror your emotions creates a sense of empathy and validation, making your mental wellness journey feel more human and connected.
            </p>
          </div>
          
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/25">
            <MessageCircle className="w-5 h-5" />
            Chat with Companion
          </button>
        </div>

      </div>

    </div>
  );
}
