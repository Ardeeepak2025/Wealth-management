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
const express_1 = __importDefault(require("express"));
const ctrl = __importStar(require("./realEstateController"));
const jwt_1 = require("./middleware/jwt");
const router = express_1.default.Router();
// Protected routes - require JWT
router.post("/properties", jwt_1.jwtMiddleware, ctrl.createProperty);
router.get("/properties/:id", jwt_1.jwtMiddleware, ctrl.getProperty);
router.get("/properties", jwt_1.jwtMiddleware, ctrl.listProperties);
router.post("/properties/:id/valuation", jwt_1.jwtMiddleware, ctrl.addValuation);
router.get("/properties/:id/valuations", jwt_1.jwtMiddleware, ctrl.listValuations);
router.post("/properties/:id/rent", jwt_1.jwtMiddleware, ctrl.addRental);
router.get("/properties/:id/rents", jwt_1.jwtMiddleware, ctrl.listRentals);
// Aggregation endpoint for investor-level portfolio
router.get("/investor/:investorId/portfolio", jwt_1.jwtMiddleware, ctrl.investorPortfolio);
exports.default = router;
