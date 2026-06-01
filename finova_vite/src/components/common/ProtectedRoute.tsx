import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "./Loader";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Loader label="Restoring secure session" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
