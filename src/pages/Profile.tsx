import { UserLayout } from "@/components/UserLayout";
import { AutoPayModeBadge } from "@/components/AutoPayModeBadge";
import { User, Mail, Phone, ChevronRight, Lock, LogOut, Edit3, Zap } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { profile as profileApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [name, setName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateMutation = useMutation({
    mutationFn: () => profileApi.update({ name, ...(phone ? { phone } : {}) }),
      onSuccess: () => {
      toast({ title: "Profile updated" });
      setEditMode(false);
      refreshUser();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const passwordMutation = useMutation({
    mutationFn: () => {
      if (newPassword !== confirmPassword) throw new Error("Passwords do not match");
      return profileApi.changePassword({ currentPassword, newPassword });
    },
    onSuccess: () => {
      toast({ title: "Password updated" });
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = user?.fullName?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <UserLayout>
      <div className="space-y-5">
        <h1 className="text-xl font-bold">Profile</h1>

        <div className="bg-card rounded-2xl border border-border p-5 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl fintech-gradient flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">{initials}</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-[16px]">{user?.fullName}</p>
              <p className="text-[12px] text-muted-foreground">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="text-[11px] text-success font-medium">{user?.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Personal Details</p>
            <button onClick={() => { setEditMode(!editMode); if (!editMode) { setName(user?.fullName ?? ""); setPhone(user?.phone ?? ""); } }}
              className="text-[11px] text-accent font-semibold flex items-center gap-1">
              <Edit3 className="h-3 w-3" />
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>

          {editMode ? (
            <div className="p-4 pt-2 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} placeholder="10-digit number"
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
              </div>
              <button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}
                className="w-full accent-gradient text-accent-foreground text-sm font-semibold py-3 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform">
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <div>
              {[
                { icon: User, label: "Name", value: user?.fullName },
                { icon: Mail, label: "Email", value: user?.email || "—" },
                { icon: Phone, label: "Phone", value: user?.phone || "—" },
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

        <div className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Auto Redemption</p>
          </div>
          <div className="p-4 pt-0 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                <Zap className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground">Auto Redemption Mode</p>
                <div className="mt-1">
                  <AutoPayModeBadge mode={user?.autoPayMode ?? "NONE"} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Auto Redemption mode is configured by the administrator.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden animate-fade-in">
          <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="w-full flex items-center justify-between p-4">
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
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password"
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters"
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password"
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
              </div>
              <button onClick={() => passwordMutation.mutate()} disabled={passwordMutation.isPending}
                className="w-full accent-gradient text-accent-foreground text-sm font-semibold py-3 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform">
                {passwordMutation.isPending ? "Updating..." : "Update Password"}
              </button>
            </div>
          )}
        </div>

        <button onClick={handleLogout}
          className="w-full bg-card border border-destructive/20 text-destructive text-sm font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-destructive/5 active:scale-[0.98] transition-all">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </UserLayout>
  );
}
