import { useContext } from "react";
import { StockContext } from "@/context/StockContext";

export function useStocks() {
  const context = useContext(StockContext);
  if (!context) throw new Error("useStocks must be used inside StockProvider");
  return context;
}
