import { Request, Response, NextFunction } from "express";

/**
 * CORS middleware with custom configuration
 */
export function corsMiddleware(
  allowedOrigins: string[] = ["*"],
  allowedMethods: string[] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: string[] = ["Content-Type", "Authorization", "X-Request-ID"],
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.header("origin") || "*";

    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", allowedOrigins.includes("*") ? "*" : origin);
    }

    res.header("Access-Control-Allow-Methods", allowedMethods.join(", "));
    res.header("Access-Control-Allow-Headers", allowedHeaders.join(", "));
    res.header("Access-Control-Max-Age", "3600");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  };
}
