import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

/**
 * Request ID tracking middleware
 * Adds a unique ID to each request for tracing
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestId = req.header("x-request-id") || randomUUID();
  (req as any).id = requestId;
  res.setHeader("x-request-id", requestId);
  next();
}
