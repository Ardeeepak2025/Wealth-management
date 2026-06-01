import { mutualFundApi } from "./axios";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/auth";
import { normalizeRole } from "@/utils/roleUtils";

function normalizeUser(user: any): User {
  return {
    id: Number(user?.id || user?.userId || 0),
    name: String(user?.name || "Finova User"),
    email: String(user?.email || ""),
    role: normalizeRole(user?.role),
    last_active: user?.last_active ?? null,
  };
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await mutualFundApi.post("/api/auth/login", payload);
    return { ...data, user: normalizeUser(data.user) };
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await mutualFundApi.post("/api/auth/register", payload);
    return { ...data, user: normalizeUser(data.user) };
  },

  async logout(token?: string): Promise<void> {
    await mutualFundApi.post("/api/auth/logout", token ? { token } : {});
  },

  async me(): Promise<User> {
    const { data } = await mutualFundApi.get("/api/auth/me");
    return normalizeUser(data.user);
  },
};
