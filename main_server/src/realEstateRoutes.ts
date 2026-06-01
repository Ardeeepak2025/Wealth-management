import express from "express";
import * as ctrl from "./realEstateController";
import { jwtMiddleware } from "./middleware/jwt";

const router = express.Router();

// Protected routes - require JWT
router.post("/properties", jwtMiddleware, ctrl.createProperty);
router.get("/properties/:id", jwtMiddleware, ctrl.getProperty);
router.get("/properties", jwtMiddleware, ctrl.listProperties);
router.post("/properties/:id/valuation", jwtMiddleware, ctrl.addValuation);
router.get("/properties/:id/valuations", jwtMiddleware, ctrl.listValuations);
router.post("/properties/:id/rent", jwtMiddleware, ctrl.addRental);
router.get("/properties/:id/rents", jwtMiddleware, ctrl.listRentals);

// Aggregation endpoint for investor-level portfolio
router.get("/investor/:investorId/portfolio", jwtMiddleware, ctrl.investorPortfolio);

export default router;
