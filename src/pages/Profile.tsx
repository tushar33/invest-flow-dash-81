import { UserLayout } from "@/components/UserLayout";
import { User, Mail, Phone, Shield, LogOut, ChevronRight, Camera, Settings, HelpCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const profileMenu = [
  { icon: Settings, label: "Account Settings", to: "#", color: "text-muted-foreground" },
  { icon: Shield, label: "Security", to: "#", color: "text-muted-foreground" },
  { icon: FileText, label: "Documents & KYC", to: "#", color: "text-accent", badge: "Verified" },
  { icon: HelpCircle, label: "Help & Support", to: "#", color: "text-muted-foreground" },
];

export default function Profile() {
  return (
    <UserLayout>
      <div className="space-y-5">
        <h1 className="text-xl font-bold">Profile</h1>

        {/* Avatar Card */}
        <div className="bg-card rounded-2xl border border-border p-5 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl fintech-gradient flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">AJ</span>
              </div>
              <button className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-accent flex items-center justify-center border-2 border-card">
                <Camera className="h-3 w-3 text-accent-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <p className="font-bold text-[16px]">Alex Johnson</p>
              <p className="text-[12px] text-muted-foreground">Member since Jan 2026</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="text-[11px] text-success font-medium">Active Investor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in">
          <div className="px-4 pt-3 pb-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Contact Info</p>
          </div>
          {[
            { icon: Mail, label: "Email", value: "alex@example.com" },
            { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
          ].map((item, i) => (
            <div key={item.label} className={`flex items-center justify-between p-4 ${i === 0 ? "border-t border-border/50" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                  <p className="text-[13px] font-medium">{item.value}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            </div>
          ))}
        </div>

        {/* Menu Items */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in">
          {profileMenu.map((item, i) => (
            <Link key={item.label} to={item.to} className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${i < profileMenu.length - 1 ? "border-b border-border/50" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <span className="text-[13px] font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-[10px] font-bold bg-success/15 text-success px-2 py-0.5 rounded-full">{item.badge}</span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              </div>
            </Link>
          ))}
        </div>

        {/* Sign Out */}
        <button className="w-full bg-card border border-destructive/20 text-destructive text-sm font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-destructive/5 active:scale-[0.98] transition-all">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </UserLayout>
  );
}
