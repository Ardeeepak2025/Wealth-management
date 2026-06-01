import { NavLink } from "react-router-dom";
import type { SidebarLink } from "@/utils/sidebarItems";

export function SidebarItem({ item, onNavigate }: { item: SidebarLink; onNavigate?: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
          isActive ? "bg-sky-400/15 text-sky-200 ring-1 ring-sky-400/25" : "text-slate-400 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  );
}
