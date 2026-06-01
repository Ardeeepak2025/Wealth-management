"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProperty = createProperty;
exports.getProperty = getProperty;
exports.listProperties = listProperties;
exports.addValuation = addValuation;
exports.listValuations = listValuations;
exports.addRental = addRental;
exports.listRentals = listRentals;
exports.investorPortfolio = investorPortfolio;
const model = __importStar(require("./realEstateModel"));
const axios_1 = __importDefault(require("axios"));
async function createProperty(req, res) {
    try {
        const ownerId = req.body.owner_id || req.user?.id;
        if (!ownerId)
            return res.status(400).json({ message: "owner_id required" });
        // if creating for another user, require admin
        if (ownerId !== req.user?.id && req.user?.role !== "ADMIN") {
            return res.status(403).json({ message: "Admin required to create property for other users" });
        }
        const payload = {
            owner_id: ownerId,
            title: String(req.body.title || "Untitled property"),
            address: req.body.address || null,
            description: req.body.description || null,
            metadata: req.body.metadata || null,
        };
        const created = await model.createProperty(payload);
        res.status(201).json(created);
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Failed to create property" });
    }
}
async function getProperty(req, res) {
    try {
        const id = String(req.params.id);
        const p = await model.getPropertyById(id);
        if (!p)
            return res.status(404).json({ message: "Not found" });
        res.json(p);
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Failed to fetch property" });
    }
}
async function listProperties(req, res) {
    try {
        const ownerId = String(req.query.ownerId || req.user?.id);
        if (!ownerId)
            return res.status(400).json({ message: "ownerId required" });
        const list = await model.listPropertiesByOwner(ownerId);
        res.json(list);
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Failed to list properties" });
    }
}
async function addValuation(req, res) {
    try {
        const propertyId = String(req.params.id);
        const prop = await model.getPropertyById(propertyId);
        if (!prop)
            return res.status(404).json({ message: "Property not found" });
        // only owner or admin
        if (String(prop.owner_id) !== String(req.user?.id) && req.user?.role !== "ADMIN") {
            return res.status(403).json({ message: "Not allowed" });
        }
        const val = await model.addValuation({
            property_id: propertyId,
            amount: Number(req.body.amount),
            currency: req.body.currency || "INR",
            recorded_at: req.body.recorded_at || new Date().toISOString(),
            source: req.body.source || null,
            notes: req.body.notes || null,
        });
        res.status(201).json(val);
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Failed to add valuation" });
    }
}
async function listValuations(req, res) {
    try {
        const propertyId = String(req.params.id);
        const vals = await model.listValuations(propertyId);
        res.json(vals);
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Failed to list valuations" });
    }
}
async function addRental(req, res) {
    try {
        const propertyId = String(req.params.id);
        const prop = await model.getPropertyById(propertyId);
        if (!prop)
            return res.status(404).json({ message: "Property not found" });
        if (String(prop.owner_id) !== String(req.user?.id) && req.user?.role !== "ADMIN") {
            return res.status(403).json({ message: "Not allowed" });
        }
        const rent = await model.addRental({
            property_id: propertyId,
            amount: Number(req.body.amount),
            currency: req.body.currency || "INR",
            start_date: req.body.start_date || null,
            end_date: req.body.end_date || null,
            tenant: req.body.tenant || null,
            recorded_at: req.body.recorded_at || new Date().toISOString(),
        });
        res.status(201).json(rent);
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Failed to add rental" });
    }
}
async function listRentals(req, res) {
    try {
        const propertyId = String(req.params.id);
        const rents = await model.listRentals(propertyId);
        res.json(rents);
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Failed to list rentals" });
    }
}
async function investorPortfolio(req, res) {
    try {
        const investorId = String(req.params.investorId || req.user?.id);
        if (!investorId)
            return res.status(400).json({ message: "investorId required" });
        const properties = await model.listPropertiesByOwner(investorId);
        const enriched = await Promise.all(properties.map(async (p) => {
            const latestVal = await model.getLatestValuation(p.id);
            const rentalSum = await model.sumRentalIncome(p.id);
            return {
                property: p,
                latestValuation: latestVal,
                totalRentalIncome: rentalSum,
            };
        }));
        // attempt to fetch downstream holdings (best-effort)
        const mfPromise = axios_1.default.get(`${process.env.MF_URL}/api/users/${investorId}/holdings`).then(r => r.data).catch(() => null);
        const stocksPromise = axios_1.default.get(`${process.env.STOCKS_URL}/users/${investorId}/holdings`).then(r => r.data).catch(() => null);
        const [mfHoldings, stockHoldings] = await Promise.all([mfPromise, stocksPromise]);
        const realEstateTotal = enriched.reduce((s, e) => s + Number(e.latestValuation?.amount || 0), 0);
        const otherTotal = (mfHoldings?.totalValue || 0) + (stockHoldings?.totalValue || 0);
        const totalWealth = realEstateTotal + Number(otherTotal || 0);
        res.json({
            investorId,
            realEstate: enriched,
            mutualFunds: mfHoldings,
            stocks: stockHoldings,
            totals: { realEstateTotal, otherTotal, totalWealth },
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Failed to compute portfolio" });
    }
}
