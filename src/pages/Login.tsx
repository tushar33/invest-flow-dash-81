import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPostAuthPath } from "@/lib/onboarding";
import { User, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import trinityLogo from "@/assets/trinity-arrows-logo.png";
import { LANG } from "@/lib/language";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const loggedInUser = await login(identifier, password);
      if (loggedInUser.role === "ADMIN") navigate("/admin", { replace: true });
      else navigate(getPostAuthPath(loggedInUser), { replace: true });
    } catch (err: any) {
      toast.error(LANG.auth.loginFailed, err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left brand panel (desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-hero text-primary-foreground p-12 flex-col justify-between">
        <div aria-hidden className="absolute inset-0 mesh-gradient opacity-70 animate-mesh-drift" />
        <div aria-hidden className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/95 backdrop-blur p-1.5 flex items-center justify-center shadow-elevated">
            <img src={trinityLogo} alt={LANG.brand.name} className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">{LANG.brand.name}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-70">{LANG.brand.tagline}</div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-accent-glow" />
            <span>Global Import &amp; Export</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Connecting markets across borders.
          </h2>
          <p className="text-base opacity-80 leading-relaxed">
            Streamlined global trade — manage shipments, partners, and cross-border transactions from a single intelligent platform.
          </p>
        </div>

        <div className="relative z-10 text-xs opacity-60">
          © {new Date().getFullYear()} {LANG.brand.name}. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10 relative">
        <div aria-hidden className="lg:hidden absolute inset-0 bg-gradient-hero opacity-[0.06]" />
        <div aria-hidden className="lg:hidden absolute top-0 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div aria-hidden className="lg:hidden absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-primary-glow/20 blur-3xl" />

        <div className="w-full max-w-sm relative z-10 animate-slide-up-fade">
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-6">
            <div className="h-16 w-16 mx-auto mb-3 rounded-2xl bg-card shadow-elevated p-2 flex items-center justify-center">
              <img src={trinityLogo} alt={LANG.brand.name} className="h-full w-full object-contain" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">{LANG.brand.name}</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{LANG.brand.tagline}</p>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Sign in</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                {LANG.auth.identifierLabel}
              </label>
              <div className="relative mt-1.5 group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder={LANG.auth.identifierPlaceholder}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-card text-sm shadow-card focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{LANG.auth.password}</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-medium text-accent hover:underline underline-offset-4"
                >
                  {LANG.auth.forgotPassword}
                </Link>
              </div>
              <div className="relative mt-1.5 group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={LANG.common.passwordPlaceholder}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-input bg-card text-sm shadow-card focus:outline-none focus:ring-4 focus:ring-accent/15 focus:border-accent transition-all"
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

            <button
              type="submit"
              disabled={submitting}
              className="group w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3.5 rounded-xl shadow-glow disabled:opacity-50 active:scale-[0.98] hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {LANG.auth.signingIn}
                </>
              ) : (
                <>
                  {LANG.common.signIn}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {LANG.auth.noAccount}{" "}
            <Link to="/register" className="text-accent font-semibold hover:underline underline-offset-4">
              {LANG.auth.createOne}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
