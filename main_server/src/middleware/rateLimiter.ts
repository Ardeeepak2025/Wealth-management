import { Request, Response, NextFunction } from "express";
import { getRedisClient } from "../redis";

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

/**
 * Simple rate limiting middleware
 * Limits requests per IP address
 */
export function createRateLimiter(
  windowMs: number = 60000, // 1 minute
  maxRequests: number = 100, // max requests per window
) {
  const store: RateLimitStore = {};

  const applyMemoryLimit = (req: Request, res: Response) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    if (!store[ip]) {
      store[ip] = { count: 0, resetTime: now + windowMs };
    }

    const record = store[ip];

    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }

    record.count++;

    res.setHeader("X-RateLimit-Limit", maxRequests);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - record.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));

    if (record.count > maxRequests) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    return null;
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";

    try {
      const redis = await getRedisClient();

      if (redis) {
        const key = `rate-limit:${ip}`;
        const now = Date.now();
        const count = await redis.incr(key);

        if (count === 1) {
          await redis.pExpire(key, windowMs);
        }

        const ttlMs = await redis.pTTL(key);
        const resetTime = ttlMs > 0 ? now + ttlMs : now + windowMs;

        res.setHeader("X-RateLimit-Limit", maxRequests);
        res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - count));
        res.setHeader("X-RateLimit-Reset", Math.ceil(resetTime / 1000));

        if (count > maxRequests) {
          return res.status(429).json({
            message: "Too many requests, please try again later",
            retryAfter: Math.max(1, Math.ceil(ttlMs / 1000)),
          });
        }

        return next();
      }
    } catch (error) {
      console.warn("Redis rate limiter unavailable, falling back to memory store:", (error as Error)?.message || error);
    }

    const blocked = applyMemoryLimit(req, res);
    if (blocked) {
      return;
    }

    next();
  };
}
