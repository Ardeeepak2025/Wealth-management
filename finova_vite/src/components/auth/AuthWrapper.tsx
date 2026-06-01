import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import type { ReactNode } from "react";

export function AuthWrapper({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-finova-black px-4 py-8 text-white">
      <div className="absolute inset-0 bg-finance-grid bg-[length:48px_48px] opacity-60" />
      <motion.div
        className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.68, 0.45] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_470px]">
        <section className="hidden lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-sky-400/15 p-3 text-sky-300 ring-1 ring-sky-400/25">
              <Activity className="h-9 w-9" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Finova</h1>
              <p className="text-slate-400">Stocks, funds, and real assets in one desk.</p>
            </div>
          </div>
          <div className="glass-card max-w-xl rounded-3xl p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Modern Trading Platform</p>
            <h2 className="mt-4 text-5xl font-black leading-tight">A calm dashboard for active wealth decisions.</h2>
            <p className="mt-5 text-base leading-7 text-slate-400">
              Track holdings, execute orders, inspect fund NAV trends, and administer your market catalog from a responsive fintech workspace.
            </p>
          </div>
        </section>
        <motion.section
          className="glass-card mx-auto w-full max-w-md rounded-3xl p-6 sm:p-8"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Finova</p>
            <h2 className="mt-2 text-3xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
          </div>
          {children}
        </motion.section>
      </div>
    </main>
  );
}
