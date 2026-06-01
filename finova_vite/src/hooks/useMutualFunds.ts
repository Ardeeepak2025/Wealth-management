import { useContext } from "react";
import { MutualFundContext } from "@/context/MutualFundContext";

export function useMutualFunds() {
  const context = useContext(MutualFundContext);
  if (!context) throw new Error("useMutualFunds must be used inside MutualFundProvider");
  return context;
}
