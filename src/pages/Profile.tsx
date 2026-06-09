import { UserLayout } from "@/components/UserLayout";
import { GradientCard } from "@/components/ui/gradient-card";
import { User, Mail, Phone, MapPin, ChevronRight, Lock, LogOut, Edit3, Calendar, Home, Hash, Users } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { kyc as kycApi, profile as profileApi, type KycDetails } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { LANG, userAccountStatusLabel } from "@/lib/language";

function toDateInputValue(value?: string | null): string {
  if (!value) return "";
  return value.slice(0, 10);
}

function formatDateDisplay(value?: string | null): string {
  if (!value) return LANG.common.noData;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return LANG.common.noData;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

type KycForm = {
  dateOfBirth: string;
  address: string;
  state: string;
  district: string;
  pincode: string;
  nomineeName: string;
  nomineeRelation: string;
};

const emptyKycForm = (): KycForm => ({
  dateOfBirth: "",
  address: "",
  state: "",
  district: "",
  pincode: "",
  nomineeName: "",
  nomineeRelation: "",
});

function kycToForm(kyc?: KycDetails | null): KycForm {
  if (!kyc) return emptyKycForm();
  return {
    dateOfBirth: toDateInputValue(kyc.dateOfBirth),
    address: kyc.address ?? "",
    state: kyc.state ?? "",
    district: kyc.district ?? "",
    pincode: kyc.pincode ?? "",
    nomineeName: kyc.nomineeName ?? "",
    nomineeRelation: kyc.nomineeRelation ?? "",
  };
}

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [kycEditMode, setKycEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [name, setName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [kycForm, setKycForm] = useState<KycForm>(emptyKycForm());
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: kycDetails } = useQuery({
    queryKey: ["kyc"],
    queryFn: () => kycApi.get(),
  });

  const updateMutation = useMutation({
    mutationFn: () => profileApi.update({
      name,
      ...(phone ? { phone } : {}),
      ...(city.trim() ? { city: city.trim() } : {}),
    }),
      onSuccess: () => {
      toast({ title: LANG.toast.profileUpdated });
      setEditMode(false);
      refreshUser();
    },
    onError: (err: any) => toast({ title: LANG.common.error, description: err.message, variant: "destructive" }),
  });

  const kycUpdateMutation = useMutation({
    mutationFn: () => {
      if (kycForm.pincode.trim() && !/^[0-9]{6}$/.test(kycForm.pincode.trim())) {
        throw new Error(LANG.profile.invalidPincode);
      }
      return kycApi.update({
        dateOfBirth: kycForm.dateOfBirth || undefined,
        address: kycForm.address.trim() || undefined,
        state: kycForm.state.trim() || undefined,
        district: kycForm.district.trim() || undefined,
        pincode: kycForm.pincode.trim() || undefined,
        nomineeName: kycForm.nomineeName.trim() || undefined,
        nomineeRelation: kycForm.nomineeRelation.trim() || undefined,
      });
    },
    onSuccess: () => {
      toast({ title: LANG.toast.addressDetailsUpdated });
      setKycEditMode(false);
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
    },
    onError: (err: any) => toast({ title: LANG.common.error, description: err.message, variant: "destructive" }),
  });

  const passwordMutation = useMutation({
    mutationFn: () => {
      if (newPassword !== confirmPassword) throw new Error(LANG.profile.passwordsMismatch);
      return profileApi.changePassword({ currentPassword, newPassword });
    },
    onSuccess: () => {
      toast({ title: LANG.toast.passwordUpdated });
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => toast({ title: LANG.common.error, description: err.message, variant: "destructive" }),
  });

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = user?.fullName?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || LANG.dashboard.fallbackName[0];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-xl border-b border-border/60 animate-slide-up-fade">
          <h1 className="text-2xl font-bold tracking-tight">{LANG.common.profile}</h1>
        </div>

        <GradientCard variant="hero" glow className="animate-slide-up-fade">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
              <span className="text-xl font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[17px] truncate">{user?.fullName}</p>
              {user?.id && (
                <p className="text-[11px] opacity-80 font-mono truncate" title={user.id}>
                  ID: {user.id}
                </p>
              )}
              <p className="text-[12px] opacity-80">
                {user?.createdAt
                  ? LANG.common.memberSince(new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }))
                  : ""}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                <span className="text-[11px] text-accent font-semibold">{userAccountStatusLabel(user?.status)}</span>
              </div>
            </div>
          </div>
        </GradientCard>

        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up-fade">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.common.personalDetails}</p>
            <button onClick={() => { setEditMode(!editMode); if (!editMode) { setName(user?.fullName ?? ""); setPhone(user?.phone ?? ""); setCity(user?.city ?? ""); } }}
              className="text-[11px] text-accent font-semibold flex items-center gap-1 hover:text-accent/80 transition-colors">
              <Edit3 className="h-3 w-3" />
              {editMode ? LANG.common.cancel : LANG.common.edit}
            </button>
          </div>

          {editMode ? (
            <div className="p-4 pt-2 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.common.fullName}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.common.phone}</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} placeholder={LANG.auth.phonePlaceholder}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.common.city}</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder={LANG.auth.cityPlaceholder}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all" />
              </div>
              <button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}
                className="w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform shadow-glow">
                {updateMutation.isPending ? LANG.common.saving : LANG.common.saveChanges}
              </button>
            </div>
          ) : (
            <div>
              {[
                { icon: User, label: LANG.common.name, value: user?.fullName },
                { icon: Mail, label: LANG.common.email, value: user?.email || LANG.common.noData },
                { icon: Phone, label: LANG.common.phone, value: user?.phone || LANG.common.noData },
                { icon: MapPin, label: LANG.common.city, value: user?.city || LANG.common.noData },
              ].map((item, i) => (
                <div key={item.label} className={`flex items-center justify-between p-4 ${i === 0 ? "border-t border-border/50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{item.label}</p>
                      <p className="text-[13px] font-medium">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up-fade">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.profile.addressAndNominee}</p>
            <button
              onClick={() => {
                setKycEditMode(!kycEditMode);
                if (!kycEditMode) setKycForm(kycToForm(kycDetails));
              }}
              className="text-[11px] text-accent font-semibold flex items-center gap-1 hover:text-accent/80 transition-colors"
            >
              <Edit3 className="h-3 w-3" />
              {kycEditMode ? LANG.common.cancel : LANG.common.edit}
            </button>
          </div>

          {kycEditMode ? (
            <div className="p-4 pt-2 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.profile.dateOfBirth}</label>
                <input
                  type="date"
                  value={kycForm.dateOfBirth}
                  onChange={(e) => setKycForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.profile.address}</label>
                <input
                  type="text"
                  value={kycForm.address}
                  onChange={(e) => setKycForm((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder={LANG.profile.addressPlaceholder}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.profile.state}</label>
                  <input
                    type="text"
                    value={kycForm.state}
                    onChange={(e) => setKycForm((prev) => ({ ...prev, state: e.target.value }))}
                    placeholder={LANG.profile.statePlaceholder}
                    className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.profile.district}</label>
                  <input
                    type="text"
                    value={kycForm.district}
                    onChange={(e) => setKycForm((prev) => ({ ...prev, district: e.target.value }))}
                    placeholder={LANG.profile.districtPlaceholder}
                    className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.profile.pincode}</label>
                <input
                  type="text"
                  value={kycForm.pincode}
                  onChange={(e) => setKycForm((prev) => ({ ...prev, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                  placeholder={LANG.profile.pincodePlaceholder}
                  maxLength={6}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.profile.nomineeName}</label>
                <input
                  type="text"
                  value={kycForm.nomineeName}
                  onChange={(e) => setKycForm((prev) => ({ ...prev, nomineeName: e.target.value }))}
                  placeholder={LANG.profile.nomineeNamePlaceholder}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.profile.nomineeRelation}</label>
                <input
                  type="text"
                  value={kycForm.nomineeRelation}
                  onChange={(e) => setKycForm((prev) => ({ ...prev, nomineeRelation: e.target.value }))}
                  placeholder={LANG.profile.nomineeRelationPlaceholder}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
              <button
                onClick={() => kycUpdateMutation.mutate()}
                disabled={kycUpdateMutation.isPending}
                className="w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform shadow-glow"
              >
                {kycUpdateMutation.isPending ? LANG.common.saving : LANG.common.saveChanges}
              </button>
            </div>
          ) : (
            <div>
              {[
                { icon: Calendar, label: LANG.profile.dateOfBirth, value: formatDateDisplay(kycDetails?.dateOfBirth) },
                { icon: Home, label: LANG.profile.address, value: kycDetails?.address || LANG.common.noData },
                { icon: MapPin, label: LANG.profile.state, value: kycDetails?.state || LANG.common.noData },
                { icon: MapPin, label: LANG.profile.district, value: kycDetails?.district || LANG.common.noData },
                { icon: Hash, label: LANG.profile.pincode, value: kycDetails?.pincode || LANG.common.noData },
                { icon: User, label: LANG.profile.nomineeName, value: kycDetails?.nomineeName || LANG.common.noData },
                { icon: Users, label: LANG.profile.nomineeRelation, value: kycDetails?.nomineeRelation || LANG.common.noData },
              ].map((item, i) => (
                <div key={item.label} className={`flex items-center justify-between p-4 ${i === 0 ? "border-t border-border/50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{item.label}</p>
                      <p className="text-[13px] font-medium">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up-fade">
          <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-[13px] font-medium">{LANG.common.changePassword}</span>
            </div>
            <ChevronRight className={`h-4 w-4 text-muted-foreground/50 transition-transform ${showPasswordForm ? "rotate-90" : ""}`} />
          </button>

          {showPasswordForm && (
            <div className="px-4 pb-4 space-y-3 animate-fade-in">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.common.currentPassword}</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder={LANG.profile.currentPasswordPlaceholder}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.common.newPassword}</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={LANG.auth.passwordMinPlaceholder}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.common.confirmNewPassword}</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={LANG.profile.confirmPasswordPlaceholder}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
              </div>
              <button onClick={() => passwordMutation.mutate()} disabled={passwordMutation.isPending}
                className="w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform shadow-glow">
                {passwordMutation.isPending ? LANG.common.updating : LANG.common.updatePassword}
              </button>
            </div>
          )}
        </div>

        <button onClick={handleLogout}
          className="w-full bg-card border border-destructive/20 text-destructive text-sm font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-destructive/5 hover:border-destructive/40 active:scale-[0.98] transition-all shadow-card">
          <LogOut className="h-4 w-4" />
          {LANG.common.signOut}
        </button>
      </div>
    </UserLayout>
  );
}
