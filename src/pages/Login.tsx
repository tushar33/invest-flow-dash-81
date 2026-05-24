import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User, Lock, Eye, EyeOff } from "lucide-react";
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
      else navigate("/dashboard", { replace: true });
    } catch (err: any) {
      toast.error(LANG.auth.loginFailed, err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-gradient-hero opacity-10" />
      <div aria-hidden className="absolute top-0 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div aria-hidden className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-primary-glow/20 blur-3xl" />

      <div className="w-full max-w-sm space-y-4 relative z-10">
        <div className="text-center">
          <div className="h-20 w-20 flex items-center justify-center mx-auto mb-2">
            <img src={trinityLogo} alt={LANG.brand.name} className="h-full w-full object-contain drop-shadow-[0_0_20px_hsl(var(--accent)/0.6)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{LANG.brand.name}</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{LANG.brand.tagline}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-elevated p-5 space-y-4 animate-scale-in-bounce">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                {LANG.auth.identifierLabel}
              </label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder={LANG.auth.identifierPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{LANG.auth.password}</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder={LANG.common.passwordPlaceholder}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3 rounded-xl shadow-glow disabled:opacity-50 active:scale-[0.98] hover:brightness-110 transition-all">
              {submitting ? LANG.auth.signingIn : LANG.common.signIn}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {LANG.auth.noAccount}{" "}
          <Link to="/register" className="text-accent font-semibold hover:underline">{LANG.auth.createOne}</Link>
        </p>
      </div>
    </div>
  );
}
