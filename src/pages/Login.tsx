import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, loginWithPhone, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let loggedInUser;
      if (mode === "email") {
        await login(email, password);
      } else {
        await loginWithPhone(phone, password);
      }
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="h-12 w-12 rounded-2xl fintech-gradient flex items-center justify-center mx-auto mb-3">
            <Shield className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        {/* Toggle email/phone */}
        <div className="flex bg-muted rounded-xl p-1">
          <button onClick={() => setMode("email")} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${mode === "email" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            Email
          </button>
          <button onClick={() => setMode("phone")} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${mode === "phone" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "email" ? (
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Phone</label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="10-digit number" maxLength={10}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Password</label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full accent-gradient text-accent-foreground text-sm font-semibold py-3.5 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform">
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent font-semibold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
