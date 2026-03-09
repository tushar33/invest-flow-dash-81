import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, Wallet, CreditCard, User,
  Users, Settings, FileText, TrendingUp, Shield
} from "lucide-react";

const userNav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/packages", icon: Package, label: "Packages" },
  { to: "/wallet", icon: Wallet, label: "Wallet" },
  { to: "/payouts", icon: CreditCard, label: "Payouts" },
  { to: "/bank-details", icon: Settings, label: "Bank Details" },
  { to: "/profile", icon: User, label: "Profile" },
];

const adminNav = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/packages", icon: Package, label: "Packages" },
  { to: "/admin/payouts", icon: CreditCard, label: "Payouts" },
  { to: "/admin/roi-logs", icon: TrendingUp, label: "ROI Logs" },
];

interface DesktopSidebarProps {
  role: "user" | "admin";
}

export function DesktopSidebar({ role }: DesktopSidebarProps) {
  const location = useLocation();
  const nav = role === "admin" ? adminNav : userNav;

  return (
    <aside className="hidden md:flex md:w-60 flex-col fintech-gradient min-h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-lg font-bold text-primary-foreground tracking-tight flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          InvestROI
        </h1>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {nav.map((item) => {
          const isActive = role === "admin"
            ? (item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to))
            : location.pathname === item.to || location.pathname.startsWith(item.to + "/");
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-primary-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </RouterNavLink>
          );
        })}
      </nav>
      <div className="p-4">
        {role === "user" ? (
          <RouterNavLink
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-sidebar-foreground/50 hover:text-primary-foreground transition-colors"
          >
            <Shield className="h-3 w-3" />
            Admin Panel
          </RouterNavLink>
        ) : (
          <RouterNavLink
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-sidebar-foreground/50 hover:text-primary-foreground transition-colors"
          >
            <User className="h-3 w-3" />
            User Dashboard
          </RouterNavLink>
        )}
      </div>
    </aside>
  );
}
