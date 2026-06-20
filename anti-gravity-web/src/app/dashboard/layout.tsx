import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, Mic, Target, UserCircle, LineChart, Book, MessageSquare, HeartHandshake, Calendar } from "lucide-react";
import { prisma } from "@/lib/db";

import UserProfileMenu from "./UserProfileMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!(session?.user as any)?.id) {
    redirect("/login");
  }

  // Fetch latest mood for the Mood Avatar
  const latestMood = await prisma.moodLog.findFirst({
    where: { userId: (session as any).user.id },
    orderBy: { loggedAt: "desc" },
  });

  let moodEmoji = "😐"; // Default Neutral
  if (latestMood) {
    if (latestMood.moodScore >= 8) moodEmoji = "😊";
    else if (latestMood.stressScore >= 8) moodEmoji = "😣";
    else if (latestMood.moodScore <= 4) moodEmoji = "😔";
  }

  return (
    <div className="min-h-screen bg-slate-900 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass-panel m-4 flex flex-col z-20">
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">MindSync</h1>
          {/* Mood Avatar */}
          <div className="text-3xl animate-bounce hover:animate-spin cursor-pointer" title="Your current mood avatar">
            {moodEmoji}
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <ul className="space-y-1 px-3">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Activity size={18} className="text-blue-400" />
                <span className="font-medium text-sm">Overview</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/reports" className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <LineChart size={18} className="text-emerald-400" />
                <span className="font-medium text-sm">Emotional Journey</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/journal" className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Book size={18} className="text-amber-400" />
                <span className="font-medium text-sm">AI Journal</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/companion" className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <MessageSquare size={18} className="text-pink-400" />
                <span className="font-medium text-sm">Companions</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/voice" className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Mic size={18} className="text-purple-400" />
                <span className="font-medium text-sm">Voice Analysis</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/gamification" className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Target size={18} className="text-teal-400" />
                <span className="font-medium text-sm">Gamification</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/specialists" className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <HeartHandshake size={18} className="text-rose-400" />
                <span className="font-medium text-sm">Specialists</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/appointments" className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Calendar size={18} className="text-indigo-400" />
                <span className="font-medium text-sm">Appointments</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <UserProfileMenu email={session?.user?.email} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <div className="relative z-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
