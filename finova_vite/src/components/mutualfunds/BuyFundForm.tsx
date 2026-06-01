import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useAuth } from "@/hooks/useAuth";
import { useMutualFunds } from "@/hooks/useMutualFunds";
import { formatCurrency } from "@/utils/formatCurrency";

export function BuyFundForm() {
  const { user } = useAuth();
  const { funds, buyFund } = useMutualFunds();
  const [fundId, setFundId] = useState<number>(funds[0]?.id || 0);
  const [amount, setAmount] = useState(1000);
  const [submitting, setSubmitting] = useState(false);
  const fund = useMemo(() => funds.find((item) => item.id === Number(fundId)), [funds, fundId]);
  const nav = Number(fund?.nav || 0);
  const units = nav > 0 ? amount / nav : 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !fund || amount <= 0) {
      toast.error("Select a fund and amount");
      return;
    }
    setSubmitting(true);
    try {
      await buyFund(user.id, {
        mutual_fund_id: fund.id,
        transaction_type: "BUY",
        units,
        nav_price: nav,
        total_amount: amount,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="glass-card rounded-2xl p-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-medium text-slate-300">Mutual Fund</span>
          <select className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 text-sm text-slate-100 outline-none" value={fundId} onChange={(event) => setFundId(Number(event.target.value))}>
            <option value={0}>Select fund</option>
            {funds.map((item) => (
              <option key={item.id} value={item.id}>
                {item.fund_name}
              </option>
            ))}
          </select>
        </label>
        <Input label="Investment Amount" type="number" min={1} value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
      </div>
      <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">Estimated units</p>
          <p className="text-2xl font-bold text-white">{units.toFixed(4)}</p>
          <p className="text-xs text-slate-500">NAV {formatCurrency(nav)}</p>
        </div>
        <Button type="submit" isLoading={submitting}>
          Buy Fund
        </Button>
      </div>
    </form>
  );
}
