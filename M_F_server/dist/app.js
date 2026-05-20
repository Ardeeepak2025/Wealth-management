"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const mutualFundsRoutes_1 = __importDefault(require("./routes/mutualFundsRoutes"));
const holdingsRoutes_1 = __importDefault(require("./routes/holdingsRoutes"));
const transactionsRoutes_1 = __importDefault(require("./routes/transactionsRoutes"));
const summaryRoutes_1 = __importDefault(require("./routes/summaryRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const requestId_1 = require("./middleware/requestId");
const requestLogger_1 = require("./middleware/requestLogger");
const rateLimiter_1 = require("./middleware/rateLimiter");
const cors_1 = require("./middleware/cors");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Request tracking and logging
app.use(requestId_1.requestIdMiddleware);
app.use(requestLogger_1.requestLogger);
// Body parsing
app.use(express_1.default.json());
// CORS
app.use((0, cors_1.corsMiddleware)());
// Rate limiting
app.use((0, rateLimiter_1.createRateLimiter)(60000, 100)); // 100 requests per minute
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/users", usersRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/mutual-funds", mutualFundsRoutes_1.default);
app.use("/api/holdings", holdingsRoutes_1.default);
app.use("/api/transactions", transactionsRoutes_1.default);
app.use("/api/summary", summaryRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
exports.default = app;
