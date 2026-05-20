import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

const secret = process.env.MAIN_HMAC_SECRET || "dev_secret_change_me";
const ALLOWED_SKEW_SECONDS = Number(process.env.MAIN_HMAC_SKEW_SECONDS || 300); // 5 minutes

function timingSafeCompare(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function hmacMiddleware(req: Request & { rawBody?: string }, res: Response, next: NextFunction) {
  try {
    // HMAC signature is provided in the `x-hmac-signature` header (hex) and timestamp in `x-timestamp`.
    const provided = req.header("x-hmac-signature") || "";
    const timestamp = req.header("x-timestamp") || "";

    if (!provided || !timestamp) {
      return res.status(401).json({ message: "Missing HMAC signature or timestamp" });
    }

    // check timestamp freshness
    const ts = Number(timestamp);
    if (Number.isNaN(ts)) {
      return res.status(400).json({ message: "Invalid timestamp" });
    }
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - ts) > ALLOWED_SKEW_SECONDS) {
      return res.status(401).json({ message: "Timestamp skew too large" });
    }

    // construct payload to sign: timestamp:method:url:body
    const body = req.rawBody || "";
    const payload = `${timestamp}:${req.method}:${req.originalUrl}:${body}`;
    const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    if (!timingSafeCompare(hmac, provided)) {
      return res.status(401).json({ message: "Invalid HMAC signature" });
    }

    // valid
    next();
  } catch (err) {
    console.error("HMAC middleware error:", err);
    res.status(500).json({ message: "HMAC verification failed" });
  }
}
