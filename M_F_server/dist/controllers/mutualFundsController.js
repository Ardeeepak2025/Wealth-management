"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFunds = listFunds;
exports.getFund = getFund;
exports.createFund = createFund;
exports.getFundAnalytics = getFundAnalytics;
const mutualFundsModel_1 = require("../models/mutualFundsModel");
async function listFunds(_req, res) {
    const funds = await (0, mutualFundsModel_1.getMutualFunds)();
    res.json(funds);
}
async function getFund(req, res) {
    const id = Number(req.params.id);
    const fund = await (0, mutualFundsModel_1.getMutualFundById)(id);
    if (!fund) {
        res.status(404).json({ message: "Fund not found" });
        return;
    }
    res.json(fund);
}
async function createFund(req, res) {
    const { fund_name, fund_type, nav, highest_nav, lowest_nav } = req.body;
    if (!fund_name) {
        res.status(400).json({ message: "fund_name is required" });
        return;
    }
    const id = await (0, mutualFundsModel_1.createMutualFund)({
        fund_name,
        fund_type: fund_type || null,
        nav: nav ?? null,
        highest_nav: highest_nav ?? null,
        lowest_nav: lowest_nav ?? null,
    });
    res.status(201).json({ id, message: "Fund created" });
}
async function getFundAnalytics(_req, res) {
    const analytics = await (0, mutualFundsModel_1.getMutualFundAnalytics)();
    res.json(analytics);
}
