import { UserLayout } from "@/components/UserLayout";
import { User, Mail, Phone, Shield, LogOut } from "lucide-react";

export default function Profile() {
  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 text-center animate-fade-in">
          <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
            <User className="h-10 w-10 text-accent" />
          </div>
          <p className="font-bold text-lg mt-3">Alex Johnson</p>
          <p className="text-sm text-muted-foreground">Member since Jan 2026</p>
        </div>

        <div className="bg-card rounded-xl border border-border divide-y divide-border animate-fade-in">
          {[
            { icon: Mail, label: "Email", value: "alex@example.com" },
            { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
            { icon: Shield, label: "KYC Status", value: "Verified", valueClass: "text-success" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className={`text-sm ${item.valueClass || "text-muted-foreground"}`}>{item.value}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button className="w-full bg-card border border-border text-foreground text-sm font-medium py-3 rounded-xl hover:bg-muted transition-colors">
            Edit Profile
          </button>
          <button className="w-full bg-card border border-border text-sm font-medium py-3 rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-2 text-destructive">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </UserLayout>
  );
}
