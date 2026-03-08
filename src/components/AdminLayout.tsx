import { ReactNode } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { NavLink as RouterNavLink } from "react-router-dom";
import { LayoutDashboard, Users, Package, CreditCard, TrendingUp } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const adminMobileNav = [
  { to: "/admin", icon: LayoutDashboard, label: "Home" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/packages", icon: Package, label: "Packages" },
  { to: "/admin/payouts", icon: CreditCard, label: "Payouts" },
  { to: "/admin/roi-logs", icon: TrendingUp, label: "ROI" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div className="min-h-screen flex w-full">
      <DesktopSidebar role="admin" />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {adminMobileNav.map((item) => {
            const isActive = item.to === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.to);
            return (
              <RouterNavLink key={item.to} to={item.to} className="flex flex-col items-center justify-center gap-0.5 flex-1">
                <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-accent" : "text-muted-foreground")} />
                <span className={cn("text-[10px] font-medium", isActive ? "text-accent" : "text-muted-foreground")}>{item.label}</span>
              </RouterNavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
