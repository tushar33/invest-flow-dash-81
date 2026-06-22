import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPostAuthPath } from "@/lib/onboarding";
import { Eye, EyeOff, ArrowRight, Sparkles, Globe2, ShieldCheck, TrendingUp } from "lucide-react";
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
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-primary-foreground p-12 flex-col justify-between"
        style={{
          background:
            "linear-gradient(135deg, #061a2e 0%, #0a2540 45%, #0f3a5f 70%, #14b8a6 100%)",
        }}
      >
        {/* Grain overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
        {/* Animated route lines (world-map vibe) */}
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full opacity-25"
          viewBox="0 0 800 800"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="route" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5eead4" stopOpacity="0" />
              <stop offset="50%" stopColor="#5eead4" stopOpacity="1" />
              <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M50,650 Q300,400 500,500 T780,200" stroke="url(#route)" strokeWidth="1.5" strokeDasharray="6 8" />
          <path d="M20,500 Q250,300 450,380 T780,420" stroke="url(#route)" strokeWidth="1" strokeDasharray="4 6" />
          <path d="M100,750 Q400,600 600,650 T780,600" stroke="url(#route)" strokeWidth="1" strokeDasharray="4 6" />
          {[
            [50, 650], [500, 500], [780, 200], [450, 380], [600, 650], [250, 300],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill="#5eead4">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>

        <div aria-hidden className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-cyan-400/15 blur-3xl" />

        {/* Brand: logo embedded directly into gradient (no white tile) */}
        <div className="relative z-10 flex items-center gap-3">
          <img src={trinityLogo} alt={LANG.brand.name} className="h-10 w-10 object-contain drop-shadow-[0_4px_12px_rgba(94,234,212,0.45)]" />
          <div>
            <div className="text-lg font-bold tracking-tight">{LANG.brand.name}</div>
            <div className="text-[10px] uppercase tracking-[0.22em] opacity-70">{LANG.brand.tagline}</div>
          </div>
        </div>

        <div className="relative z-10 space-y-7 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-teal-300" />
            <span>Global Import &amp; Export</span>
          </div>
          <h2 className="text-[2.6rem] leading-[1.05] font-semibold tracking-tight">
            Connecting markets across borders.
          </h2>
          <p className="text-base opacity-80 leading-relaxed">
            Streamlined global trade — manage shipments, partners, and cross-border transactions from a single intelligent platform.
          </p>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: TrendingUp, k: "$2.4B", l: "Shipments tracked" },
              { icon: Globe2, k: "120+", l: "Countries" },
              { icon: ShieldCheck, k: "800+", l: "Trusted exporters" },
            ].map(({ icon: Icon, k, l }) => (
              <div key={l} className="rounded-xl bg-white/[0.06] backdrop-blur border border-white/10 p-3">
                <Icon className="h-4 w-4 text-teal-300 mb-1.5" />
                <div className="text-lg font-semibold tabular-nums">{k}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-70 leading-tight mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs opacity-60">
          © {new Date().getFullYear()} {LANG.brand.name}. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10 relative bg-gradient-to-b from-background to-secondary/40">
        {/* Mobile brand strip */}
        <div className="lg:hidden absolute top-0 inset-x-0 flex items-center justify-center gap-2 py-3 px-4 text-primary-foreground" style={{ background: "linear-gradient(135deg, #0a2540, #14b8a6)" }}>
          <img src={trinityLogo} alt={LANG.brand.name} className="h-6 w-6 object-contain" />
          <span className="text-sm font-semibold tracking-tight">{LANG.brand.name}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-80 ml-1">· {LANG.brand.tagline}</span>
        </div>

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
