import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Stock } from "@/types/stock";
import { formatCurrency } from "@/utils/formatCurrency";

export function StockInsights({ stocks }: { stocks: Stock[] }) {
  const sectorData = Object.values(
    stocks.reduce<Record<string, { sector: string; value: number }>>((acc, stock) => {
      const sector = stock.sector || "Other";
      acc[sector] = acc[sector] || { sector, value: 0 };
      acc[sector].value += stock.current_price;
      return acc;
    }, {}),
  );

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-5">
        <h3 className="font-semibold text-white">Sector Price Map</h3>
        <p className="text-sm text-slate-400">Aggregated current prices by sector</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sectorData}>
            <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
            <XAxis dataKey="sector" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={88} tickFormatter={(value) => formatCurrency(Number(value))} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.22)", borderRadius: 12 }} formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="value" fill="#38bdf8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
