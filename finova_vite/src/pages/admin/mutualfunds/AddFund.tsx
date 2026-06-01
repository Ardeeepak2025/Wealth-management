import { AddFundForm } from "@/components/admin/AddFundForm";
import { Topbar } from "@/components/layout/Topbar";

export default function AddFund() {
  return (
    <div>
      <Topbar title="Add Mutual Fund" description="Create a fund using mutual fund admin APIs." />
      <AddFundForm />
    </div>
  );
}
