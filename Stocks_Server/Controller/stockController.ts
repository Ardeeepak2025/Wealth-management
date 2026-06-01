import { Request, Response } from "express";
import { supabase } from "../Database/db";

const resolveCompanyName = (stock: Record<string, any>): string => {
  return String(stock.company_name ?? "");
};

const parsePositiveNumber = (value: any): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

type AuthenticatedRequest = Request & {
  user?: {
    id: number;
  };
};

const resolveUserIdFromRequest = (request: Request): number | null => {
  const authRequest = request as AuthenticatedRequest;

  if (authRequest.user?.id) {
    return Number(authRequest.user.id);
  }

  const parsedFromBody = Number(request.body?.user_id || request.body?.id);
  return Number.isFinite(parsedFromBody) && parsedFromBody > 0 ? parsedFromBody : null;
};

const normalizeStockRelation = (stockRelation: any): Record<string, any> | null => {
  if (!stockRelation) {
    return null;
  }

  if (Array.isArray(stockRelation)) {
    return stockRelation[0] || null;
  }

  return stockRelation;
};

const updatePortfolioSummary = async (user_id: number): Promise<void> => {
  const { data: holdings, error: holdingsError } = await supabase
    .from("holdings")
    .select("quantity, total_investment, stocks (current_price)")
    .eq("user_id", user_id);

  if (holdingsError) {
    throw holdingsError;
  }

  let totalInvestment = 0;
  let currentValue = 0;

  (holdings || []).forEach((holding: any) => {
    const stock = normalizeStockRelation(holding.stocks);
    const currentPrice = Number(stock?.current_price || 0);

    totalInvestment += Number(holding.total_investment || 0);
    currentValue += Number(holding.quantity || 0) * currentPrice;
  });

  const totalProfit = currentValue - totalInvestment;

  const { data: existing, error: existingError } = await supabase
    .from("portfolio_summary")
    .select("id")
    .eq("user_id", user_id)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing?.id) {
    const { error } = await supabase
      .from("portfolio_summary")
      .update({
        total_investment: totalInvestment,
        current_value: currentValue,
        total_profit: totalProfit,
        updated_at: new Date(),
      })
      .eq("user_id", user_id);

    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase.from("portfolio_summary").insert({
      user_id,
      total_investment: totalInvestment,
      current_value: currentValue,
      total_profit: totalProfit,
      updated_at: new Date(),
    });

    if (error) {
      throw error;
    }
  }
};

