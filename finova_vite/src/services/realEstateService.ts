import { gatewayApi } from "./axios";
import { fallbackProperties } from "@/utils/constants";
import type { Property, PropertyPayload, RealEstatePortfolio, RentRecord, Valuation } from "@/types/realestate";
import { makeTrend } from "@/utils/chartUtils";

export const realEstateService = {
  async createProperty(payload: PropertyPayload): Promise<Property> {
    const { data } = await gatewayApi.post<Property>("/real-estate/properties", payload);
    return data;
  },

  async getProperty(id: number): Promise<Property> {
    const { data } = await gatewayApi.get<Property>(`/real-estate/properties/${id}`);
    return data;
  },

  async getProperties(ownerId: number): Promise<Property[]> {
    const { data } = await gatewayApi.get<Property[]>("/real-estate/properties", { params: { ownerId } });
    return Array.isArray(data) && data.length ? data : fallbackProperties;
  },

  async addValuation(id: number, value: number): Promise<Valuation> {
    const { data } = await gatewayApi.post<Valuation>(`/real-estate/properties/${id}/valuation`, { value });
    return data;
  },

  async getValuations(id: number): Promise<Valuation[]> {
    const { data } = await gatewayApi.get<Valuation[]>(`/real-estate/properties/${id}/valuations`);
    return data;
  },

  async addRent(id: number, amount: number): Promise<RentRecord> {
    const { data } = await gatewayApi.post<RentRecord>(`/real-estate/properties/${id}/rent`, { amount });
    return data;
  },

  async getRents(id: number): Promise<RentRecord[]> {
    const { data } = await gatewayApi.get<RentRecord[]>(`/real-estate/properties/${id}/rents`);
    return data;
  },

  async getPortfolio(investorId: number): Promise<RealEstatePortfolio> {
    try {
      const { data } = await gatewayApi.get<RealEstatePortfolio>(`/real-estate/investor/${investorId}/portfolio`);
      return data;
    } catch {
      return {
        investorId,
        totalValue: fallbackProperties.reduce((sum, property) => sum + property.currentValue, 0),
        totalRent: fallbackProperties.reduce((sum, property) => sum + property.rentEstimate, 0),
        properties: fallbackProperties,
        valuationTrend: makeTrend(15000000),
      };
    }
  },
};
