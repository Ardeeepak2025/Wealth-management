import { Request, Response, NextFunction } from "express";
import { getSupabaseClient } from "../supabase";

type AuditUser = {
  id?: string;
  role?: string;
  email?: string;
};

let warnedAboutConfig = false;

function sanitizeDetails(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  if (Array.isArray(input)) {
    return { items: [...input] };
  }

  const clone = { ...(input as Record<string, unknown>) };
  const sensitiveKeys = new Set(["password", "token", "authorization", "refreshToken", "accessToken"]);

  for (const key of Object.keys(clone)) {
    if (sensitiveKeys.has(key)) {
      delete (clone as Record<string, unknown>)[key];
    }
  }

  return clone;
}

function getAuditAction(req: Request) {
  const path = req.originalUrl.split("?")[0] || req.path;

  if (path.startsWith("/auth/login")) return "auth.login";
  if (path.startsWith("/auth/register")) return "auth.register";
  if (path.startsWith("/api/mf") || path.startsWith("/mf")) return "proxy.mf";
  if (path.startsWith("/api/stocks") || path.startsWith("/stocks")) return "proxy.stocks";
  if (path === "/health") return "system.health";
  return `http.${req.method.toLowerCase()}`;
}

function getAuditResource(req: Request) {
  return req.originalUrl.split("?")[0] || req.path;
}

export function auditLogger(
  req: Request & { id?: string; user?: AuditUser; rawBody?: string },
  res: Response,
  next: NextFunction,
) {
  const startedAt = Date.now();

  res.on("finish", async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      if (!warnedAboutConfig) {
        warnedAboutConfig = true;
        console.warn("Supabase audit logging is disabled. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable it.");
      }
      return;
    }

    const user = req.user || {};
    const requestBody = sanitizeDetails(req.body);

    const details: Record<string, unknown> = {
      ...(requestBody ? { requestBody } : {}),
    };

    const payload = {
      request_id: req.id || null,
      action: getAuditAction(req),
      method: req.method,
      path: req.path,
      resource: getAuditResource(req),
      outcome: res.statusCode >= 400 ? "error" : "success",
      status: res.statusCode,
      duration_ms: Date.now() - startedAt,
      ip: req.ip || req.socket.remoteAddress || null,
      actor_id: user.id || null,
      actor_email: user.email || (typeof (req.body as any)?.email === "string" ? (req.body as any).email : null),
      actor_role: user.role || null,
      details: Object.keys(details).length > 0 ? details : null,
    };

    try {
      const { error } = await supabase.from("audit_logs").insert(payload);
      if (error) {
        console.warn("Failed to persist audit log:", error.message);
      }
    } catch (error: any) {
      console.warn("Failed to persist audit log:", error?.message || error);
    }
  });

  next();
}
