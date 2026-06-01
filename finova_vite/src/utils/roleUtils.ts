import type { UserRole } from "@/types/auth";

export const roles: UserRole[] = ["USER", "STOCK_ADMIN", "MUTUAL_FUND_ADMIN"];

export function normalizeRole(role?: string): UserRole {
  const normalized = String(role || "USER").trim().toUpperCase();
  if (normalized === "ADMIN" || normalized === "STOCKADMIN") return "STOCK_ADMIN";
  if (normalized === "MF_ADMIN" || normalized === "MUTUALFUNDADMIN") return "MUTUAL_FUND_ADMIN";
  return roles.includes(normalized as UserRole) ? (normalized as UserRole) : "USER";
}

export function roleLabel(role: UserRole): string {
  return role
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

export function canAccess(role: UserRole | undefined, allowed?: UserRole[]): boolean {
  return !allowed || allowed.length === 0 || Boolean(role && allowed.includes(role));
}
