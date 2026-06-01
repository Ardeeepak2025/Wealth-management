import {
  BarChart3,
  Building2,
  CandlestickChart,
  ChevronUp,
  CircleDollarSign,
  Gauge,
  Home,
  KeyRound,
  Landmark,
  LineChart,
  ListPlus,
  PieChart,
  ReceiptText,
  Settings,
  ShieldCheck,
  Trash2,
  TrendingDown,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/types/auth";

export interface SidebarLink {
  label: string;
  path: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

export interface SidebarSectionDef {
  label: string;
  icon: LucideIcon;
  links: SidebarLink[];
  roles?: UserRole[];
}

export const sidebarSections: SidebarSectionDef[] = [
  {
    label: "Workspace",
    icon: Home,
    links: [{ label: "Dashboard", path: "/dashboard", icon: Gauge }],
  },
  {
    label: "Stocks",
    icon: CandlestickChart,
    links: [
      { label: "View Stocks", path: "/stocks", icon: TrendingUp },
      { label: "Buy Stocks", path: "/stocks/buy", icon: CircleDollarSign },
      { label: "Sell Stocks", path: "/stocks/sell", icon: Wallet },
      { label: "Holdings", path: "/stocks/holdings", icon: Landmark },
      { label: "Insights", path: "/stocks/insights", icon: LineChart },
      { label: "Leaderboard", path: "/stocks/leaderboard", icon: ChevronUp },
      { label: "Top Gainers", path: "/stocks/gainers", icon: TrendingUp },
      { label: "Top Losers", path: "/stocks/losers", icon: TrendingDown },
      { label: "Add Stock", path: "/admin/stocks/add", icon: ListPlus, roles: ["STOCK_ADMIN"] },
      { label: "Manage Stocks", path: "/admin/stocks/manage", icon: Settings, roles: ["STOCK_ADMIN"] },
      { label: "Delete Stock", path: "/admin/stocks/delete", icon: Trash2, roles: ["STOCK_ADMIN"] },
      { label: "Analytics", path: "/admin/stocks/analytics", icon: BarChart3, roles: ["STOCK_ADMIN"] },
      { label: "Transactions", path: "/admin/stocks/transactions", icon: ReceiptText, roles: ["STOCK_ADMIN"] },
    ],
  },
  {
    label: "Mutual Funds",
    icon: PieChart,
    links: [
      { label: "View Funds", path: "/mutualfunds", icon: PieChart },
      { label: "Buy Funds", path: "/mutualfunds/buy", icon: CircleDollarSign },
      { label: "Sell Funds", path: "/mutualfunds/sell", icon: Wallet },
      { label: "Holdings", path: "/mutualfunds/holdings", icon: Landmark },
      { label: "Insights", path: "/mutualfunds/insights", icon: LineChart },
      { label: "Add Fund", path: "/admin/mutualfunds/add", icon: ListPlus, roles: ["MUTUAL_FUND_ADMIN"] },
      { label: "Manage Funds", path: "/admin/mutualfunds/manage", icon: Settings, roles: ["MUTUAL_FUND_ADMIN"] },
      { label: "Delete Fund", path: "/admin/mutualfunds/delete", icon: Trash2, roles: ["MUTUAL_FUND_ADMIN"] },
      { label: "Analytics", path: "/admin/mutualfunds/analytics", icon: BarChart3, roles: ["MUTUAL_FUND_ADMIN"] },
      { label: "Transactions", path: "/admin/mutualfunds/transactions", icon: ReceiptText, roles: ["MUTUAL_FUND_ADMIN"] },
    ],
  },
  {
    label: "Real Estate",
    icon: Building2,
    links: [
      { label: "Overview", path: "/realestate", icon: Building2 },
      { label: "Properties", path: "/realestate/properties", icon: Home },
      { label: "Portfolio", path: "/realestate/portfolio", icon: PieChart },
      { label: "Rents", path: "/realestate/rents", icon: ReceiptText },
      { label: "Valuations", path: "/realestate/valuations", icon: BarChart3 },
    ],
  },
  {
    label: "Account",
    icon: UserRound,
    links: [
      { label: "Profile", path: "/profile", icon: UserRound },
      { label: "Settings", path: "/profile/settings", icon: Settings },
      { label: "Notifications", path: "/profile/notifications", icon: ShieldCheck },
      { label: "Change Password", path: "/profile/change-password", icon: KeyRound },
    ],
  },
];

export function filterSidebarSections(role?: UserRole): SidebarSectionDef[] {
  return sidebarSections
    .filter((section) => !section.roles || (role && section.roles.includes(role)))
    .map((section) => ({
      ...section,
      links: section.links.filter((link) => !link.roles || (role && link.roles.includes(role))),
    }))
    .filter((section) => section.links.length > 0);
}
