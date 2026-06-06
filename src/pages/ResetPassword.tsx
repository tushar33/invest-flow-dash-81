import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/api";
import { LANG } from "@/lib/language";
import trinityLogo from "@/assets/trinity-arrows-logo.png";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(LANG.common.error, LANG.auth.passwordsDoNotMatch);
      return;
    }
    setSubmitting(true);
    try {
      await auth.resetPassword({ token, newPassword });
      toast.success(LANG.auth.passwordResetSuccess, LANG.auth.passwordResetSuccessDescription);
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : LANG.common.error;
      toast.error(LANG.common.error, message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
        <div className="w-full max-w-sm space-y-6 relative z-10 text-center animate-slide-up-fade">
          <div className="h-16 w-16 flex items-center justify-center mx-auto mb-3 rounded-2xl bg-card shadow-elevated p-2">
            <img src={trinityLogo} alt={LANG.brand.name} className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{LANG.auth.invalidResetLink}</h1>
          <p className="text-sm text-muted-foreground">{LANG.auth.invalidResetLinkDescription}</p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center justify-center gap-2 bg-gradient-accent text-accent-foreground text-sm font-semibold py-3.5 px-6 rounded-xl shadow-glow hover:brightness-110 transition-all"
          >
            {LANG.auth.requestNewLink}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-gradient-hero opacity-10" />
      <div aria-hidden className="absolute top-0 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div aria-hidden className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-primary-glow/20 blur-3xl" />

      <div className="w-full max-w-sm space-y-6 relative z-10 animate-slide-up-fade">
        <div className="text-center">
          <div className="h-16 w-16 flex items-center justify-center mx-auto mb-3 rounded-2xl bg-card shadow-elevated p-2">
            <img src={trinityLogo} alt={LANG.brand.name} className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{LANG.auth.resetPasswordTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1.5">{LANG.auth.resetPasswordDescription}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-elevated p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                {LANG.common.newPassword}
              </label>
              <div className="relative mt-1.5 group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input
                  type={showPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder={LANG.auth.passwordMinPlaceholder}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-input bg-background text-sm shadow-card focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                {LANG.common.confirmNewPassword}
              </label>
              <div className="relative mt-1.5 group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input
                  type={showPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder={LANG.auth.passwordMinPlaceholder}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-sm shadow-card focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3.5 rounded-xl shadow-glow disabled:opacity-50 active:scale-[0.98] hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {LANG.auth.resettingPassword}
                </>
              ) : (
                <>
                  {LANG.auth.resetPassword}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-accent font-semibold hover:underline underline-offset-4">
            {LANG.auth.backToSignIn}
          </Link>
        </p>
      </div>
    </div>
  );
}
