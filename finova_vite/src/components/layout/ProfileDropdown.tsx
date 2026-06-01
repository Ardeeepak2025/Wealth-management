import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Settings, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { roleLabel } from "@/utils/roleUtils";

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition hover:bg-white/[0.08]"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-400/15 text-sm font-bold text-sky-200">
          {user?.name?.charAt(0) || "F"}
        </span>
        <span className="hidden sm:block">
          <span className="block text-sm font-semibold text-white">{user?.name || "Finova User"}</span>
          <span className="block text-xs text-slate-500">{user?.role ? roleLabel(user.role) : "Trader"}</span>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="glass-card absolute right-0 top-14 z-30 w-64 overflow-hidden rounded-xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <div className="border-b border-white/10 p-4">
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="truncate text-sm text-slate-400">{user?.email}</p>
            </div>
            <Link className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/10" to="/profile" onClick={() => setOpen(false)}>
              <UserRound className="h-4 w-4" /> Profile
            </Link>
            <Link className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/10" to="/profile/settings" onClick={() => setOpen(false)}>
              <Settings className="h-4 w-4" /> Settings
            </Link>
            <button className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-200 hover:bg-red-500/10" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
