"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHoldings = getHoldings;
exports.getHoldingsByUserId = getHoldingsByUserId;
exports.getHoldingById = getHoldingById;
const db_1 = __importDefault(require("../db"));
async function getHoldings() {
    const { data, error } = await db_1.default.from("mutual_fund_holdings").select("*");
    if (error) {
        throw error;
    }
    return (data ?? []);
}
async function getHoldingsByUserId(userId) {
    const { data, error } = await db_1.default
        .from("mutual_fund_holdings")
        .select("*")
        .eq("user_id", userId);
    if (error) {
        throw error;
    }
    return (data ?? []);
}
async function getHoldingById(id) {
    const { data, error } = await db_1.default
        .from("mutual_fund_holdings")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (error) {
        throw error;
    }
    return data ?? null;
}
