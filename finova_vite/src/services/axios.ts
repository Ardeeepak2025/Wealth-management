import axios from "axios";
import { DEFAULT_GATEWAY_API, DEFAULT_MF_API, DEFAULT_STOCK_API } from "@/utils/constants";
import { getToken } from "@/utils/token";
import toast from "react-hot-toast";

export const stockApi = axios.create({
  baseURL: DEFAULT_STOCK_API,
  timeout: 18000,
  headers: { "Content-Type": "application/json" },
});

export const mutualFundApi = axios.create({
  baseURL: DEFAULT_MF_API,
  timeout: 18000,
  headers: { "Content-Type": "application/json" },
});

export const gatewayApi = axios.create({
  baseURL: DEFAULT_GATEWAY_API,
  timeout: 18000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Error response handler - displays errors as popups and logs to console
 * Suppresses certain errors that shouldn't be shown to users
 */
const errorHandler = (error: any) => {
  const statusCode = error.response?.status || error.code || 500;
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "An error occurred";

  // Errors to suppress from user notifications (still logged to console)
  const suppressed = [
    "Admin privileges required",
    "Insufficient permissions",
    "Access denied",
    "Forbidden",
  ];

  const shouldSuppress = suppressed.some((msg) =>
    String(errorMessage).toLowerCase().includes(msg.toLowerCase())
  );

  // Log to console for debugging (always)
  console.warn(`[${statusCode}] API Access Denied:`, {
    message: errorMessage,
    status: statusCode,
    url: error.config?.url,
    suppressed: shouldSuppress,
  });

  // Display error toast only if not suppressed
  if (!shouldSuppress) {
    toast.error(errorMessage, { duration: 4000 });
  }

  // Return the promise rejection to be handled by caller if needed
  return Promise.reject(error);
};

[stockApi, mutualFundApi, gatewayApi].forEach((client) => {
  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Add response error interceptor
  client.interceptors.response.use(
    (response) => response,
    (error) => errorHandler(error)
  );
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return String(error.response?.data?.message || error.response?.data?.error || error.message);
  }
  return error instanceof Error ? error.message : "Something went wrong";
}
