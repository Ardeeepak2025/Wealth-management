import { useState } from "react";
import { Bell, Mail, ShieldCheck } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import type { NotificationPreference } from "@/types/user";

const initialPreferences: NotificationPreference[] = [
  { id: "orders", label: "Order confirmations", enabled: true },
  { id: "market", label: "Market mover alerts", enabled: true },
  { id: "security", label: "Security notifications", enabled: true },
];

export default function Notifications() {
  const [preferences, setPreferences] = useState(initialPreferences);

  function toggle(id: string) {
    setPreferences((current) => current.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
  }

  return (
    <div>
      <Topbar title="Notifications" description="Manage trading, market, and security notification preferences." />
      <div className="grid gap-4 lg:grid-cols-3">
        {preferences.map((preference, index) => {
          const Icon = [Bell, Mail, ShieldCheck][index] || Bell;
          return (
            <button key={preference.id} className="glass-card rounded-2xl p-5 text-left" onClick={() => toggle(preference.id)}>
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-sky-400/15 p-3 text-sky-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${preference.enabled ? "bg-green-400/15 text-green-300" : "bg-white/10 text-slate-400"}`}>
                  {preference.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="mt-5 font-semibold text-white">{preference.label}</p>
              <p className="mt-2 text-sm text-slate-400">Click to toggle this notification preference.</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
