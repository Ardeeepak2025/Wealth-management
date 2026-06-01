import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        finova: {
          black: "#05070d",
          panel: "rgba(15, 23, 42, 0.64)",
          panelStrong: "rgba(15, 23, 42, 0.88)",
          line: "rgba(148, 163, 184, 0.18)",
          blue: "#38bdf8",
          green: "#22c55e",
          red: "#ef4444",
          amber: "#f59e0b",
        },
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, 0.35)",
        glow: "0 0 36px rgba(56, 189, 248, 0.14)",
      },
      backgroundImage: {
        "finance-grid":
          "linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
