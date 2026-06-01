export type UserRole = "USER" | "STOCK_ADMIN" | "MUTUAL_FUND_ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  last_active?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  message?: string;
  token: string;
  expiresAt?: string;
  user: User;
}
