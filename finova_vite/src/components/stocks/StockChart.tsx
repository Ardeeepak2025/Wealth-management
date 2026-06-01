import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChartPoint } from "@/types/stock";
import { fallbackTrend } from "@/utils/constants";
import { formatCurrency } from "@/utils/formatCurrency";

export function StockChart({ data = fallbackTrend, height = 220 }: { data?: ChartPoint[]; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={78} tickFormatter={(value) => formatCurrency(Number(value))} />
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.22)", borderRadius: 12 }} formatter={(value) => formatCurrency(Number(value))} />
          <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
