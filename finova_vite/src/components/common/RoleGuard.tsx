import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "@/types/auth";
import { canAccess } from "@/utils/roleUtils";
import { useAuth } from "@/hooks/useAuth";

export function RoleGuard({ roles }: { roles: UserRole[] }) {
  const { role } = useAuth();
  if (!canAccess(role ?? undefined, roles)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
