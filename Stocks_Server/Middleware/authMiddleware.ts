import { NextFunction, Request, Response } from "express";
import { supabase } from "../Database/db";

interface AuthorizedUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

type AuthenticatedRequest = Request & { user?: AuthorizedUser };

interface DecodedTokenPayload {
  id?: unknown;
  user_id?: unknown;
  uid?: unknown;
  email?: unknown;
  role?: unknown;
  app_metadata?: {
    role?: unknown;
  };
  user_metadata?: {
    role?: unknown;
  };
  [key: string]: unknown;
}

const base64UrlDecode = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = normalized + (padding ? "=".repeat(4 - padding) : "");
  return Buffer.from(padded, "base64").toString("utf8");
};

const decodeTokenPayload = (token: string): DecodedTokenPayload => {
  const parts = token.split(".");

  if (parts.length < 2) {
    throw new Error("Invalid token format");
  }

  const payloadJson = base64UrlDecode(parts[1]);
  const payload = JSON.parse(payloadJson) as DecodedTokenPayload;
  return payload;
};

const parsePositiveNumber = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const resolveRoleFromToken = (payload: DecodedTokenPayload): string | null => {
  const directRole = String(payload.role || "").trim();
  if (directRole) {
    return directRole;
  }

  const appMetaRole = String(payload.app_metadata?.role || "").trim();
  if (appMetaRole) {
    return appMetaRole;
  }

  const userMetaRole = String(payload.user_metadata?.role || "").trim();
  if (userMetaRole) {
    return userMetaRole;
  }

  return null;
};

export const authenticate = (request: Request, response: Response, next: NextFunction): void => {
  const authRequest = request as AuthenticatedRequest;
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    response.status(401).json({ message: "Authorization token is required" });
    return;
  }

  const token = authHeader.split(" ")[1];

  decodeAndAuthorize(token)
    .then((user) => {
      authRequest.user = user;
      next();
    })
    .catch((error: any) => {
      response.status(401).json({ message: error.message || "Invalid authorization token" });
    });
};

export const authorizeRoles = (...roles: string[]) => {
  return (request: Request, response: Response, next: NextFunction): void => {
    const authRequest = request as AuthenticatedRequest;

    if (!authRequest.user) {
      response.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!roles.includes(authRequest.user.role)) {
      response.status(403).json({ message: "Forbidden: insufficient permissions" });
      return;
    }

    next();
  };
};

const decodeAndAuthorize = async (token: string): Promise<AuthorizedUser> => {
  const payload = decodeTokenPayload(token);
  const tokenUserId = parsePositiveNumber(payload.id ?? payload.user_id ?? payload.uid);
  const tokenEmail = String(payload.email || "").trim().toLowerCase();
  const tokenRole = resolveRoleFromToken(payload);

  if (!tokenUserId && !tokenEmail) {
    throw new Error("Token must include user id or email");
  }

  let query = supabase.from("users").select("id, name, email, role");

  if (tokenUserId) {
    query = query.eq("id", tokenUserId);
  } else {
    query = query.eq("email", tokenEmail);
  }

  const { data: user, error } = await query.maybeSingle();

  if (error) {
    throw new Error(error.message || "Failed to validate user");
  }

  if (!user) {
    throw new Error("User not found");
  }

  if (tokenEmail && String(user.email || "").trim().toLowerCase() !== tokenEmail) {
    throw new Error("Token email does not match user");
  }

  if (tokenRole && String(user.role || "").trim().toLowerCase() !== tokenRole.toLowerCase()) {
    throw new Error("Token role does not match user role");
  }

  return {
    id: Number(user.id),
    name: String(user.name || ""),
    email: String(user.email || "").trim().toLowerCase(),
    role: String(user.role || "user").trim().toLowerCase(),
  };
};
