import type { User, UserRole } from "@/types/auth";

const TOKEN_KEY = "finova_token";
const USER_KEY = "finova_user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveSession(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function updateStoredRole(role: UserRole): void {
  const user = getStoredUser();
  if (user) saveSession(getToken() || "", { ...user, role });
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
