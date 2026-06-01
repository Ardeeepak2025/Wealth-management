"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummaryByUserId = getSummaryByUserId;
const db_1 = __importDefault(require("../db"));
async function getSummaryByUserId(userId) {
    const { data, error } = await db_1.default
        .from("mutual_fund_summary")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
    if (error) {
        throw error;
    }
    return data ?? null;
}
