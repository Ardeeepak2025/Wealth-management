import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useAuth } from "@/hooks/useAuth";
import { useStocks } from "@/hooks/useStocks";
import { formatCurrency } from "@/utils/formatCurrency";

export function SellStockForm() {
  const { user } = useAuth();
  const { holdings, sellStock } = useStocks();
  const [holdingId, setHoldingId] = useState<number>(holdings[0]?.id || 0);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const holding = useMemo(() => holdings.find((item) => item.id === Number(holdingId)), [holdings, holdingId]);
  const total = Number(holding?.current_price || 0) * Number(quantity || 0);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !holding) return;
    if (quantity <= 0 || quantity > holding.quantity) {
      toast.error("Enter a valid sell quantity");
      return;
    }
    setSubmitting(true);
    try {
      await sellStock(user.id, { stock_id: holding.stock_id, quantity });
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
                {item.symbol} - {item.quantity} units
              </option>
            ))}
          </select>
        </label>
        <Input label="Quantity" type="number" min={1} max={holding?.quantity || undefined} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
      </div>
      <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">Estimated proceeds</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(total)}</p>
        </div>
        <Button type="submit" variant="danger" isLoading={submitting}>
          Sell Stock
        </Button>
      </div>
    </form>
  );
}
