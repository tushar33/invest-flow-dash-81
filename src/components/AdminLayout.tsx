import { ReactNode, useState } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Package, CreditCard, TrendingUp, Settings, User, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const adminMobileNav = [
  { to: "/admin", icon: LayoutDashboard, label: "Home" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/packages", icon: Package, label: "Packages" },
  { to: "/admin/payouts", icon: CreditCard, label: "Payouts" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

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

          {/* Profile Sheet */}
          <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-0.5 flex-1">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground">Profile</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl">
              <SheetHeader className="text-left">
                <SheetTitle>Admin Profile</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || user?.phone}</p>
                    <p className="text-[10px] text-accent font-semibold mt-0.5">ADMIN</p>
                  </div>
                </div>
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
      </nav>
    </div>
  );
}
