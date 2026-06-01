import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "@/types/auth";
import { canAccess } from "@/utils/roleUtils";
import { useAuth } from "./useAuth";

export function useProtectedRoute(allowedRoles?: UserRole[]) {
  const { isAuthenticated, role, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) navigate("/login", { replace: true });
    if (isAuthenticated && !canAccess(role ?? undefined, allowedRoles)) {
      navigate("/unauthorized", { replace: true });
    }
  }, [allowedRoles, isAuthenticated, isLoading, navigate, role]);

  return { isAuthenticated, role, isLoading };
}
