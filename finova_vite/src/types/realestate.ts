import type { ChartPoint } from "./stock";

export interface Property {
  id: number;
  ownerId: number;
  title: string;
  location: string;
  propertyType: string;
  purchasePrice: number;
  currentValue: number;
  rentEstimate: number;
  createdAt?: string;
}

export interface Valuation {
  id: number;
  propertyId: number;
  value: number;
  note?: string;
  createdAt: string;
}

export interface RentRecord {
  id: number;
  propertyId: number;
  amount: number;
  paidOn: string;
  tenant?: string;
}

export interface RealEstatePortfolio {
  investorId: number;
  totalValue: number;
  totalRent: number;
  properties: Property[];
  valuationTrend: ChartPoint[];
}

export interface PropertyPayload {
  ownerId: number;
  title: string;
  location: string;
  propertyType: string;
  purchasePrice: number;
  currentValue: number;
  rentEstimate: number;
}
