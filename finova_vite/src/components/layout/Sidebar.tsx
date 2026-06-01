import { Activity } from "lucide-react";
import { SidebarSection } from "./SidebarSection";
import { useAuth } from "@/hooks/useAuth";
import { filterSidebarSections } from "@/utils/sidebarItems";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useAuth();
  const sections = filterSidebarSections(role ?? undefined);

  return (
    <aside className="flex h-full flex-col border-r border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="rounded-xl bg-sky-400/15 p-2 text-sky-300 ring-1 ring-sky-400/25">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-bold text-white">Finova</p>
          <p className="text-xs text-slate-500">Trading OS</p>
        </div>
      </div>
      <nav className="flex-1 space-y-4 overflow-y-auto pr-1">
        {sections.map((section) => (
          <SidebarSection key={section.label} section={section} onNavigate={onNavigate} />
        ))}
      </nav>
    </aside>
  );
}
