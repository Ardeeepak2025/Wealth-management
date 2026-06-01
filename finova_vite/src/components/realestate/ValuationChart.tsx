import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChartPoint } from "@/types/stock";
import { formatCurrency } from "@/utils/formatCurrency";

export function ValuationChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="mb-5 font-semibold text-white">Valuation Trend</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatCurrency(Number(value))} width={98} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.22)", borderRadius: 12 }} formatter={(value) => formatCurrency(Number(value))} />
            <Area dataKey="value" stroke="#38bdf8" fill="#38bdf833" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
