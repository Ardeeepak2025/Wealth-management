import { createContext, useMemo, useState } from "react";

interface SidebarContextValue {
  isMobileOpen: boolean;
  isCollapsed: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
  toggleCollapsed: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setCollapsed] = useState(false);

  const value = useMemo(
    () => ({
      isMobileOpen,
      isCollapsed,
      openMobile: () => setMobileOpen(true),
      closeMobile: () => setMobileOpen(false),
      toggleMobile: () => setMobileOpen((open) => !open),
      toggleCollapsed: () => setCollapsed((collapsed) => !collapsed),
    }),
    [isMobileOpen, isCollapsed],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
