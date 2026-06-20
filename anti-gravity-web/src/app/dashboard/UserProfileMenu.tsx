"use client";

import { useState } from "react";
import { UserCircle, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function UserProfileMenu({ email }: { email: string | undefined | null }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-colors cursor-pointer"
      >
        <UserCircle size={20} />
        <div className="flex-1 truncate text-left">
          <span className="text-xs font-medium block truncate">{email || "User"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-slate-700/50 transition-colors text-sm font-medium text-left"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
