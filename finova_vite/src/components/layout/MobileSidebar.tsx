import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { useSidebar } from "@/hooks/useSidebar";

export function MobileSidebar() {
  const { isMobileOpen, closeMobile } = useSidebar();

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={closeMobile} aria-label="Close navigation" />
          <motion.div
            className="relative h-full w-[86vw] max-w-80"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 250 }}
          >
            <Sidebar onNavigate={closeMobile} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
