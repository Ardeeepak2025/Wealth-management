import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { makeTrend } from "@/utils/chartUtils";
import { formatCurrency } from "@/utils/formatCurrency";

export function MutualFundChart({ nav = 100, height = 220 }: { nav?: number; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={makeTrend(nav)}>
          <defs>
            <linearGradient id="navGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={76} tickFormatter={(value) => formatCurrency(Number(value))} />
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.22)", borderRadius: 12 }} formatter={(value) => formatCurrency(Number(value))} />
          <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} fill="url(#navGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
