import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.MAIN_JWT_SECRET || "dev-jwt-secret-change-me";

export interface AuthUser {
  id: string;
  role: string;
  email?: string;
}

export function jwtMiddleware(req: Request & { user?: AuthUser; token?: string }, res: Response, next: NextFunction) {
  try {
    const auth = req.header("authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing Bearer token" });
    }
    const token = auth.slice(7).trim();
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.token = token;
    req.user = {
      id: String(payload.id || payload.sub || "unknown"),
      role: String(payload.role || "user"),
      email: payload.email ? String(payload.email) : undefined,
    };
    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Invalid token", error: err?.message });
  }
}

export function requireRole(role: string) {
  return (req: Request & { user?: AuthUser }, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
