import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, Lock, Eye, EyeOff, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import trinityLogo from "@/assets/trinity-arrows-logo.png";
import { LANG } from "@/lib/language";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone.trim())) {
      toast.error(LANG.auth.registrationFailed, LANG.auth.phonePlaceholder);
      return;
    }
    setSubmitting(true);
    try {
      await register({
        fullName,
        email,
        phone: phone.trim(),
        city: city.trim(),
        password,
      });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      toast.error(LANG.auth.registrationFailed, err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-gradient-hero opacity-10" />
      <div aria-hidden className="absolute top-0 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      <div aria-hidden className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-primary-glow/20 blur-3xl" />

      <div className="w-full max-w-sm space-y-6 relative z-10">
        <div className="text-center">
          <div className="h-24 w-24 flex items-center justify-center mx-auto mb-3">
            <img src={trinityLogo} alt={LANG.brand.name} className="h-full w-full object-contain drop-shadow-[0_0_20px_hsl(var(--accent)/0.6)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{LANG.brand.name}</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">{LANG.brand.tagline}</p>
          
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-elevated p-5 animate-scale-in-bounce">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{LANG.common.fullName}</label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder={LANG.auth.fullNamePlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{LANG.common.email}</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={LANG.auth.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{LANG.common.phone}</label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder={LANG.auth.phonePlaceholder} maxLength={10} pattern="[0-9]{10}"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{LANG.common.city}</label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder={LANG.auth.cityPlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{LANG.auth.password}</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder={LANG.auth.passwordMinPlaceholder} minLength={6}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3.5 rounded-xl shadow-glow disabled:opacity-50 active:scale-[0.98] hover:brightness-110 transition-all">
              {submitting ? LANG.auth.creatingAccount : LANG.auth.createAccount}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {LANG.auth.hasAccount}{" "}
          <Link to="/login" className="text-accent font-semibold hover:underline">{LANG.common.signIn}</Link>
        </p>
      </div>
    </div>
  );
}
