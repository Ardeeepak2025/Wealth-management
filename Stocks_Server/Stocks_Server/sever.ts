import dotenv from "dotenv";
dotenv.config();

import express from "express";

import stockRouter from "./Router/stockRouter";
import adminRouter from "./Router/adminRoutes";
import usersRouter from "./Router/usersRoutes";

import { initializeDatabase } from "./Database/db";
import { requestIdMiddleware } from "./Middleware/requestId";
import { requestLogger } from "./Middleware/requestLogger";
import { createRateLimiter } from "./Middleware/rateLimiter";
import { corsMiddleware } from "./Middleware/cors";
import { errorHandler } from "./Middleware/errorHandler";

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Request tracking and logging
app.use(requestIdMiddleware);
app.use(requestLogger);

// Body parsing
app.use(express.json());

// CORS
app.use(corsMiddleware());

// Rate limiting
app.use(createRateLimiter(60000, 100)); // 100 requests per minute

app.use("/stocks", stockRouter);
app.use("/admin", adminRouter);
app.use("/users", usersRouter);

app.get("/", (request, response) => {
  response.status(200).json({
    message: "Equity Service Running Successfully",
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Stock Service running on port ${PORT}`);
    });
  } catch (error: any) {
    console.log("Failed to start server");
    console.log(error.message);
    process.exit(1);
  }
};

startServer();
