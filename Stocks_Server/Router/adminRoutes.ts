import express from "express";

import {
    addStock,
    updateStockPrice,
    updateStockQuantity,
    deleteStock,
    getAllUsers,
    getAllTransactions
} from "../Controller/adminController";
import { authenticate, authorizeRoles } from "../Middleware/authMiddleware";

const router = express.Router();

router.use(authenticate, authorizeRoles("admin"));

router.post("/addstock", addStock);

router.put("/updatestockprice", updateStockPrice);

router.put("/updatestockquantity", updateStockQuantity);

router.delete("/deletestock", deleteStock);

router.get("/getallusers", getAllUsers);

router.get("/getalltransactions", getAllTransactions);

export default router;
