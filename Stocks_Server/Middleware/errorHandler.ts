import { Request, Response, NextFunction } from "express";

/**
 * Error handling middleware
 * Must be placed AFTER all other middleware and route handlers
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal server error";

  console.error(`[ERROR] ${statusCode}: ${message}`);
  if (err.stack) console.error(err.stack);

  res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === "production" ? undefined : err.message,
    requestId: (req as any).id,
  });
}
