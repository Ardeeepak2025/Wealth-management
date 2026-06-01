import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useAuth } from "@/hooks/useAuth";
import { useStocks } from "@/hooks/useStocks";
import { formatCurrency } from "@/utils/formatCurrency";

export function BuyStockForm() {
  const { user } = useAuth();
  const { stocks, buyStock } = useStocks();
  const [stockId, setStockId] = useState<number>(stocks[0]?.id || 0);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const stock = useMemo(() => stocks.find((item) => item.id === Number(stockId)), [stocks, stockId]);
  const total = Number(stock?.current_price || 0) * Number(quantity || 0);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    if (!stockId || quantity <= 0) {
      toast.error("Select a stock and quantity");
      return;
    }
    setSubmitting(true);
    try {
      await buyStock(user.id, { stock_id: Number(stockId), quantity: Number(quantity) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="glass-card rounded-2xl p-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-medium text-slate-300">Stock</span>
          <select className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 text-sm text-slate-100 outline-none" value={stockId} onChange={(event) => setStockId(Number(event.target.value))}>
            <option value={0}>Select stock</option>
            {stocks.map((item) => (
              <option key={item.id} value={item.id}>
                {item.symbol} - {item.company_name}
              </option>
            ))}
          </select>
        </label>
        <Input label="Quantity" type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
      </div>
      <div className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">Estimated total</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(total)}</p>
        </div>
        <Button type="submit" isLoading={submitting}>
          Buy Stock
        </Button>
      </div>
    </form>
  );
}
