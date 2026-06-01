import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../models/authModel";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
    jti?: string;
    exp?: number;
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("authorization") || req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing auth token" });
    return;
  }

  const token = authHeader.slice(7).trim();
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  (req as AuthRequest).user = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    jti: payload.jti,
    exp: payload.exp,
  };

  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    const user = (req as AuthRequest).user;
    if (!user || user.role !== "ADMIN") {
      res.status(403).json({ message: "Admin privileges required" });
      return;
    }
    next();
  });
}
