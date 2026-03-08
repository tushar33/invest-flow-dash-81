import { UserLayout } from "@/components/UserLayout";
import { User, Mail, Phone, Camera, ChevronRight, Lock, Shield, LogOut, Edit3 } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <UserLayout>
      <div className="space-y-5">
        <h1 className="text-xl font-bold">Profile</h1>

        {/* Avatar Card */}
        <div className="bg-card rounded-2xl border border-border p-5 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl fintech-gradient flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">RS</span>
              </div>
              <button className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-accent flex items-center justify-center border-2 border-card">
                <Camera className="h-3 w-3 text-accent-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <p className="font-bold text-[16px]">Rahul Sharma</p>
              <p className="text-[12px] text-muted-foreground">Member since Jan 2026</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="text-[11px] text-success font-medium">Active Investor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Personal Details</p>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-[11px] text-accent font-semibold flex items-center gap-1"
            >
              <Edit3 className="h-3 w-3" />
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>

          {editMode ? (
            <div className="p-4 pt-2 space-y-3">
              {[
                { label: "Full Name", value: "Rahul Sharma", type: "text" },
                { label: "Email", value: "rahul@example.com", type: "email" },
                { label: "Phone", value: "+91 98765 43210", type: "tel" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{field.label}</label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
              ))}
              <button className="w-full accent-gradient text-accent-foreground text-sm font-semibold py-3 rounded-xl active:scale-[0.98] transition-transform">
                Save Changes
              </button>
            </div>
          ) : (
            <div>
              {[
                { icon: User, label: "Name", value: "Rahul Sharma" },
                { icon: Mail, label: "Email", value: "rahul@example.com" },
                { icon: Phone, label: "Phone", value: "+91 98765 43210" },
              ].map((item, i) => (
                <div key={item.label} className={`flex items-center justify-between p-4 ${i === 0 ? "border-t border-border/50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      <p className="text-[13px] font-medium">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="w-full flex items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-[13px] font-medium">Change Password</span>
            </div>
            <ChevronRight className={`h-4 w-4 text-muted-foreground/50 transition-transform ${showPasswordForm ? "rotate-90" : ""}`} />
          </button>

          {showPasswordForm && (
            <div className="px-4 pb-4 space-y-3 animate-fade-in">
              {[
                { label: "Current Password", placeholder: "Enter current password" },
                { label: "New Password", placeholder: "Enter new password" },
                { label: "Confirm New Password", placeholder: "Re-enter new password" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{field.label}</label>
                  <input
                    type="password"
                    placeholder={field.placeholder}
                    className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
              ))}
              <button className="w-full accent-gradient text-accent-foreground text-sm font-semibold py-3 rounded-xl active:scale-[0.98] transition-transform">
                Update Password
              </button>
            </div>
          )}
        </div>

        {/* Security */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                <Shield className="h-4 w-4 text-accent" />
              </div>
              <span className="text-[13px] font-medium">KYC Status</span>
            </div>
            <span className="text-[10px] font-bold bg-success/15 text-success px-2 py-0.5 rounded-full">Verified</span>
          </div>
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
