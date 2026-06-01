import { FormEvent, useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useStocks } from "@/hooks/useStocks";
import type { AddStockPayload } from "@/types/stock";

const initialState: AddStockPayload = {
  symbol: "",
  company_name: "",
  sector: "",
  current_price: 0,
  highest_price: 0,
  lowest_price: 0,
  available_quantity: 0,
};

export function AddStockForm() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const { addStock } = useStocks();

  function update<K extends keyof AddStockPayload>(key: K, value: AddStockPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await addStock(form);
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="glass-card rounded-2xl p-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Symbol" value={form.symbol} onChange={(event) => update("symbol", event.target.value.toUpperCase())} />
        <Input label="Company Name" value={form.company_name} onChange={(event) => update("company_name", event.target.value)} />
        <Input label="Sector" value={form.sector} onChange={(event) => update("sector", event.target.value)} />
        <Input label="Available Quantity" type="number" value={form.available_quantity} onChange={(event) => update("available_quantity", Number(event.target.value))} />
        <Input label="Current Price" type="number" value={form.current_price} onChange={(event) => update("current_price", Number(event.target.value))} />
        <Input label="Highest Price" type="number" value={form.highest_price} onChange={(event) => update("highest_price", Number(event.target.value))} />
        <Input label="Lowest Price" type="number" value={form.lowest_price} onChange={(event) => update("lowest_price", Number(event.target.value))} />
      </div>
      <div className="mt-5 flex justify-end">
        <Button type="submit" isLoading={submitting}>
          Add Stock
        </Button>
      </div>
    </form>
  );
}
