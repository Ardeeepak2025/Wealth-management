"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = getSummary;
const summaryModel_1 = require("../models/summaryModel");
async function getSummary(req, res) {
    const userId = Number(req.params.userId);
    const summary = await (0, summaryModel_1.getSummaryByUserId)(userId);
    if (!summary) {
        res.status(404).json({ message: "Summary not found" });
        return;
    }
    res.json(summary);
}
