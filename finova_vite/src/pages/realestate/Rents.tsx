import { useEffect } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { Topbar } from "@/components/layout/Topbar";
import { RentalTable } from "@/components/realestate/RentalTable";
import { useAuth } from "@/hooks/useAuth";
import { useRealEstate } from "@/hooks/useRealEstate";

export default function Rents() {
  const { user } = useAuth();
  const { properties, rents, loadProperties, loadPropertyActivity } = useRealEstate();

  useEffect(() => {
    loadProperties(user?.id || 1);
  }, [loadProperties, user]);

  useEffect(() => {
    if (properties[0]) loadPropertyActivity(properties[0].id);
  }, [loadPropertyActivity, properties]);

  return (
    <div>
      <Topbar title="Rents" description="Rental records for selected gateway property." />
      {rents.length ? <RentalTable rents={rents} /> : <EmptyState title="No rent records" description="Rent records will appear when the gateway returns property rent data." />}
    </div>
  );
}
