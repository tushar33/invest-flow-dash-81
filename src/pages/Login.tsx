import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPostAuthPath } from "@/lib/onboarding";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import trinityLogo from "@/assets/trinity-arrows-logo.png";
import { AuthBrandPanel, AuthMobileBrandStrip } from "@/components/AuthBrandPanel";
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
      <AuthBrandPanel />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10 relative bg-gradient-to-b from-background to-secondary/40">
        <AuthMobileBrandStrip />

        <div className="w-full max-w-[420px] relative z-10 animate-slide-up-fade mt-14 lg:mt-0">
          {/* Card */}
          <div className="relative rounded-2xl bg-card border border-border/70 shadow-elevated p-7 sm:p-8 overflow-hidden">
            {/* Top accent bar */}
            <div aria-hidden className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-teal-400 to-cyan-400" />

            {/* Mono brand mark on form side */}
            <div className="flex items-center gap-2 mb-6">
              <img src={trinityLogo} alt="" className="h-7 w-7 object-contain opacity-90" />
              <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-semibold">{LANG.brand.name}</span>
            </div>

            <div className="mb-6">
              <h1 className="text-[34px] leading-tight font-semibold tracking-tight text-foreground">
                Sign in
              </h1>
              <p className="text-sm text-foreground/70 mt-1.5">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="identifier" className="text-sm font-medium text-foreground">
                  User ID
                </label>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder={LANG.auth.identifierPlaceholder}
                  className="mt-1.5 w-full h-12 px-4 rounded-xl bg-secondary/60 border border-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent focus:bg-card transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-accent hover:underline underline-offset-4"
                  >
                    {LANG.auth.forgotPassword}
                  </Link>
                </div>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={LANG.common.passwordPlaceholder}
                    className="w-full h-12 pl-4 pr-12 rounded-xl bg-secondary/60 border border-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent focus:bg-card transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group w-full h-12 bg-gradient-accent text-accent-foreground text-sm font-semibold rounded-xl shadow-[0_10px_24px_-10px_hsl(var(--accent)/0.6)] disabled:opacity-60 active:translate-y-0 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-12px_hsl(var(--accent)/0.7)] hover:brightness-110 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    {LANG.auth.signingIn}
                  </>
                ) : (
                  <>
                    {LANG.common.signIn}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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
    </div>
  );
}
