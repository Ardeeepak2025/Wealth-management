import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Topbar } from "@/components/layout/Topbar";
import { PropertyCard } from "@/components/realestate/PropertyCard";
import { useAuth } from "@/hooks/useAuth";
import { useRealEstate } from "@/hooks/useRealEstate";
import type { PropertyPayload } from "@/types/realestate";

export default function Properties() {
  const { user } = useAuth();
  const { properties, loadProperties, createProperty } = useRealEstate();
  const [form, setForm] = useState<PropertyPayload>({
    ownerId: user?.id || 1,
    title: "",
    location: "",
    propertyType: "Apartment",
    purchasePrice: 0,
    currentValue: 0,
    rentEstimate: 0,
  });

  useEffect(() => {
    const ownerId = user?.id || 1;
    setForm((current) => ({ ...current, ownerId }));
    loadProperties(ownerId);
  }, [loadProperties, user]);

  function update<K extends keyof PropertyPayload>(key: K, value: PropertyPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await createProperty(form);
    setForm((current) => ({ ...current, title: "", location: "", purchasePrice: 0, currentValue: 0, rentEstimate: 0 }));
  }

  return (
    <div>
      <Topbar title="Properties" description="Create and view real estate properties via the main gateway." />
      <form className="glass-card mb-6 rounded-2xl p-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Input label="Title" value={form.title} onChange={(event) => update("title", event.target.value)} />
          <Input label="Location" value={form.location} onChange={(event) => update("location", event.target.value)} />
          <Input label="Property Type" value={form.propertyType} onChange={(event) => update("propertyType", event.target.value)} />
          <Input label="Purchase Price" type="number" value={form.purchasePrice} onChange={(event) => update("purchasePrice", Number(event.target.value))} />
          <Input label="Current Value" type="number" value={form.currentValue} onChange={(event) => update("currentValue", Number(event.target.value))} />
          <Input label="Rent Estimate" type="number" value={form.rentEstimate} onChange={(event) => update("rentEstimate", Number(event.target.value))} />
        </div>
        <div className="mt-5 flex justify-end">
          <Button type="submit">Save Property</Button>
        </div>
      </form>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
