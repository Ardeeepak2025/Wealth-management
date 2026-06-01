import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/common/Button";
import { saveSession } from "@/utils/token";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";

export default function TestLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [role, setRole] = useState<UserRole>("MUTUAL_FUND_ADMIN");
  const [loading, setLoading] = useState(false);

  const roles: UserRole[] = ["USER", "STOCK_ADMIN", "MUTUAL_FUND_ADMIN"];

  async function handleTestLogin() {
    setLoading(true);
    try {
      const response = await fetch("/auth/test-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Test login failed");
      }

      const data = await response.json();
      const { token, user } = data;

      // Save session
      saveSession(token, user);
      setUser(user);

      toast.success(`Logged in as ${role}`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Test login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Login</h1>
            <p className="text-gray-600 text-sm">
              Development only - Select a role to test
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`p-4 text-left rounded-lg border-2 transition-all ${
                      role === r
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{r.replace(/_/g, " ")}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {r === "USER" && "Standard user with read-only access"}
                      {r === "STOCK_ADMIN" && "Full access to Stocks, limited MF access"}
                      {r === "MUTUAL_FUND_ADMIN" && "Full access to Mutual Funds, limited Stocks access"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleTestLogin}
              isLoading={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Login as {role.replace(/_/g, " ")}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate("/login")}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
              >
                Back to Normal Login
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>⚠️ Development Only:</strong> This page is only available in development mode. In production, use the normal login flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
