import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { LucideIcon, LayoutDashboard, Package, Wallet, CreditCard, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const userNav: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/packages", icon: Package, label: "Packages" },
  { to: "/wallet", icon: Wallet, label: "Wallet" },
  { to: "/payouts", icon: CreditCard, label: "Payouts" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  const profileActive = location.pathname === "/profile" || location.pathname.startsWith("/profile/");

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

          {/* Profile Sheet */}
          <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-1 flex-1 relative py-1">
                {profileActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-accent" />
                )}
                <div className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200",
                  profileActive ? "bg-accent/12 scale-105" : ""
                )}>
                  <User
                    className={cn(
                      "h-[20px] w-[20px] transition-all duration-200",
                      profileActive ? "text-accent" : "text-muted-foreground"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold leading-none transition-all duration-200",
                    profileActive ? "text-accent" : "text-muted-foreground"
                  )}
                >
                  Profile
                </span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl">
              <SheetHeader className="text-left">
                <SheetTitle>Profile</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || user?.phone}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full justify-start"
                >
                  <User className="h-4 w-4" />
                  View Profile
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
