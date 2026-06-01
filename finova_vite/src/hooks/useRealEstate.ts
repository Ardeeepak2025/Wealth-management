import { useContext } from "react";
import { RealEstateContext } from "@/context/RealEstateContext";

export function useRealEstate() {
  const context = useContext(RealEstateContext);
  if (!context) throw new Error("useRealEstate must be used inside RealEstateProvider");
  return context;
}
