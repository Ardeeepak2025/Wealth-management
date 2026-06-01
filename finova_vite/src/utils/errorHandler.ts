import toast from "react-hot-toast";

export type ErrorType = "error" | "warning" | "info";

interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  requestId?: string;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Parse error response from API or axios
 */
export function parseErrorMessage(error: unknown): { message: string; statusCode: number } {
  if (error instanceof AppError) {
    return { message: error.message, statusCode: error.statusCode };
  }

  if (typeof error === "object" && error !== null) {
    const err = error as any;

    // Axios error response
    if (err.response?.data) {
      const data = err.response.data as ErrorResponse;
      return {
        message: data.message || data.error || "An error occurred",
        statusCode: err.response.status || 500,
      };
    }

    // Axios error message
    if (err.message) {
      return {
        message: err.message,
        statusCode: err.code ? parseInt(err.code, 10) : 500,
      };
    }
  }

  return {
    message: typeof error === "string" ? error : "An unexpected error occurred",
    statusCode: 500,
  };
}

/**
 * Check if an error message should be suppressed from user notifications
 */
function isSuppressedError(message: string): boolean {
  const suppressed = [
    "Admin privileges required",
    "Insufficient permissions",
    "Access denied",
    "Forbidden",
  ];

  return suppressed.some((msg) =>
    String(message).toLowerCase().includes(msg.toLowerCase())
  );
}

/**
 * Display error message as popup and log to console
 */
export function displayError(error: unknown, options?: { title?: string; duration?: number }) {
  const { message, statusCode } = parseErrorMessage(error);
  const title = options?.title || getErrorTitle(statusCode);
  const duration = options?.duration || 4000;

  const shouldSuppress = isSuppressedError(message);

  // Log to console for debugging (always)
  console.warn(`[${statusCode}] ${title}:`, message, error);

  // Show toast notification only if not suppressed
  if (!shouldSuppress) {
    toast.error(`${title}: ${message}`, { duration });
  }

  return { message, statusCode, title, suppressed: shouldSuppress };
}

/**
 * Get user-friendly error title based on status code
 */
function getErrorTitle(statusCode: number): string {
  switch (Math.floor(statusCode / 100)) {
    case 4:
      if (statusCode === 401) return "Authentication Failed";
      if (statusCode === 403) return "Access Denied";
      if (statusCode === 404) return "Not Found";
      return "Request Error";
    case 5:
      return "Server Error";
    default:
      return "Error";
  }
}

/**
 * Safe async wrapper that handles errors
 */
export async function handleAsync<T>(
  promise: Promise<T>,
  errorMessage?: string
): Promise<[T | null, any]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    const errorData = parseErrorMessage(error);
    if (errorMessage) {
      displayError(new AppError(errorMessage, errorData.statusCode), {
        title: "Operation Failed",
      });
    }
    return [null, error];
  }
}
