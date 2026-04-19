import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { LucideIcon, LayoutDashboard, Package, Wallet, CreditCard, User, LogOut, FileText } from "lucide-react";
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
  { to: "/packages", icon: Package, label: "Plans" },
  { to: "/wallet", icon: Wallet, label: "Activity" },
  { to: "/wallet/ledger", icon: FileText, label: "Ledger" },
  { to: "/payouts", icon: CreditCard, label: "Redeem" },
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
  const initials = user?.fullName?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-3 pb-3 pointer-events-none">
      <div className="pointer-events-auto bg-card/85 backdrop-blur-2xl border border-border/60 rounded-2xl shadow-elevated">
        <div className="flex items-center justify-around h-[64px] px-1">
          {userNav.map((item) => {
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
            return (
              <RouterNavLink
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 relative py-1"
              >
                <div className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300",
                  isActive ? "bg-gradient-accent shadow-glow scale-110" : "bg-transparent"
                )}>
                  <item.icon className={cn(
                    "h-[18px] w-[18px] transition-colors",
                    isActive ? "text-accent-foreground" : "text-muted-foreground"
                  )} />
                </div>
                <span className={cn(
                  "text-[9px] font-semibold leading-none transition-colors",
                  isActive ? "text-accent" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </RouterNavLink>
            );
          })}

          <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-0.5 flex-1 relative py-1">
                <div className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300",
                  profileActive ? "bg-gradient-accent shadow-glow scale-110" : "bg-transparent"
                )}>
                  <User className={cn(
                    "h-[18px] w-[18px] transition-colors",
                    profileActive ? "text-accent-foreground" : "text-muted-foreground"
                  )} />
                </div>
                <span className={cn(
                  "text-[9px] font-semibold leading-none transition-colors",
                  profileActive ? "text-accent" : "text-muted-foreground"
                )}>
                  Profile
                </span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl">
              <SheetHeader className="text-left">
                <SheetTitle>Profile</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-subtle border border-border">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-accent flex items-center justify-center text-sm font-bold text-accent-foreground shadow-glow">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || user?.phone}</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => { setProfileOpen(false); navigate("/profile"); }} className="w-full justify-start">
                  <User className="h-4 w-4" />
                  View Profile
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
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
