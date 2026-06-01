import { Topbar } from "@/components/layout/Topbar";
import { AddStockForm } from "@/components/admin/AddStockForm";

export default function AddStock() {
  return (
    <div>
      <Topbar title="Add Stock" description="Create a new stock record in the stock service catalog." />
      <AddStockForm />
    </div>
  );
}
