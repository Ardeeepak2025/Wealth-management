import { useEffect, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { PortfolioAnalytics } from "@/components/realestate/PortfolioAnalytics";
import { PropertyCard } from "@/components/realestate/PropertyCard";
import { PropertyModal } from "@/components/realestate/PropertyModal";
import { ValuationChart } from "@/components/realestate/ValuationChart";
import { useAuth } from "@/hooks/useAuth";
import { useRealEstate } from "@/hooks/useRealEstate";
import type { Property } from "@/types/realestate";

export default function RealEstate() {
  const { user } = useAuth();
  const { properties, portfolio, loadProperties, loadPortfolio } = useRealEstate();
  const [selected, setSelected] = useState<Property | null>(null);

  useEffect(() => {
    const ownerId = user?.id || 1;
    loadProperties(ownerId);
    loadPortfolio(ownerId);
  }, [loadPortfolio, loadProperties, user]);

  return (
    <div>
      <Topbar title="Real Estate" description="Gateway-backed property valuations, rent tracking, and investor portfolio analytics." />
      <PortfolioAnalytics portfolio={portfolio} />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} onClick={setSelected} />
        ))}
      </div>
      {portfolio && (
        <div className="mt-6">
          <ValuationChart data={portfolio.valuationTrend} />
        </div>
      )}
      <PropertyModal property={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </div>
  );
}
