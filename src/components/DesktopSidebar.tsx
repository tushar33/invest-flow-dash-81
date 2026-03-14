import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, Wallet, CreditCard, User,
  Users, Settings, FileText, TrendingUp, Shield, LogOut
} from "lucide-react";

const userNav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/packages", icon: Package, label: "Packages" },
  { to: "/wallet", icon: Wallet, label: "Wallet" },
  { to: "/wallet/ledger", icon: FileText, label: "Ledger" },
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
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

interface DesktopSidebarProps {
  role: "user" | "admin";
}

export function DesktopSidebar({ role }: DesktopSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const nav = role === "admin" ? adminNav : userNav;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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
      
      {/* Profile Menu & Role Switcher */}
      <div className="p-3 space-y-2">
        {role === "user" && user?.role === "ADMIN" && (
          <RouterNavLink
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-sidebar-foreground/50 hover:text-primary-foreground transition-colors"
          >
            <Shield className="h-3 w-3" />
            Admin Panel
          </RouterNavLink>
        )}
        {role === "admin" && (
          <RouterNavLink
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-sidebar-foreground/50 hover:text-primary-foreground transition-colors"
          >
            <User className="h-3 w-3" />
            User Dashboard
          </RouterNavLink>
        )}

        {/* Profile Info */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
            <User className="h-4 w-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary-foreground truncate">{user?.fullName}</p>
            <p className="text-[10px] text-sidebar-foreground/60 truncate">{user?.email || user?.phone}</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
