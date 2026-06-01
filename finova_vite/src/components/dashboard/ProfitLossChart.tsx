import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { profitLossData } from "@/utils/chartUtils";
import { formatCurrency } from "@/utils/formatCurrency";

export function ProfitLossChart() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-5">
        <h3 className="font-semibold text-white">Profit / Loss Trend</h3>
        <p className="text-sm text-slate-400">Portfolio performance over recent months</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={profitLossData}>
            <defs>
              <linearGradient id="profitGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatCurrency(Number(value))} width={88} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.22)", borderRadius: 12 }} formatter={(value) => formatCurrency(Number(value))} />
            <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} fill="url(#profitGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
