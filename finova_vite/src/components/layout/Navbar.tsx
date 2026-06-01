import { Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ProfileDropdown } from "./ProfileDropdown";
import { useSidebar } from "@/hooks/useSidebar";

function titleFromPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "Dashboard";
  return parts.map((part) => part.replace(/-/g, " ")).join(" / ");
}

export function Navbar() {
  const { openMobile } = useSidebar();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden" onClick={openMobile} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Finova</p>
            <h1 className="capitalize text-lg font-semibold text-white sm:text-xl">{titleFromPath(location.pathname)}</h1>
          </div>
        </div>
        <div className="hidden min-w-64 max-w-sm flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm outline-none focus:border-sky-400/60" placeholder="Search markets, funds, assets" />
          </div>
        </div>
        <ProfileDropdown />
      </div>
    </header>
  );
}
