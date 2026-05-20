"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMutualFunds = getMutualFunds;
exports.getMutualFundById = getMutualFundById;
exports.getMutualFundAnalytics = getMutualFundAnalytics;
exports.createMutualFund = createMutualFund;
const db_1 = __importDefault(require("../db"));
async function getMutualFunds() {
    const { data, error } = await db_1.default.from("mutual_funds").select("*");
    if (error) {
        throw error;
    }
    return (data ?? []);
}
async function getMutualFundById(id) {
    const { data, error } = await db_1.default
        .from("mutual_funds")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    if (error) {
        throw error;
    }
    return data ?? null;
}
function toNumber(value) {
    return value === null ? null : Number(value);
}
function average(values) {
    const numericValues = values.filter((value) => value !== null);
    if (numericValues.length === 0) {
        return null;
    }
    const total = numericValues.reduce((sum, value) => sum + value, 0);
    return total / numericValues.length;
}
async function getMutualFundAnalytics() {
    const funds = await getMutualFunds();
    const overview = {
        total_funds: funds.length,
        funds_with_nav: funds.filter((fund) => fund.nav !== null).length,
        average_nav: average(funds.map((fund) => toNumber(fund.nav))),
        highest_nav: funds.reduce((currentHighest, fund) => {
            if (fund.nav === null) {
                return currentHighest;
            }
            if (currentHighest === null || fund.nav > currentHighest) {
                return fund.nav;
            }
            return currentHighest;
        }, null),
        lowest_nav: funds.reduce((currentLowest, fund) => {
            if (fund.nav === null) {
                return currentLowest;
            }
            if (currentLowest === null || fund.nav < currentLowest) {
                return fund.nav;
            }
            return currentLowest;
        }, null),
        average_highest_nav: average(funds.map((fund) => toNumber(fund.highest_nav))),
        average_lowest_nav: average(funds.map((fund) => toNumber(fund.lowest_nav))),
    };
    const byTypeMap = new Map();
    for (const fund of funds) {
        const fundType = fund.fund_type?.trim() || "Uncategorized";
        const current = byTypeMap.get(fundType) ?? {
            fund_type: fundType,
            fund_count: 0,
            total_nav: 0,
            average_nav: null,
            highest_nav: null,
            lowest_nav: null,
        };
        current.fund_count += 1;
        if (fund.nav !== null) {
            current.total_nav += fund.nav;
            current.highest_nav =
                current.highest_nav === null || fund.nav > current.highest_nav
                    ? fund.nav
                    : current.highest_nav;
            current.lowest_nav =
                current.lowest_nav === null || fund.nav < current.lowest_nav
                    ? fund.nav
                    : current.lowest_nav;
        }
        byTypeMap.set(fundType, current);
    }
    const byType = Array.from(byTypeMap.values()).map((item) => ({
        ...item,
        average_nav: item.fund_count === 0 ? null : item.total_nav / item.fund_count,
    }));
    const detailedFunds = funds.map((fund) => {
        const hasRange = fund.highest_nav !== null && fund.lowest_nav !== null;
        const highestNav = fund.highest_nav;
        const lowestNav = fund.lowest_nav;
        let navPosition = null;
        if (hasRange && fund.nav !== null && highestNav !== null && lowestNav !== null) {
            if (fund.nav < lowestNav) {
                navPosition = "below_lowest";
            }
            else if (fund.nav > highestNav) {
                navPosition = "above_highest";
            }
            else {
                navPosition = "within_range";
            }
        }
        return {
            ...fund,
            nav_spread: hasRange && highestNav !== null && lowestNav !== null
                ? highestNav - lowestNav
                : null,
            nav_position: navPosition,
        };
    });
    return {
        overview,
        by_type: byType,
        funds: detailedFunds,
    };
}
async function createMutualFund(data) {
    const { data: insertedRows, error } = await db_1.default
        .from("mutual_funds")
        .insert({
        fund_name: data.fund_name,
        fund_type: data.fund_type,
        nav: data.nav,
        highest_nav: data.highest_nav,
        lowest_nav: data.lowest_nav,
    })
        .select("id")
        .single();
    if (error) {
        throw error;
    }
    return insertedRows.id;
}
