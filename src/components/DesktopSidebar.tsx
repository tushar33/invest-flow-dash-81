import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, Wallet, CreditCard, User,
  Users, Settings, FileText, TrendingUp, Shield, LogOut
} from "lucide-react";
import trinityLogo from "@/assets/trinity-arrows-logo.png";

const userNav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/packages", icon: Package, label: "Plans" },
  { to: "/wallet", icon: Wallet, label: "Activity" },
  { to: "/wallet/ledger", icon: FileText, label: "Ledger" },
  { to: "/payouts", icon: CreditCard, label: "Redemptions" },
  { to: "/bank-details", icon: Settings, label: "Account Details" },
  { to: "/profile", icon: User, label: "Profile" },
];

const adminNav = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/packages", icon: Package, label: "Plans" },
  { to: "/admin/payouts", icon: CreditCard, label: "Redemptions" },
  { to: "/admin/roi-logs", icon: TrendingUp, label: "Reward Logs" },
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

  const initials = user?.fullName?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-sidebar h-screen sticky top-0 overflow-hidden border-r border-sidebar-border">
      {/* Decorative mesh */}
      <div aria-hidden className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-20 -left-10 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-48 w-48 rounded-full bg-primary-glow/40 blur-3xl" />
      </div>

      <div className="relative px-6 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 flex items-center justify-center">
            <img src={trinityLogo} alt="Trinity Arrows" className="h-full w-full object-contain drop-shadow-[0_0_12px_hsl(var(--accent)/0.4)]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-sidebar-foreground tracking-tight leading-none">Trinity Arrows</h1>
            <p className="text-[10px] text-sidebar-foreground/50 mt-1 uppercase tracking-widest">{role === "admin" ? "Admin Console" : "Member"}</p>
          </div>
        </div>
      </div>

      <nav className="relative flex-1 px-3 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const isActive = role === "admin"
            ? (item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to))
            : location.pathname === item.to || location.pathname.startsWith(item.to + "/");
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground shadow-sm"
                  : "text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r-full bg-accent shadow-glow" />
              )}
              <item.icon className={cn("h-4 w-4 transition-transform", isActive && "text-accent")} />
              <span className="flex-1">{item.label}</span>
            </RouterNavLink>
          );
        })}
      </nav>

      <div className="relative p-3 space-y-2 border-t border-sidebar-border/60">
        {role === "user" && user?.role === "ADMIN" && (
          <RouterNavLink to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 transition-colors">
            <Shield className="h-3 w-3" />
            Switch to Admin
          </RouterNavLink>
        )}
        {role === "admin" && (
          <RouterNavLink to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 transition-colors">
            <User className="h-3 w-3" />
            Member View
          </RouterNavLink>
        )}

        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-sidebar-accent/40">
          <div className="h-9 w-9 rounded-full bg-gradient-accent flex items-center justify-center text-[11px] font-bold text-accent-foreground shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">{user?.fullName}</p>
            <p className="text-[10px] text-sidebar-foreground/55 truncate">{user?.email || user?.phone}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 w-full group"
        >
          <LogOut className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
