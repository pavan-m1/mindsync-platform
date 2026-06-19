"use client";

import { useState, useEffect } from "react";
import { Wind, CircleDashed } from "lucide-react";

export default function TherapeuticToolsPage() {
  const [breathingPhase, setBreathingPhase] = useState<"idle" | "inhale" | "hold" | "exhale">("idle");
  const [bubbles, setBubbles] = useState(Array.from({ length: 48 }, (_, i) => ({ id: i, popped: false })));

  // Breathing Logic (4-7-8 method)
  useEffect(() => {
    if (breathingPhase === "idle") return;

    let timeout: NodeJS.Timeout;
    
    if (breathingPhase === "inhale") {
      timeout = setTimeout(() => setBreathingPhase("hold"), 4000); // Inhale 4s
    } else if (breathingPhase === "hold") {
      timeout = setTimeout(() => setBreathingPhase("exhale"), 7000); // Hold 7s
    } else if (breathingPhase === "exhale") {
      timeout = setTimeout(() => setBreathingPhase("inhale"), 8000); // Exhale 8s
    }

    return () => clearTimeout(timeout);
  }, [breathingPhase]);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    // Could add a small sound effect here
  };

  const resetBubbles = () => {
    setBubbles(Array.from({ length: 48 }, (_, i) => ({ id: i, popped: false })));
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Therapeutic Tools</h1>
        <p className="text-slate-400">Interactive exercises to center your mind and relieve stress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Breathing Circle Tool */}
        <div className="glass-panel p-8 flex flex-col items-center text-center space-y-8 h-[450px]">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-center">
              <Wind className="text-teal-400" /> 4-7-8 Breathing
            </h2>
            <p className="text-sm text-slate-400 mt-2">Relaxes the nervous system</p>
          </div>

          <div className="flex-1 flex flex-col justify-center relative w-full items-center">
            {/* Animated Circle */}
            <div className={`relative flex items-center justify-center rounded-full transition-all ease-in-out border border-teal-500/30 bg-teal-500/5
              ${breathingPhase === 'idle' ? 'w-32 h-32 duration-500' : ''}
              ${breathingPhase === 'inhale' ? 'w-56 h-56 duration-[4000ms] shadow-[0_0_40px_rgba(45,212,191,0.2)]' : ''}
              ${breathingPhase === 'hold' ? 'w-56 h-56 duration-[7000ms] border-teal-400 shadow-[0_0_60px_rgba(45,212,191,0.4)]' : ''}
              ${breathingPhase === 'exhale' ? 'w-32 h-32 duration-[8000ms]' : ''}
            `}>
              <CircleDashed className={`absolute inset-0 w-full h-full text-teal-500/20 ${breathingPhase !== 'idle' ? 'animate-[spin_10s_linear_infinite]' : ''}`} />
              
              <span className="text-xl font-bold text-teal-300 z-10 transition-opacity">
                {breathingPhase === 'idle' && "Ready"}
                {breathingPhase === 'inhale' && "Inhale (4s)"}
                {breathingPhase === 'hold' && "Hold (7s)"}
                {breathingPhase === 'exhale' && "Exhale (8s)"}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setBreathingPhase(prev => prev === "idle" ? "inhale" : "idle")}
            className="glass-button px-6 py-2 rounded-full font-medium"
          >
            {breathingPhase === "idle" ? "Start Exercise" : "Stop"}
          </button>
        </div>

        {/* Bubble Pop Therapy */}
        <div className="glass-panel p-8 flex flex-col items-center text-center space-y-6 h-[450px]">
          <div className="w-full flex justify-between items-center">
            <div className="text-left">
              <h2 className="text-xl font-bold text-white">Bubble Pop Therapy</h2>
              <p className="text-sm text-slate-400">Pop the bubbles to relieve tension</p>
            </div>
            <button onClick={resetBubbles} className="text-sm text-blue-400 hover:text-blue-300">Reset</button>
          </div>

          <div className="flex-1 w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex items-center justify-center">
            <div className="grid grid-cols-8 gap-2 w-full max-w-sm mx-auto">
              {bubbles.map(bubble => (
                <button
                  key={bubble.id}
                  onClick={() => popBubble(bubble.id)}
                  disabled={bubble.popped}
                  className={`w-full aspect-square rounded-full transition-all duration-300 shadow-sm
                    ${bubble.popped 
                      ? 'bg-slate-700/20 scale-50 opacity-20' 
                      : 'bg-gradient-to-br from-blue-400/80 to-purple-500/80 hover:scale-110 active:scale-90 cursor-pointer shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.4),2px_2px_4px_rgba(255,255,255,0.1)]'
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
