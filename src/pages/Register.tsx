import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, TrendingUp, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import trinityLogo from "@/assets/trinity-arrows-logo.png";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      toast.error("Missing contact", "Provide an email or phone number");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        fullName,
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
        password,
      });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      toast.error("Registration failed", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div aria-hidden className="absolute inset-0 mesh-gradient animate-mesh-drift opacity-90" />
        <div aria-hidden className="absolute top-20 -right-24 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
        <div aria-hidden className="absolute bottom-10 -left-20 h-72 w-72 rounded-full bg-primary-glow/40 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white/95 flex items-center justify-center shadow-glow p-1.5">
              <img src={trinityLogo} alt="Trinity Arrows" className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <span className="block text-xl font-bold tracking-tight">Trinity Arrows</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60">Premium Credits</span>
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-bold leading-tight tracking-tight">
              Start earning credits in minutes.
            </h2>
            <p className="text-base text-primary-foreground/70 leading-relaxed">
              Create your account and your administrator will assign your first plan. Watch rewards arrive on schedule.
            </p>

            <div className="grid grid-cols-1 gap-3 pt-4">
              {[
                { icon: Coins, title: "Zero hidden fees", desc: "Transparent reward cycles" },
                { icon: TrendingUp, title: "Watch it grow", desc: "Live cycle tracking" },
                { icon: ShieldCheck, title: "Verified accounts", desc: "Encrypted account details" },
              ].map((f) => (
                <div key={f.title} className="flex items-center gap-3 p-3 rounded-2xl glass-dark">
                  <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center">
                    <f.icon className="h-4 w-4 text-accent-glow" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-primary-foreground/60">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-primary-foreground/50">© {new Date().getFullYear()} Trinity Arrows. All rights reserved.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative">
        <div aria-hidden className="lg:hidden absolute top-0 left-0 right-0 h-64 bg-gradient-hero" />
        <div aria-hidden className="lg:hidden absolute top-0 left-0 right-0 h-64 mesh-gradient opacity-80" />

        <div className="w-full max-w-sm space-y-6 relative z-10">
          <div className="text-center lg:text-left">
            <div className="lg:hidden h-16 w-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4 shadow-elevated p-2">
              <img src={trinityLogo} alt="Trinity Arrows" className="h-full w-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join the credit platform in seconds</p>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-elevated p-5 animate-scale-in-bounce">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Full Name</label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Phone (optional)</label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" maxLength={10}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Password</label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min 6 characters" minLength={6}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3.5 rounded-xl shadow-glow disabled:opacity-50 active:scale-[0.98] hover:brightness-110 transition-all">
                {submitting ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
