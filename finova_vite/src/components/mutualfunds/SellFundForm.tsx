import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useAuth } from "@/hooks/useAuth";
import { useMutualFunds } from "@/hooks/useMutualFunds";
import { formatCurrency } from "@/utils/formatCurrency";

export function SellFundForm() {
  const { user } = useAuth();
  const { funds, holdings, sellFund } = useMutualFunds();
  const [holdingId, setHoldingId] = useState<number>(holdings[0]?.id || 0);
  const [units, setUnits] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const holding = useMemo(() => holdings.find((item) => item.id === Number(holdingId)), [holdings, holdingId]);
  const fund = useMemo(() => funds.find((item) => item.id === holding?.mutual_fund_id), [funds, holding]);
  const nav = Number(fund?.nav || holding?.average_nav || 0);
  const total = nav * units;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !holding || units <= 0 || units > holding.units) {
      toast.error("Enter a valid redemption quantity");
      return;
    }
    setSubmitting(true);
    try {
      await sellFund(user.id, {
        mutual_fund_id: holding.mutual_fund_id,
        transaction_type: "SELL",
        units,
        nav_price: nav,
        total_amount: total,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="glass-card rounded-2xl p-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-medium text-slate-300">Holding</span>
          <select className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 text-sm text-slate-100 outline-none" value={holdingId} onChange={(event) => setHoldingId(Number(event.target.value))}>
            <option value={0}>Select holding</option>
            {holdings.map((item) => (
              <option key={item.id} value={item.id}>
                Fund #{item.mutual_fund_id} - {item.units} units
              </option>
            ))}
          </select>
        </label>
        <Input label="Units" type="number" min={1} max={holding?.units || undefined} value={units} onChange={(event) => setUnits(Number(event.target.value))} />
      </div>
      <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">Estimated redemption</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(total)}</p>
        </div>
        <Button type="submit" variant="danger" isLoading={submitting}>
          Redeem Fund
        </Button>
      </div>
    </form>
  );
}
