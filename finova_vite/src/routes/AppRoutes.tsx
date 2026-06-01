import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { RoleGuard } from "@/components/common/RoleGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AddFund from "@/pages/admin/mutualfunds/AddFund";
import DeleteFund from "@/pages/admin/mutualfunds/DeleteFund";
import FundAnalytics from "@/pages/admin/mutualfunds/FundAnalytics";
import FundTransactions from "@/pages/admin/mutualfunds/FundTransactions";
import ManageFunds from "@/pages/admin/mutualfunds/ManageFunds";
import AddStock from "@/pages/admin/stocks/AddStock";
import DeleteStock from "@/pages/admin/stocks/DeleteStock";
import ManageStocks from "@/pages/admin/stocks/ManageStocks";
import StockAnalytics from "@/pages/admin/stocks/StockAnalytics";
import StockTransactions from "@/pages/admin/stocks/StockTransactions";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import TestLogin from "@/pages/auth/TestLogin";
import Dashboard from "@/pages/dashboard/Dashboard";
import NotFound from "@/pages/errors/NotFound";
import Unauthorized from "@/pages/errors/Unauthorized";
import BuyFunds from "@/pages/mutualfunds/BuyFunds";
import FundDetails from "@/pages/mutualfunds/FundDetails";
import FundHoldings from "@/pages/mutualfunds/FundHoldings";
import FundInsights from "@/pages/mutualfunds/FundInsights";
import MutualFunds from "@/pages/mutualfunds/MutualFunds";
import SellFunds from "@/pages/mutualfunds/SellFunds";
import ChangePassword from "@/pages/profile/ChangePassword";
import Notifications from "@/pages/profile/Notifications";
import Profile from "@/pages/profile/Profile";
import Settings from "@/pages/profile/Settings";
import Portfolio from "@/pages/realestate/Portfolio";
import Properties from "@/pages/realestate/Properties";
import RealEstate from "@/pages/realestate/RealEstate";
import Rents from "@/pages/realestate/Rents";
import Valuations from "@/pages/realestate/Valuations";
import BuyStocks from "@/pages/stocks/BuyStocks";
import Gainers from "@/pages/stocks/Gainers";
import Leaderboard from "@/pages/stocks/Leaderboard";
import Losers from "@/pages/stocks/Losers";
import SellStocks from "@/pages/stocks/SellStocks";
import StockDetails from "@/pages/stocks/StockDetails";
import StockHoldings from "@/pages/stocks/StockHoldings";
import StockInsights from "@/pages/stocks/StockInsights";
import Stocks from "@/pages/stocks/Stocks";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/test-login" element={<TestLogin />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/stocks/buy" element={<BuyStocks />} />
          <Route path="/stocks/sell" element={<SellStocks />} />
          <Route path="/stocks/holdings" element={<StockHoldings />} />
          <Route path="/stocks/insights" element={<StockInsights />} />
          <Route path="/stocks/leaderboard" element={<Leaderboard />} />
          <Route path="/stocks/gainers" element={<Gainers />} />
          <Route path="/stocks/losers" element={<Losers />} />
          <Route path="/stocks/:id" element={<StockDetails />} />
          <Route path="/mutualfunds" element={<MutualFunds />} />
          <Route path="/mutualfunds/buy" element={<BuyFunds />} />
          <Route path="/mutualfunds/sell" element={<SellFunds />} />
          <Route path="/mutualfunds/holdings" element={<FundHoldings />} />
          <Route path="/mutualfunds/insights" element={<FundInsights />} />
          <Route path="/mutualfunds/:id" element={<FundDetails />} />
          <Route path="/realestate" element={<RealEstate />} />
          <Route path="/realestate/properties" element={<Properties />} />
          <Route path="/realestate/portfolio" element={<Portfolio />} />
          <Route path="/realestate/rents" element={<Rents />} />
          <Route path="/realestate/valuations" element={<Valuations />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/settings" element={<Settings />} />
          <Route path="/profile/notifications" element={<Notifications />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route element={<RoleGuard roles={["STOCK_ADMIN"]} />}>
            <Route path="/admin/stocks/add" element={<AddStock />} />
            <Route path="/admin/stocks/manage" element={<ManageStocks />} />
            <Route path="/admin/stocks/delete" element={<DeleteStock />} />
            <Route path="/admin/stocks/analytics" element={<StockAnalytics />} />
            <Route path="/admin/stocks/transactions" element={<StockTransactions />} />
          </Route>
          <Route element={<RoleGuard roles={["MUTUAL_FUND_ADMIN"]} />}>
            <Route path="/admin/mutualfunds/add" element={<AddFund />} />
            <Route path="/admin/mutualfunds/manage" element={<ManageFunds />} />
            <Route path="/admin/mutualfunds/delete" element={<DeleteFund />} />
            <Route path="/admin/mutualfunds/analytics" element={<FundAnalytics />} />
            <Route path="/admin/mutualfunds/transactions" element={<FundTransactions />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
