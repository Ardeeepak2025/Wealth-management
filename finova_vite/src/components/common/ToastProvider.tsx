import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3200,
        style: {
          background: "rgba(15, 23, 42, 0.96)",
          color: "#e5e7eb",
          border: "1px solid rgba(148, 163, 184, 0.22)",
          backdropFilter: "blur(16px)",
        },
      }}
    />
  );
}
