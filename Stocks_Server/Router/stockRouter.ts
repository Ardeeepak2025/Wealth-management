import express from "express";
import { authenticate } from "../Middleware/authMiddleware";

import {
    getAllStocks,
    getStockById,
    getStockByUser,
    buyStock,
    sellStock,
    getOverallWorstStock,
    getOverallBestStock,
    getUserHoldings,
    getDashboardSummary,
    getPortfolioDistribution,
    getTopGainers,
    getTopLosers,
    getLeaderboard,
    getStockInfoById
} from "../Controller/stockController";

const router = express.Router();

router.get("/getallstocks", getAllStocks);



router.get("/getstockbyid/:id", getStockById);
router.get("/getstockbyid", getStockInfoById);

router.post("/getstockbyuser", authenticate, getStockByUser);

router.post("/buystock", authenticate, buyStock);

router.post("/sellstock", authenticate, sellStock);

router.get("/getoverallworststock", getOverallWorstStock);

router.get("/getoverallbeststock", getOverallBestStock);

router.post("/getuserholdings", authenticate, getUserHoldings);

router.post("/getdashboardsummary", authenticate, getDashboardSummary);

router.post("/getportfoliodistribution", authenticate, getPortfolioDistribution);

router.get("/gettopgainers", getTopGainers);

router.get("/gettoplosers", getTopLosers);

router.get("/getleaderboard", getLeaderboard);

export default router;
