import { Request, Response } from "express";
import { supabase } from "../Database/db";

const toPositiveNumber = (value: any): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export const addStock = async (request: Request, response: Response): Promise<void> => {
  try {
    const { symbol, company_name, current_price, highest_price, lowest_price, available_quantity, sector } = request.body;

    const resolvedSymbol = String(symbol || "").trim().toUpperCase();
    const resolvedCompanyName = String(company_name || "").trim();

    if (!resolvedSymbol || !resolvedCompanyName) {
      response.status(400).json({ message: "symbol and company_name are required" });
      return;
    }

    if (!toPositiveNumber(current_price) || !toPositiveNumber(available_quantity)) {
      response.status(400).json({ message: "current_price and available_quantity must be greater than 0" });
      return;
    }

    const parsedCurrentPrice = Number(current_price);
    const parsedHighestPrice = Number(highest_price || current_price);
    const parsedLowestPrice = Number(lowest_price || current_price);

    const { error } = await supabase.from("stocks").insert({
      symbol: resolvedSymbol,
      company_name: resolvedCompanyName,
      current_price: parsedCurrentPrice,
      highest_price: parsedHighestPrice,
      lowest_price: parsedLowestPrice,
      available_quantity: Number(available_quantity),
      sector: String(sector || "Others"),
      day_change_percent: 0,
      created_at: new Date(),
      updated_at: new Date(),
    });

    if (error) {
      throw error;
    }

    response.status(201).json({ message: "Stock added successfully" });
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateStockPrice = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {
    const { stock_id, current_price, updated_by } = request.body;

    if (!toPositiveNumber(stock_id) || !toPositiveNumber(current_price)) {
      response.status(400).json({
        message: "stock_id and current_price must be greater than 0",
      });
      return;
    }

    // GET CURRENT STOCK DATA
    const { data: stockData, error: stockError } = await supabase
      .from("stocks")
      .select("id, current_price, highest_price, lowest_price")
      .eq("id", Number(stock_id))
      .single();

    if (stockError || !stockData) {
      response.status(404).json({
        message: "Stock not found",
      });
      return;
    }

    const oldPrice = Number(stockData.current_price || 0);
    const newPrice = Number(current_price);

    const highestPrice = Math.max(
      Number(stockData.highest_price || newPrice),
      newPrice
    );

    const lowestPrice = Math.min(
      Number(stockData.lowest_price || newPrice),
      newPrice
    );

    const changeAmount = newPrice - oldPrice;

    const dayChangePercent =
      oldPrice > 0
        ? ((newPrice - oldPrice) / oldPrice) * 100
        : 0;

    // UPDATE STOCK TABLE
    const { error: updateError } = await supabase
      .from("stocks")
      .update({
        current_price: newPrice,
        highest_price: highestPrice,
        lowest_price: lowestPrice,
        day_change_percent: Number(dayChangePercent.toFixed(2)),
        updated_at: new Date(),
      })
      .eq("id", Number(stock_id));

    if (updateError) {
      throw updateError;
    }

    // INSERT PRICE HISTORY
    const { error: historyError } = await supabase
      .from("stock_price_history")
      .insert([
        {
          stock_id: Number(stock_id),
          old_price: oldPrice,
          new_price: newPrice,
          change_amount: Number(changeAmount.toFixed(2)),
          change_percent: Number(dayChangePercent.toFixed(2)),
          updated_by: updated_by || "admin",
          created_at: new Date(),
        },
      ]);

    if (historyError) {
      throw historyError;
    }

    response.status(200).json({
      message: "Stock updated successfully",
      data: {
        stock_id,
        old_price: oldPrice,
        new_price: newPrice,
        change_amount: Number(changeAmount.toFixed(2)),
        change_percent: Number(dayChangePercent.toFixed(2)),
      },
    });
  } catch (error: any) {
    console.log(error);

    response.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

export const updateStockQuantity = async (request: Request, response: Response): Promise<void> => {
  try {
    const { stock_id, available_quantity } = request.body;

    if (!toPositiveNumber(stock_id) || !toPositiveNumber(available_quantity)) {
      response.status(400).json({ message: "stock_id and available_quantity must be greater than 0" });
      return;
    }

    const { error } = await supabase
      .from("stocks")
      .update({ available_quantity, updated_at: new Date() })
      .eq("id", Number(stock_id));

    if (error) {
      throw error;
    }

    response.status(200).json({ message: "Quantity updated successfully" });
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteStock = async (request: Request, response: Response): Promise<void> => {
  try {
    const stock_id = Number(request.body.stock_id);

    if (!toPositiveNumber(stock_id)) {
      response.status(400).json({ message: "Valid stock_id is required" });
      return;
    }

    const { error } = await supabase.from("stocks").delete().eq("id", stock_id);

    if (error) {
      throw error;
    }

    response.status(200).json({ message: "Stock deleted successfully" });
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllUsers = async (_request: Request, response: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from("users").select("id, name, email, role");

    if (error) {
      throw error;
    }

    response.status(200).json(data);
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllTransactions = async (_request: Request, response: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
          id, transaction_type, quantity, price, total_amount, created_at,
          users (name),
          stocks (symbol, company_name)
        `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const result = (data || []).map((transaction: any) => ({
      id: transaction.id,
      name: transaction.users?.name || null,
      symbol: transaction.stocks?.symbol || null,
      company_name: transaction.stocks?.company_name || null,
      transaction_type: transaction.transaction_type,
      quantity: transaction.quantity,
      price: transaction.price,
      total_amount: transaction.total_amount,
      created_at: transaction.created_at,
    }));

    response.status(200).json(result);
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};
