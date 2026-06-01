import { stockApi } from "./axios";
import {
  fallbackHoldings,
  fallbackLeaderboard,
  fallbackStocks,
  fallbackSummary,
  fallbackTransactions,
} from "@/utils/constants";
import type {
  AddStockPayload,
  DashboardSummary,
  LeaderboardEntry,
  Stock,
  StockDetailsResponse,
  StockHolding,
  StockOrderPayload,
  StockTransaction,
} from "@/types/stock";

export const stockService = {
  async getAllStocks(): Promise<Stock[]> {
    const { data } = await stockApi.get<Stock[]>("/stocks/getallstocks");
    return data.length ? data : fallbackStocks;
  },

  async getTopGainers(): Promise<Stock[]> {
    const { data } = await stockApi.get<Stock[]>("/stocks/gettopgainers");
    return data.length ? data : fallbackStocks.filter((stock) => Number(stock.day_change_percent) >= 0);
  },

  async getTopLosers(): Promise<Stock[]> {
    const { data } = await stockApi.get<Stock[]>("/stocks/gettoplosers");
    return data.length ? data : fallbackStocks.filter((stock) => Number(stock.day_change_percent) < 0);
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data } = await stockApi.get<LeaderboardEntry[]>("/stocks/getleaderboard");
    return data.length ? data : fallbackLeaderboard;
  },

  async getStockById(id: number): Promise<Stock> {
    const { data } = await stockApi.get<Stock>(`/stocks/getstockbyid/${id}`);
    return data;
  },

  async getStockInfo(id: number): Promise<StockDetailsResponse> {
    const { data } = await stockApi.get<StockDetailsResponse>("/stocks/getstockbyid", {
      params: { stock_id: id },
    });
    return data;
  },

  async getHoldings(userId: number): Promise<StockHolding[]> {
    const { data } = await stockApi.post<StockHolding[]>("/stocks/getuserholdings", { user_id: userId });
    return data.length ? data : fallbackHoldings;
  },

  async buyStock(userId: number, payload: StockOrderPayload): Promise<{ message: string }> {
    const { data } = await stockApi.post<{ message: string }>("/stocks/buystock", { user_id: userId, ...payload });
    return data;
  },

  async sellStock(userId: number, payload: StockOrderPayload): Promise<{ message: string }> {
    const { data } = await stockApi.post<{ message: string }>("/stocks/sellstock", { user_id: userId, ...payload });
    return data;
  },

  async getDashboardSummary(userId: number): Promise<DashboardSummary> {
    const { data } = await stockApi.post<DashboardSummary>("/stocks/getdashboardsummary", { user_id: userId });
    return data || fallbackSummary;
  },

  async getPortfolioDistribution(userId: number): Promise<StockHolding[]> {
    const { data } = await stockApi.post<StockHolding[]>("/stocks/getportfoliodistribution", { user_id: userId });
    return data;
  },

  async getOverallBestStock(): Promise<Stock> {
    const { data } = await stockApi.get<Stock>("/stocks/getoverallbeststock");
    return data || fallbackStocks[0];
  },

  async getOverallWorstStock(): Promise<Stock> {
    const { data } = await stockApi.get<Stock>("/stocks/getoverallworststock");
    return data || fallbackStocks[1];
  },

  async addStock(payload: AddStockPayload): Promise<{ message: string }> {
    const { data } = await stockApi.post<{ message: string }>("/admin/addstock", payload);
    return data;
  },

  async updateStockPrice(stock_id: number, current_price: number): Promise<{ message: string }> {
    const { data } = await stockApi.put<{ message: string }>("/admin/updatestockprice", {
      stock_id,
      current_price,
      updated_by: "Finova",
    });
    return data;
  },

  async updateStockQuantity(stock_id: number, available_quantity: number): Promise<{ message: string }> {
    const { data } = await stockApi.put<{ message: string }>("/admin/updatestockquantity", {
      stock_id,
      available_quantity,
    });
    return data;
  },

  async deleteStock(stock_id: number): Promise<{ message: string }> {
    const { data } = await stockApi.delete<{ message: string }>("/admin/deletestock", { data: { stock_id } });
    return data;
  },

  async getAdminTransactions(): Promise<StockTransaction[]> {
    const { data } = await stockApi.get<StockTransaction[]>("/admin/getalltransactions");
    return data.length ? data : fallbackTransactions;
  },
};
