import { FormEvent, useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useMutualFunds } from "@/hooks/useMutualFunds";
import type { AddFundPayload } from "@/types/mutualfund";

const initialState: AddFundPayload = {
  fund_name: "",
  fund_type: "",
  nav: 0,
  highest_nav: 0,
  lowest_nav: 0,
};

export function AddFundForm() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const { addFund } = useMutualFunds();

  function update<K extends keyof AddFundPayload>(key: K, value: AddFundPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await addFund(form);
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="glass-card rounded-2xl p-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Fund Name" value={form.fund_name} onChange={(event) => update("fund_name", event.target.value)} />
        <Input label="Fund Type" value={form.fund_type} onChange={(event) => update("fund_type", event.target.value)} />
        <Input label="NAV" type="number" value={form.nav} onChange={(event) => update("nav", Number(event.target.value))} />
        <Input label="Highest NAV" type="number" value={form.highest_nav} onChange={(event) => update("highest_nav", Number(event.target.value))} />
        <Input label="Lowest NAV" type="number" value={form.lowest_nav} onChange={(event) => update("lowest_nav", Number(event.target.value))} />
      </div>
      <div className="mt-5 flex justify-end">
        <Button type="submit" isLoading={submitting}>
          Add Fund
        </Button>
      </div>
    </form>
  );
}
