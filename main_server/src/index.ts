import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { json, urlencoded } from "express";
import { createProxyHandler } from "./proxy";
import authRouter from "./auth";
import { jwtMiddleware } from "./middleware/jwt";
import { requestIdMiddleware } from "./middleware/requestId";
import { requestLogger } from "./middleware/requestLogger";
import { auditLogger } from "./middleware/auditLogger";
import { createRateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { initializeRedis } from "./redis";
import realEstateRoutes from "./realEstateRoutes";

dotenv.config();

const MF_URL = process.env.MF_URL || "http://localhost:3001";
const STOCKS_URL = process.env.STOCKS_URL || "http://localhost:3000";
const PORT = Number(process.env.MAIN_PORT || 4000);

const app = express();

// Request tracking and logging
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(auditLogger);

// capture raw body for HMAC verification
app.use(
  json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf ? buf.toString("utf8") : "";
    },
  }),
);
app.use(
  urlencoded({
    extended: true,
    verify: (req: any, _res, buf) => {
      req.rawBody = buf ? buf.toString("utf8") : "";
    },
  }),
);

app.use(cors());

// Rate limiting
app.use(createRateLimiter(60000, 100)); // 100 requests per minute

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Auth routes (login)
app.use("/auth", authRouter);

// Real-estate asset management
app.use("/real-estate", realEstateRoutes);

// Proxy routes with JWT auth and authorization checks (main_server handles authN/authZ)
// Routes: /api/mf -> proxies to MF_URL, /api/stocks -> proxies to STOCKS_URL
// Admin routes (*/admin/*) require admin role; user routes require user or admin role.

app.use("/api/mf", jwtMiddleware, (req, res, next) => {
  // /api/mf/admin/* requires admin role
  if (req.path.startsWith("/admin") && (req as any).user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin privileges required" });
  }
  next();
}, createProxyHandler(MF_URL));

const authorizeStocksRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // /api/stocks/admin requires admin role
  if (req.path.startsWith("/admin") && (req as any).user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin privileges required" });
  }
  next();
};

app.use("/api/stocks", jwtMiddleware, authorizeStocksRequest, createProxyHandler(STOCKS_URL, "/stocks"));
app.use("/stocks", jwtMiddleware, authorizeStocksRequest, createProxyHandler(STOCKS_URL, "/stocks"));

// Generic 404
app.use((_req, res) => res.status(404).json({ message: "Not found" }));

// Error handling middleware (must be last)
app.use(errorHandler);

async function start() {
  const redisClient = await initializeRedis();

  app.listen(PORT, () => {
    console.log(`Main server listening on port ${PORT}`);
    console.log(`Proxy /api/mf -> ${MF_URL}`);
    console.log(`Proxy /api/stocks -> ${STOCKS_URL}`);

    if (redisClient) {
      console.log("Redis rate limiting enabled");
    } else if (process.env.REDIS_URL) {
      console.log("Redis was configured but unavailable; falling back to in-memory rate limiting");
    } else {
      console.log("Redis not configured; using in-memory rate limiting");
    }
  });
}

start().catch((error) => {
  console.error("Failed to start main server:", error);
  process.exit(1);
});
