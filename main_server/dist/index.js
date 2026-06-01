"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_2 = require("express");
const proxy_1 = require("./proxy");
const auth_1 = __importDefault(require("./auth"));
const jwt_1 = require("./middleware/jwt");
const requestId_1 = require("./middleware/requestId");
const requestLogger_1 = require("./middleware/requestLogger");
const auditLogger_1 = require("./middleware/auditLogger");
const rateLimiter_1 = require("./middleware/rateLimiter");
const errorHandler_1 = require("./middleware/errorHandler");
const redis_1 = require("./redis");
const realEstateRoutes_1 = __importDefault(require("./realEstateRoutes"));
dotenv_1.default.config();
const MF_URL = process.env.MF_URL || "http://localhost:3001";
const STOCKS_URL = process.env.STOCKS_URL || "http://localhost:3000";
const PORT = Number(process.env.MAIN_PORT || 4000);
const app = (0, express_1.default)();
// Request tracking and logging
app.use(requestId_1.requestIdMiddleware);
app.use(requestLogger_1.requestLogger);
app.use(auditLogger_1.auditLogger);
// capture raw body for HMAC verification
app.use((0, express_2.json)({
    verify: (req, _res, buf) => {
        req.rawBody = buf ? buf.toString("utf8") : "";
    },
}));
app.use((0, express_2.urlencoded)({
    extended: true,
    verify: (req, _res, buf) => {
        req.rawBody = buf ? buf.toString("utf8") : "";
    },
}));
app.use((0, cors_1.default)());
// Rate limiting
app.use((0, rateLimiter_1.createRateLimiter)(60000, 100)); // 100 requests per minute
app.get("/health", (_req, res) => res.json({ status: "ok" }));
// Auth routes (login)
app.use("/auth", auth_1.default);
// Real-estate asset management
app.use("/real-estate", realEstateRoutes_1.default);
// Proxy routes with JWT auth and authorization checks (main_server handles authN/authZ)
// Routes: /api/mf -> proxies to MF_URL, /api/stocks -> proxies to STOCKS_URL
// Admin routes (*/admin/*) require admin role; user routes require user or admin role.
app.use("/api/mf", jwt_1.jwtMiddleware, (req, res, next) => {
    // /api/mf/admin/* requires admin role
    if (req.path.startsWith("/admin") && req.user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin privileges required" });
    }
    next();
}, (0, proxy_1.createProxyHandler)(MF_URL));
const authorizeStocksRequest = (req, res, next) => {
    // /api/stocks/admin requires admin role
    if (req.path.startsWith("/admin") && req.user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin privileges required" });
    }
    next();
};
app.use("/api/stocks", jwt_1.jwtMiddleware, authorizeStocksRequest, (0, proxy_1.createProxyHandler)(STOCKS_URL, "/stocks"));
app.use("/stocks", jwt_1.jwtMiddleware, authorizeStocksRequest, (0, proxy_1.createProxyHandler)(STOCKS_URL, "/stocks"));
// Generic 404
app.use((_req, res) => res.status(404).json({ message: "Not found" }));
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
async function start() {
    const redisClient = await (0, redis_1.initializeRedis)();
    app.listen(PORT, () => {
        console.log(`Main server listening on port ${PORT}`);
        console.log(`Proxy /api/mf -> ${MF_URL}`);
        console.log(`Proxy /api/stocks -> ${STOCKS_URL}`);
        if (redisClient) {
            console.log("Redis rate limiting enabled");
        }
        else if (process.env.REDIS_URL) {
            console.log("Redis was configured but unavailable; falling back to in-memory rate limiting");
        }
        else {
            console.log("Redis not configured; using in-memory rate limiting");
        }
    });
}
start().catch((error) => {
    console.error("Failed to start main server:", error);
    process.exit(1);
});
