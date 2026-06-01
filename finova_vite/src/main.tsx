import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ToastProvider } from "@/components/common/ToastProvider";
import { AppProviders } from "@/providers/AppProviders";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
        <ToastProvider />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>,
);
