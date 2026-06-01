import { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import type { AuthResponse, LoginPayload, RegisterPayload, User, UserRole } from "@/types/auth";
import { clearSession, getStoredUser, getToken, saveSession } from "@/utils/token";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthResponse>;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getStoredUser();
    setToken(storedToken);
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  async function login(payload: LoginPayload) {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      saveSession(response.token, response.user);
      setToken(response.token);
      setUser(response.user);
      toast.success(`Welcome back, ${response.user.name}`);
      return response;
    } finally {
      setIsLoading(false);
    }
  }

  async function register(payload: RegisterPayload) {
    setIsLoading(true);
    try {
      const response = await authService.register(payload);
      saveSession(response.token, response.user);
      setToken(response.token);
      setUser(response.user);
      toast.success("Account created successfully");
      return response;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    const currentToken = token;
    clearSession();
    setToken(null);
    setUser(null);
    if (currentToken) {
      await authService.logout(currentToken).catch(() => undefined);
    }
    toast.success("Signed out");
  }

  async function refreshUser() {
    if (!token) return;
    const nextUser = await authService.me();
    setUser(nextUser);
    saveSession(token, nextUser);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      role: user?.role ?? null,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
