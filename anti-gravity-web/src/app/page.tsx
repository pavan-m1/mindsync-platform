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

      <div className="glass-panel mt-20 p-8 z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Voice Analysis AI</h3>
          <p className="text-slate-400 text-sm">Understand your emotions through advanced acoustic and speech metrics.</p>
        </div>

        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Gamified Wellness</h3>
          <p className="text-slate-400 text-sm">Build consistency with streaks, achievements, and unlockable tools.</p>
        </div>

        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-teal-500/20 rounded-2xl flex items-center justify-center border border-teal-500/30">
            <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Secure Dashboard</h3>
          <p className="text-slate-400 text-sm">Your data is fully encrypted. Monitor progress in a personalized hub.</p>
        </div>
      </div>
      </main>
    </div>
  );
}
