import { mutualFundApi } from "./axios";
import { fallbackFunds } from "@/utils/constants";
import type {
  AddFundPayload,
  FundHolding,
  FundOrderPayload,
  FundTransaction,
  MutualFund,
  MutualFundAnalytics,
} from "@/types/mutualfund";

export const mutualFundService = {
  async getFunds(): Promise<MutualFund[]> {
    const { data } = await mutualFundApi.get<MutualFund[]>("/api/mutual-funds");
    return data.length ? data : fallbackFunds;
  },

  async getAnalytics(): Promise<MutualFundAnalytics> {
    const { data } = await mutualFundApi.get<MutualFundAnalytics>("/api/mutual-funds/analytics");
    return data;
  },

  async getFund(id: number): Promise<MutualFund> {
    const { data } = await mutualFundApi.get<MutualFund>(`/api/mutual-funds/${id}`);
    return data;
  },

  async createFund(payload: AddFundPayload): Promise<{ id: number; message: string }> {
    const { data } = await mutualFundApi.post<{ id: number; message: string }>("/api/mutual-funds", payload);
    return data;
  },

  async getHoldings(userId?: number): Promise<FundHolding[]> {
    const { data } = await mutualFundApi.get<FundHolding[]>("/api/holdings", { params: userId ? { userId } : {} });
    return data;
  },

  async getTransactions(userId?: number): Promise<FundTransaction[]> {
    const { data } = await mutualFundApi.get<FundTransaction[]>("/api/transactions", { params: userId ? { userId } : {} });
    return data;
  },

  async createTransaction(userId: number, payload: FundOrderPayload): Promise<{ id: number; message: string }> {
    const { data } = await mutualFundApi.post<{ id: number; message: string }>("/api/transactions", {
      user_id: userId,
      ...payload,
    });
    return data;
  },

  async getSummary(userId: number) {
    const { data } = await mutualFundApi.get(`/api/summary/${userId}`);
    return data;
  },

  async createFundAdmin(payload: AddFundPayload): Promise<{ id: number; message: string }> {
    const { data } = await mutualFundApi.post<{ id: number; message: string }>("/api/admin/mutual-funds", payload);
    return data;
  },

  async deleteFundAdmin(id: number): Promise<{ message: string }> {
    const { data } = await mutualFundApi.delete<{ message: string }>(`/api/admin/mutual-funds/${id}`);
    return data;
  },

  async getAdminTransactions(): Promise<{ transactions: FundTransaction[] }> {
    const { data } = await mutualFundApi.get<{ transactions: FundTransaction[] }>("/api/admin/transactions");
    return data;
  },
};
