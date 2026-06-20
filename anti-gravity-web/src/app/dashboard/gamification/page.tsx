"use client";

import { useEffect, useState } from "react";
import { Flame, Trophy, Star, ShieldCheck, Crown, Medal } from "lucide-react";

export default function GamificationPage() {
  const [gameState, setGameState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [message, setMessage] = useState("");

  const fetchGameState = async () => {
    try {
      const res = await fetch("/api/gamification/check-in");
      if (res.ok) {
        const data = await res.json();
        setGameState(data.gameState);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameState();
  }, []);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setMessage("");
    try {
      const res = await fetch("/api/gamification/check-in", { method: "POST" });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setGameState(data.gameState);
      }
    } catch (err) {
      setMessage("Failed to check in.");
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading your achievements...</div>;

  const xpProgress = gameState ? (gameState.xp % 500) / 500 * 100 : 0;

  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [breathState, setBreathState] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");

  useEffect(() => {
    if (activeGame === "breathing") {
      const cycle = () => {
        setBreathState("Inhale");
        setTimeout(() => {
          setBreathState("Hold");
          setTimeout(() => {
            setBreathState("Exhale");
          }, 7000); // Hold for 7s
        }, 4000); // Inhale for 4s
      };
      cycle();
      const interval = setInterval(cycle, 19000); // 4 + 7 + 8 = 19s total cycle
      return () => clearInterval(interval);
    }
  }, [activeGame]);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Gamification Hub</h1>
        <p className="text-slate-400">Track your progress, build habits, and earn wellness badges.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Streak Card */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
          <Flame className={`w-16 h-16 ${gameState?.currentStreak > 0 ? "text-orange-500 animate-pulse" : "text-slate-600"}`} />
          <div className="text-center">
            <h3 className="text-4xl font-black text-white">{gameState?.currentStreak || 0}</h3>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-1">Day Streak</p>
          </div>
          <button 
            onClick={handleCheckIn}
            disabled={checkingIn}
            className="w-full glass-button py-2 rounded-lg font-semibold text-sm hover:border-orange-500/50 transition-colors"
          >
            {checkingIn ? "Checking in..." : "Daily Check-In"}
          </button>
          {message && <p className="text-xs text-teal-400 font-medium absolute bottom-2">{message}</p>}
        </div>

        {/* Level Card */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center space-y-4 relative overflow-hidden md:col-span-2">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          <div className="flex w-full items-center gap-6">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 shadow-inner">
              <Crown className="w-12 h-12 text-purple-400" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Current Level</p>
                  <h3 className="text-2xl font-bold text-white">{gameState?.level || "Beginner"}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-400">{gameState?.xp || 0} <span className="text-sm font-medium text-slate-500">XP</span></p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-3 border border-slate-700/50 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${xpProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                </div>
              </div>
              <p className="text-xs text-slate-500 text-right">Next level at {Math.ceil(((gameState?.xp || 0) + 1) / 500) * 500} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold text-white">Earned Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Badge 1 */}
          <div className={`glass-panel p-4 flex flex-col items-center text-center space-y-3 ${gameState?.currentStreak >= 1 ? 'border-teal-500/30 bg-teal-500/5' : 'opacity-40 grayscale'}`}>
            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-sm">First Step</p>
              <p className="text-xs text-slate-500">Completed first check-in</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className={`glass-panel p-4 flex flex-col items-center text-center space-y-3 ${gameState?.currentStreak >= 3 ? 'border-blue-500/30 bg-blue-500/5' : 'opacity-40 grayscale'}`}>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-sm">Consistent</p>
              <p className="text-xs text-slate-500">3 day streak</p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className={`glass-panel p-4 flex flex-col items-center text-center space-y-3 ${gameState?.currentStreak >= 7 ? 'border-purple-500/30 bg-purple-500/5' : 'opacity-40 grayscale'}`}>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-sm">Zen Master</p>
              <p className="text-xs text-slate-500">7 day streak</p>
            </div>
          </div>

          {/* Badge 4 */}
          <div className={`glass-panel p-4 flex flex-col items-center text-center space-y-3 ${gameState?.xp >= 500 ? 'border-orange-500/30 bg-orange-500/5' : 'opacity-40 grayscale'}`}>
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Medal className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-200 text-sm">Dedicated</p>
              <p className="text-xs text-slate-500">Earned 500 XP</p>
            </div>
          </div>

        </div>
      </div>

      {/* Daily Challenges Section */}
      <div className="space-y-4 mt-12">
        <h2 className="text-xl font-semibold text-white">Daily Self-Care Challenges</h2>
        <p className="text-sm text-slate-400">Complete these simple personalized tasks to boost your mood.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Drink 8 glasses of water today.",
            "Take a 10-minute walk outside.",
            "Write 3 things you're grateful for.",
            "Complete a 5-minute breathing exercise."
          ].map((challenge, i) => (
            <label key={i} className="glass-panel p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500" />
              <span className="text-slate-200 font-medium">{challenge}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Mini Games Section */}
      <div className="space-y-4 mt-12">
        <h2 className="text-xl font-semibold text-white">Zen Mini Games</h2>
        <p className="text-sm text-slate-400">Take a break and relax your mind with these interactive experiences.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Breathing Game Card */}
          <div 
            onClick={() => setActiveGame(activeGame === "breathing" ? null : "breathing")}
            className="glass-panel p-6 cursor-pointer hover:border-teal-500/50 transition-all flex flex-col items-center text-center space-y-4 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {activeGame === "breathing" ? (
              <div className="w-full flex flex-col items-center py-8">
                <div className="relative flex items-center justify-center w-32 h-32 mb-4">
                  {/* Dynamic Breathing Circle */}
                  <div 
                    className={`absolute rounded-full bg-teal-500/20 border-2 border-teal-400 transition-all ease-in-out
                      ${breathState === "Inhale" ? "w-32 h-32 duration-[4000ms]" : ""}
                      ${breathState === "Hold" ? "w-32 h-32 duration-[7000ms]" : ""}
                      ${breathState === "Exhale" ? "w-16 h-16 duration-[8000ms]" : ""}
                    `} 
                  />
                  <div className="z-10 font-bold text-teal-300 text-xl tracking-widest uppercase">{breathState}</div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Click to stop</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-teal-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">4-7-8 Breathing</h3>
                  <p className="text-sm text-slate-400 mt-1">Calm your nervous system in 1 minute.</p>
                </div>
              </>
            )}
          </div>

          {/* Mood Matching Game Card */}
          <div className="glass-panel p-6 cursor-not-allowed opacity-75 flex flex-col items-center text-center space-y-4 relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <span className="text-2xl">🧩</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Mood Matcher</h3>
              <p className="text-sm text-slate-400 mt-1">Match emojis to emotions (Coming Soon).</p>
            </div>
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
               <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full border border-slate-700">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