export const getAllStocks = async (_request: Request, response: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from("stocks").select("*");

    if (error) {
      throw error;
    }

    response.status(200).json(data);
  } catch (error: any) {
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getStockById = async (request: Request, response: Response): Promise<void> => {
  try {
    const rawId = request.params.id || request.body.id;
    const id = parsePositiveNumber(rawId);

    if (!id) {
      response.status(400).json({ message: "Valid stock id is required" });
      return;
    }

    const { data, error } = await supabase.from("stocks").select("*").eq("id", id).single();

    if (error) {
      throw error;
    }

    response.status(200).json(data);
  } catch (error: any) {
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getStockByUser = async (request: Request, response: Response): Promise<void> => {
  try {
    const userId = resolveUserIdFromRequest(request);

    if (!userId) {
      response.status(400).json({ message: "Valid user id is required" });
      return;
    }

    const { data, error } = await supabase.from("holdings").select("*").eq("user_id", userId);

    if (error) {
      throw error;
    }

    response.status(200).json(data);
  } catch (error: any) {
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const buyStock = async (request: Request, response: Response): Promise<void> => {
  try {
    const user_id = resolveUserIdFromRequest(request);
    const stock_id = parsePositiveNumber(request.body.stock_id);
    const quantity = parsePositiveNumber(request.body.quantity);

    if (!user_id || !stock_id || !quantity) {
      response.status(400).json({ message: "user_id, stock_id and quantity must be greater than 0" });
      return;
    }

    const { data: stockData, error: stockError } = await supabase
      .from("stocks")
      .select("*")
      .eq("id", stock_id)
      .single();

    if (stockError || !stockData) {
      response.status(404).json({ message: "Stock not found" });
      return;
    }

    if (Number(stockData.available_quantity) < quantity) {
      response.status(400).json({ message: "Insufficient stock quantity" });
      return;
    }

    const bill = quantity * Number(stockData.current_price);

    const { data: walletData, error: walletError } = await supabase
      .from("wallet")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (walletError || !walletData || Number(walletData.balance) < bill) {
      response.status(400).json({ message: "Insufficient wallet balance" });
      return;
    }

    const { error: walletUpdateError } = await supabase
      .from("wallet")
      .update({ balance: Number(walletData.balance) - bill, updated_at: new Date() })
      .eq("user_id", user_id);

    if (walletUpdateError) {
      throw walletUpdateError;
    }

    const { error: stockUpdateError } = await supabase
      .from("stocks")
      .update({ available_quantity: Number(stockData.available_quantity) - quantity, updated_at: new Date() })
      .eq("id", stock_id);

    if (stockUpdateError) {
      throw stockUpdateError;
    }

    const { data: holdingData, error: holdingError } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", user_id)
      .eq("stock_id", stock_id)
      .maybeSingle();

    if (holdingError) {
      throw holdingError;
    }

    if (holdingData) {
      const newQuantity = Number(holdingData.quantity) + quantity;
      const totalInvestment = Number(holdingData.total_investment) + bill;
      const averagePrice = totalInvestment / newQuantity;
      const currentValue = newQuantity * Number(stockData.current_price);
      const profitLoss = currentValue - totalInvestment;

      const { error } = await supabase
        .from("holdings")
        .update({
          quantity: newQuantity,
          average_buy_price: averagePrice,
          total_investment: totalInvestment,
          profit_loss: profitLoss,
          updated_at: new Date(),
        })
        .eq("id", Number(holdingData.id));

      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from("holdings").insert({
        user_id,
        stock_id,
        quantity,
        average_buy_price: Number(stockData.current_price),
        total_investment: bill,
        profit_loss: 0,
        updated_at: new Date(),
      });

      if (error) {
        throw error;
      }
    }

    const { error: txError } = await supabase.from("transactions").insert({
      user_id,
      stock_id,
      transaction_type: "BUY",
      quantity,
      price: Number(stockData.current_price),
      total_amount: bill,
      created_at: new Date(),
    });

    if (txError) {
      throw txError;
    }

    await updatePortfolioSummary(user_id);

    response.status(200).json({ message: "Stock purchased successfully" });
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const sellStock = async (request: Request, response: Response): Promise<void> => {
  try {
    const user_id = resolveUserIdFromRequest(request);
    const stock_id = parsePositiveNumber(request.body.stock_id);
    const quantity = parsePositiveNumber(request.body.quantity);

    if (!user_id || !stock_id || !quantity) {
      response.status(400).json({ message: "user_id, stock_id and quantity must be greater than 0" });
      return;
    }

    const { data: stockData, error: stockError } = await supabase
      .from("stocks")
      .select("*")
      .eq("id", stock_id)
      .single();

    if (stockError || !stockData) {
      response.status(404).json({ message: "Stock not found" });
      return;
    }

    const { data: holdingData, error: holdingError } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", user_id)
      .eq("stock_id", stock_id)
      .maybeSingle();

    if (holdingError || !holdingData) {
      response.status(400).json({ message: "Holding not found" });
      return;
    }

    if (Number(holdingData.quantity) < quantity) {
      response.status(400).json({ message: "Insufficient holding quantity" });
      return;
    }

    const totalAmount = Number(stockData.current_price) * quantity;
    const remainingQuantity = Number(holdingData.quantity) - quantity;

    if (remainingQuantity === 0) {
      const { error } = await supabase.from("holdings").delete().eq("id", Number(holdingData.id));

      if (error) {
        throw error;
      }
    } else {
      const remainingInvestment = Number(holdingData.average_buy_price) * remainingQuantity;
      const profitLoss = remainingQuantity * Number(stockData.current_price) - remainingInvestment;

      const { error } = await supabase
        .from("holdings")
        .update({
          quantity: remainingQuantity,
          total_investment: remainingInvestment,
          profit_loss: profitLoss,
          updated_at: new Date(),
        })
        .eq("id", Number(holdingData.id));

      if (error) {
        throw error;
      }
    }

    const { error: stockUpdateError } = await supabase
      .from("stocks")
      .update({ available_quantity: Number(stockData.available_quantity) + quantity, updated_at: new Date() })
      .eq("id", stock_id);

    if (stockUpdateError) {
      throw stockUpdateError;
    }

    const { data: walletData, error: walletFetchError } = await supabase
      .from("wallet")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (walletFetchError || !walletData) {
      throw walletFetchError || new Error("Wallet not found");
    }

    const { error: walletUpdateError } = await supabase
      .from("wallet")
      .update({ balance: Number(walletData.balance) + totalAmount, updated_at: new Date() })
      .eq("user_id", user_id);

    if (walletUpdateError) {
      throw walletUpdateError;
    }

    const { error: txError } = await supabase.from("transactions").insert({
      user_id,
      stock_id,
      transaction_type: "SELL",
      quantity,
      price: Number(stockData.current_price),
      total_amount: totalAmount,
      created_at: new Date(),
    });

    if (txError) {
      throw txError;
    }

    await updatePortfolioSummary(user_id);

    response.status(200).json({ message: "Stock sold successfully" });
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getOverallWorstStock = async (_request: Request, response: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .order("current_price", { ascending: true })
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    response.status(200).json(data);
  } catch (error: any) {
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getOverallBestStock = async (_request: Request, response: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .order("current_price", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    response.status(200).json(data);
  } catch (error: any) {
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getUserHoldings = async (request: Request, response: Response): Promise<void> => {
  try {
    const user_id = resolveUserIdFromRequest(request);

    if (!user_id) {
      response.status(400).json({ message: "Valid user id is required" });
      return;
    }

    const { data, error } = await supabase
      .from("holdings")
      .select(
        `
          id, quantity, average_buy_price, total_investment, profit_loss, updated_at,
          stocks (*)
        `,
      )
      .eq("user_id", user_id);

    if (error) {
      throw error;
    }

    const result = (data || [])
      .map((holding: any) => {
        const stock = normalizeStockRelation(holding.stocks);
        return {
          id: holding.id,
          stock_id: stock?.id || null,
          symbol: stock?.symbol || null,
          company_name: stock ? resolveCompanyName(stock) : null,
          sector: stock?.sector || null,
          current_price: Number(stock?.current_price || 0),
          highest_price: Number(stock?.highest_price || 0),
          lowest_price: Number(stock?.lowest_price || 0),
          quantity: Number(holding.quantity || 0),
          average_buy_price: Number(holding.average_buy_price || 0),
          total_investment: Number(holding.total_investment || 0),
          profit_loss: Number(holding.profit_loss || 0),
          current_value: Number(holding.quantity || 0) * Number(stock?.current_price || 0),
        };
      })
      .sort((a, b) => b.profit_loss - a.profit_loss);

    response.status(200).json(result);
  } catch (error: any) {
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getDashboardSummary = async (request: Request, response: Response): Promise<void> => {
  try {
    const user_id = resolveUserIdFromRequest(request);

    if (!user_id) {
      response.status(400).json({ message: "Valid user id is required" });
      return;
    }

    const { data: walletData, error: walletError } = await supabase
      .from("wallet")
      .select("balance")
      .eq("user_id", user_id)
      .maybeSingle();

    if (walletError) {
      throw walletError;
    }

    const walletBalance = walletData ? Number(walletData.balance) : 0;

    const { data: portfolioData, error: portfolioError } = await supabase
      .from("portfolio_summary")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (portfolioError) {
      throw portfolioError;
    }

    const totalInvestment = portfolioData ? Number(portfolioData.total_investment) : 0;
    const totalStockValue = portfolioData ? Number(portfolioData.current_value) : 0;
    const totalProfitLoss = portfolioData ? Number(portfolioData.total_profit) : 0;
    const netWorth = walletBalance + totalStockValue;

    const { data: bestHolding, error: bestHoldingError } = await supabase
      .from("holdings")
      .select("quantity, total_investment, profit_loss, average_buy_price, stocks (*)")
      .eq("user_id", user_id)
      .order("profit_loss", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (bestHoldingError) {
      throw bestHoldingError;
    }

    const { data: worstHolding, error: worstHoldingError } = await supabase
      .from("holdings")
      .select("quantity, total_investment, profit_loss, average_buy_price, stocks (*)")
      .eq("user_id", user_id)
      .order("profit_loss", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (worstHoldingError) {
      throw worstHoldingError;
    }

    const { count: totalHoldings, error: holdingsCountError } = await supabase
      .from("holdings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id);

    if (holdingsCountError) {
      throw holdingsCountError;
    }

    const { data: recentTransactions, error: transactionError } = await supabase
      .from("transactions")
      .select("id, transaction_type, quantity, price, total_amount, created_at, stocks (*)")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (transactionError) {
      throw transactionError;
    }

    const bestStock = normalizeStockRelation(bestHolding?.stocks);
    const worstStock = normalizeStockRelation(worstHolding?.stocks);

    response.status(200).json({
      walletBalance,
      totalInvestment,
      totalStockValue,
      netWorth,
      totalProfitLoss,
      totalHoldings: totalHoldings || 0,
      mostPerformingStock: bestHolding
        ? {
            id: bestStock?.id || null,
            symbol: bestStock?.symbol || null,
            company_name: bestStock ? resolveCompanyName(bestStock) : null,
            sector: bestStock?.sector || null,
            current_price: Number(bestStock?.current_price || 0),
            quantity: Number(bestHolding.quantity || 0),
            average_buy_price: Number(bestHolding.average_buy_price || 0),
            total_investment: Number(bestHolding.total_investment || 0),
            profit_loss: Number(bestHolding.profit_loss || 0),
          }
        : null,
      leastPerformingStock: worstHolding
        ? {
            id: worstStock?.id || null,
            symbol: worstStock?.symbol || null,
            company_name: worstStock ? resolveCompanyName(worstStock) : null,
            sector: worstStock?.sector || null,
            current_price: Number(worstStock?.current_price || 0),
            quantity: Number(worstHolding.quantity || 0),
            average_buy_price: Number(worstHolding.average_buy_price || 0),
            total_investment: Number(worstHolding.total_investment || 0),
            profit_loss: Number(worstHolding.profit_loss || 0),
          }
        : null,
      recentTransactions: (recentTransactions || []).map((transaction: any) => {
        const stock = normalizeStockRelation(transaction.stocks);
        return {
          id: transaction.id,
          transaction_type: transaction.transaction_type,
          quantity: Number(transaction.quantity || 0),
          price: Number(transaction.price || 0),
          total_amount: Number(transaction.total_amount || 0),
          created_at: transaction.created_at,
          symbol: stock?.symbol || null,
          company_name: stock ? resolveCompanyName(stock) : null,
        };
      }),
    });
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getPortfolioDistribution = async (request: Request, response: Response): Promise<void> => {
  try {
    const user_id = resolveUserIdFromRequest(request);

    if (!user_id) {
      response.status(400).json({ message: "Valid user id is required" });
      return;
    }

    const { data, error } = await supabase
      .from("holdings")
      .select("quantity, stocks (*)")
      .eq("user_id", user_id);

    if (error) {
      throw error;
    }

    const result = (data || [])
      .map((holding: any) => {
        const stock = normalizeStockRelation(holding.stocks);
        return {
          id: stock?.id || null,
          symbol: stock?.symbol || null,
          company_name: stock ? resolveCompanyName(stock) : null,
          sector: stock?.sector || null,
          quantity: Number(holding.quantity || 0),
          current_price: Number(stock?.current_price || 0),
          total_value: Number(holding.quantity || 0) * Number(stock?.current_price || 0),
        };
      })
      .sort((a, b) => b.total_value - a.total_value);

    response.status(200).json(result);
  } catch (error: any) {
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getTopGainers = async (_request: Request, response: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .order("current_price", { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    response.status(200).json(data);
  } catch (error: any) {
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getTopLosers = async (_request: Request, response: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .order("current_price", { ascending: true })
      .limit(10);

    if (error) {
      throw error;
    }

    response.status(200).json(data);
  } catch (error: any) {
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getLeaderboard = async (_request: Request, response: Response): Promise<void> => {
  try {
    const { data: users, error } = await supabase.from("users").select("id, name");

    if (error) {
      throw error;
    }

    const leaderboard = await Promise.all(
      (users || []).map(async (user: any) => {
        const [{ data: wallet }, { data: portfolio }] = await Promise.all([
          supabase.from("wallet").select("balance").eq("user_id", Number(user.id)).maybeSingle(),
          supabase
            .from("portfolio_summary")
            .select("current_value")
            .eq("user_id", Number(user.id))
            .maybeSingle(),
        ]);

        const walletBalance = wallet ? Number(wallet.balance) : 0;
        const stockValue = portfolio ? Number(portfolio.current_value) : 0;

        return {
          id: Number(user.id),
          name: String(user.name || ""),
          wallet_balance: walletBalance,
          stock_value: stockValue,
          net_worth: walletBalance + stockValue,
        };
      }),
    );

    leaderboard.sort((a, b) => b.net_worth - a.net_worth);
    response.status(200).json(leaderboard.slice(0, 10));
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ message: error.message || "Internal server error" });
  }
};

//////////////////////////////////////////////////////////////
export const getStockInfoById = async (
  request: Request,
  response: Response
): Promise<void> => {
  try {

    const stock_id = request.body?.stock_id || request.query?.stock_id || request.params?.id;

    if (!parsePositiveNumber(stock_id)) {
      response.status(400).json({
        message: "Valid stock_id is required",
      });
      return;
    }

    // GET STOCK DETAILS
    const { data: stockData, error: stockError } = await supabase
      .from("stocks")
      .select("*")
      .eq("id", Number(stock_id))
      .single();

    if (stockError || !stockData) {
      response.status(404).json({
        message: "Stock not found",
      });
      return;
    }

    // GET PRICE HISTORY
    const { data: historyData, error: historyError } = await supabase
      .from("stock_price_history")
      .select(`
        id,
        old_price,
        new_price,
        change_amount,
        change_percent,
        created_at
      `)
      .eq("stock_id", Number(stock_id))
      .order("created_at", { ascending: true });

    if (historyError) {
      throw historyError;
    }

    response.status(200).json({
      message: "Stock info fetched successfully",

      stock: stockData,

      graph_data: historyData
    });

  } catch (error: any) {

    console.log(error);

    response.status(500).json({
      message: error.message || "Internal server error",
    });

  }
};
