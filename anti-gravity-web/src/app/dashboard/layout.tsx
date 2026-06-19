import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, Mic, Target, UserCircle } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-900 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass-panel m-4 flex flex-col z-20">
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">MindSync</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            <li>
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Activity size={20} className="text-blue-400" />
                <span className="font-medium">Overview</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/voice" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Mic size={20} className="text-purple-400" />
                <span className="font-medium">Voice Analysis</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/games" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Target size={20} className="text-teal-400" />
                <span className="font-medium">Gamification</span>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/tools" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <Target size={20} className="text-orange-400" />
                <span className="font-medium">Mini-Games</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-300 bg-slate-800/50 rounded-xl">
            <UserCircle size={20} />
            <div className="flex-1 truncate">
              <span className="text-xs font-medium block truncate">{session.user?.email}</span>
            </div>
          </div>
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
