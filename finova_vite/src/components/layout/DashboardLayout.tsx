import { Outlet } from "react-router-dom";
import { MobileSidebar } from "./MobileSidebar";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-finova-black bg-finance-grid bg-[length:48px_48px]">
      <MobileSidebar />
      <div className="grid min-h-screen lg:grid-cols-[290px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <div className="sticky top-0 h-screen">
            <Sidebar />
          </div>
        </div>
        <div className="min-w-0">
          <Navbar />
          <main className="page-shell">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
