import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Input } from "@/components/common/Input";
import { formatCurrency } from "@/utils/formatCurrency";

export function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const [returnRate, setReturnRate] = useState(12);

  const projection = useMemo(() => {
    const months = years * 12;
    const monthlyRate = returnRate / 100 / 12;
    const points = Array.from({ length: years }, (_, yearIndex) => {
      const month = (yearIndex + 1) * 12;
      const value = monthly * (((1 + monthlyRate) ** month - 1) / monthlyRate) * (1 + monthlyRate);
      return { label: `Y${yearIndex + 1}`, value: Math.round(value) };
    });
    const maturityValue = points.at(-1)?.value || 0;
    const investedAmount = monthly * months;
    return { points, maturityValue, investedAmount, estimatedReturns: maturityValue - investedAmount };
  }, [monthly, years, returnRate]);

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-5">
        <h3 className="font-semibold text-white">SIP Calculator</h3>
        <p className="text-sm text-slate-400">Estimate long-term systematic investment growth</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input label="Monthly SIP" type="number" value={monthly} onChange={(event) => setMonthly(Number(event.target.value))} />
        <Input label="Years" type="number" value={years} onChange={(event) => setYears(Number(event.target.value))} />
        <Input label="Expected Return %" type="number" value={returnRate} onChange={(event) => setReturnRate(Number(event.target.value))} />
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projection.points}>
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatCurrency(Number(value))} width={90} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,.22)", borderRadius: 12 }} formatter={(value) => formatCurrency(Number(value))} />
              <Area dataKey="value" stroke="#22c55e" fill="#22c55e33" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          <Metric label="Maturity Value" value={projection.maturityValue} />
          <Metric label="Invested Amount" value={projection.investedAmount} />
          <Metric label="Estimated Returns" value={projection.estimatedReturns} positive />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, positive }: { label: string; value: number; positive?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-1 text-xl font-bold ${positive ? "text-green-300" : "text-white"}`}>{formatCurrency(value)}</p>
    </div>
  );
}
