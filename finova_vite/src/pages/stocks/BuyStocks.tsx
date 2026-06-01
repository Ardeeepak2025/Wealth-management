import { useEffect } from "react";
import { BuyStockForm } from "@/components/stocks/BuyStockForm";
import { Topbar } from "@/components/layout/Topbar";
import { useStocks } from "@/hooks/useStocks";

export default function BuyStocks() {
  const { loadStocks } = useStocks();

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  return (
    <div>
      <Topbar title="Buy Stocks" description="Place an authenticated buy order against the stock server." />
      <BuyStockForm />
    </div>
  );
}
