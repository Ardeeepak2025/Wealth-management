import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthTokenPayload extends JwtPayload {
  userId: number;
  email: string;
  role: string;
  jti: string;
}

export interface AuthTokenDetails {
  token: string;
  expiresAt: string;
  payload: AuthTokenPayload;
}

const revokedTokens = new Map<string, number>();
const jwtSecret = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

function cleanupRevokedTokens(): void {
  const now = Date.now();
  for (const [jti, expiresAt] of revokedTokens.entries()) {
    if (expiresAt <= now) {
      revokedTokens.delete(jti);
    }
  }
}

export function createToken(data: {
  userId: number;
  email: string;
  role: string;
}): AuthTokenDetails {
  cleanupRevokedTokens();

  const jti = crypto.randomUUID();
  const token = jwt.sign(
    {
      userId: data.userId,
      email: data.email,
      role: data.role,
      jti,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn as jwt.SignOptions["expiresIn"] },
  );

  const decoded = jwt.decode(token) as AuthTokenPayload | null;
  if (!decoded || typeof decoded.exp !== "number") {
    throw new Error("Failed to create auth token");
  }

  return {
    token,
    expiresAt: new Date(decoded.exp * 1000).toISOString(),
    payload: decoded,
  };
}

export function verifyToken(token: string): AuthTokenPayload | null {
  cleanupRevokedTokens();

  try {
    const payload = jwt.verify(token, jwtSecret) as AuthTokenPayload;
    if (revokedTokens.has(payload.jti)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function revokeToken(token: string): boolean {
  const decoded = jwt.decode(token) as AuthTokenPayload | null;
  if (!decoded?.jti || !decoded.exp) {
    return false;
  }

  revokedTokens.set(decoded.jti, decoded.exp * 1000);
  return true;
}
