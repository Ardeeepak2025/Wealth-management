import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SidebarItem } from "./SidebarItem";
import type { SidebarSectionDef } from "@/utils/sidebarItems";

export function SidebarSection({ section, onNavigate }: { section: SidebarSectionDef; onNavigate?: () => void }) {
  const [open, setOpen] = useState(true);
  const Icon = section.icon;

  return (
    <div>
      <button
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-white/5"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {section.label}
        </span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="mt-1 space-y-1 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {section.links.map((item) => (
              <SidebarItem key={item.path} item={item} onNavigate={onNavigate} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
