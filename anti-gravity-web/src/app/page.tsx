import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-center">
        <div className="font-bold text-2xl text-white tracking-wide">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">MindSync</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <button className="text-white hover:text-blue-400 transition-colors font-medium px-4 py-2">
              Sign In
            </button>
          </Link>
          <Link href="/login">
            <button className="glass-button px-6 py-2 rounded-full font-medium">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
      {/* Decorative Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="z-10 w-full max-w-4xl text-center space-y-8">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          MindSync AI
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto">
          Elevate your mental wellness with AI-powered voice analysis, daily tracking, and gamified serenity.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link href="/login" className="w-full sm:w-auto">
            <button className="glass-button px-8 py-4 rounded-full text-lg font-semibold tracking-wide w-full">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      <div className="glass-panel mt-20 p-8 z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
        
        <div className="space-y-4 p-4 hover:bg-white/5 rounded-xl transition-colors">
          <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Voice Analysis AI</h3>
          <p className="text-slate-400 text-sm">Understand your emotions through advanced acoustic and speech metrics.</p>
        </div>

        <div className="space-y-4 p-4 hover:bg-white/5 rounded-xl transition-colors">
          <div className="w-16 h-16 mx-auto bg-pink-500/20 rounded-2xl flex items-center justify-center border border-pink-500/30">
            <svg className="w-8 h-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">AI Companions</h3>
          <p className="text-slate-400 text-sm">Chat with multiple AI personalities, from a Therapist to a Funny Buddy.</p>
        </div>

        <div className="space-y-4 p-4 hover:bg-white/5 rounded-xl transition-colors">
          <div className="w-16 h-16 mx-auto bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/30">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">AI Journaling</h3>
          <p className="text-slate-400 text-sm">Write down your thoughts and get automated AI emotional summaries.</p>
        </div>

        <div className="space-y-4 p-4 hover:bg-white/5 rounded-xl transition-colors">
          <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Emotional Journey</h3>
          <p className="text-slate-400 text-sm">Track your mood visually over time and predict stress triggers.</p>
        </div>

        <div className="space-y-4 p-4 hover:bg-white/5 rounded-xl transition-colors">
          <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Gamification</h3>
          <p className="text-slate-400 text-sm">Complete daily self-care challenges to earn streaks and badges.</p>
        </div>

        <div className="space-y-4 p-4 hover:bg-white/5 rounded-xl transition-colors">
          <div className="w-16 h-16 mx-auto bg-rose-500/20 rounded-2xl flex items-center justify-center border border-rose-500/30">
            <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Specialist Network</h3>
          <p className="text-slate-400 text-sm">Connect directly with licensed therapists when you need real human support.</p>
        </div>

      </div>
      </main>
    </div>
  );
}
