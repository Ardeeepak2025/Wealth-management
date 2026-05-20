"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listHoldings = listHoldings;
exports.getHolding = getHolding;
const holdingsModel_1 = require("../models/holdingsModel");
async function listHoldings(req, res) {
    const userId = req.query.userId ? Number(req.query.userId) : null;
    if (userId) {
        const holdings = await (0, holdingsModel_1.getHoldingsByUserId)(userId);
        res.json(holdings);
        return;
    }
    const holdings = await (0, holdingsModel_1.getHoldings)();
    res.json(holdings);
}
async function getHolding(req, res) {
    const id = Number(req.params.id);
    const holding = await (0, holdingsModel_1.getHoldingById)(id);
    if (!holding) {
        res.status(404).json({ message: "Holding not found" });
        return;
    }
    res.json(holding);
}
