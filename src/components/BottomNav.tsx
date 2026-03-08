import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon, LayoutDashboard, Package, Wallet, CreditCard, User } from "lucide-react";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const userNav: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/packages", icon: Package, label: "Invest" },
  { to: "/wallet", icon: Wallet, label: "Wallet" },
  { to: "/payouts", icon: CreditCard, label: "Payouts" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-card/80 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
        <div className="flex items-center justify-around h-[68px] px-1">
          {userNav.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            return (
              <RouterNavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center gap-1 flex-1 relative py-1"
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-accent" />
                )}
                <div className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200",
                  isActive ? "bg-accent/12 scale-105" : ""
                )}>
                  <item.icon
                    className={cn(
                      "h-[20px] w-[20px] transition-all duration-200",
                      isActive ? "text-accent" : "text-muted-foreground"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold leading-none transition-all duration-200",
                    isActive ? "text-accent" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </RouterNavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
