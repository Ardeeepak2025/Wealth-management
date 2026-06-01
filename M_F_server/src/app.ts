import express from "express";
import usersRouter from "./routes/usersRoutes";
import authRouter from "./routes/authRoutes";
import fundsRouter from "./routes/mutualFundsRoutes";
import holdingsRouter from "./routes/holdingsRoutes";
import transactionsRouter from "./routes/transactionsRoutes";
import summaryRouter from "./routes/summaryRoutes";
import adminRouter from "./routes/adminRoutes";
import { requestIdMiddleware } from "./middleware/requestId";
import { requestLogger } from "./middleware/requestLogger";
import { createRateLimiter } from "./middleware/rateLimiter";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Request tracking and logging
app.use(requestIdMiddleware);
app.use(requestLogger);

// Body parsing
app.use(express.json());

// CORS
app.use(corsMiddleware());

// Rate limiting
app.use(createRateLimiter(60000, 100)); // 100 requests per minute

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/mutual-funds", fundsRouter);
app.use("/api/holdings", holdingsRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/summary", summaryRouter);
app.use("/api/admin", adminRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
