import { Request, Response, NextFunction } from "express";

/**
 * Request logging middleware
 * Logs all incoming requests and their responses
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const startTime = Date.now();
  const requestId = (req as any).id || "N/A";

  const originalSend = res.send;
  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    console.log(
      `[${new Date().toISOString()}] [${requestId}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`,
    );
    return originalSend.call(this, data);
  };

  next();
}
