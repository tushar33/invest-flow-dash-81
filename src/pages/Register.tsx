import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPostAuthPath } from "@/lib/onboarding";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import trinityLogo from "@/assets/trinity-arrows-logo.png";
import { AuthBrandPanel, AuthMobileBrandStrip } from "@/components/AuthBrandPanel";
import { LANG } from "@/lib/language";

const inputClassName =
  "mt-1.5 w-full h-12 px-4 rounded-xl bg-secondary/60 border border-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent focus:bg-card transition-all";

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
      const registeredUser = await register({
        fullName,
        email,
        phone: phone.trim(),
        city: city.trim(),
        password,
      });
      navigate(getPostAuthPath(registeredUser), { replace: true });
    } catch (err: any) {
      toast.error(LANG.auth.registrationFailed, err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AuthBrandPanel />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-10 relative overflow-y-auto bg-gradient-to-b from-background to-secondary/40">
        <AuthMobileBrandStrip />

        <div className="w-full max-w-[420px] relative z-10 animate-slide-up-fade mt-14 lg:mt-0">
          <div className="relative rounded-2xl bg-card border border-border/70 shadow-elevated p-7 sm:p-8 overflow-hidden">
            <div aria-hidden className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-teal-400 to-cyan-400" />

            <div className="flex items-center gap-2 mb-6">
              <img src={trinityLogo} alt="" className="h-7 w-7 object-contain opacity-90" />
              <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-semibold">{LANG.brand.name}</span>
            </div>

            <div className="mb-6">
              <h1 className="text-[34px] leading-tight font-semibold tracking-tight text-foreground">
                {LANG.auth.createAccount}
              </h1>
              <p className="text-sm text-foreground/70 mt-1.5">{LANG.auth.registerSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  {LANG.common.fullName}
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder={LANG.auth.fullNamePlaceholder}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  {LANG.common.email}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder={LANG.auth.emailPlaceholder}
                  className={inputClassName}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    {LANG.common.phone}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoComplete="tel"
                    placeholder={LANG.auth.phonePlaceholder}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label htmlFor="city" className="text-sm font-medium text-foreground">
                    {LANG.common.city}
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    autoComplete="address-level2"
                    placeholder={LANG.auth.cityPlaceholder}
                    className={inputClassName}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  {LANG.auth.password}
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder={LANG.auth.passwordMinPlaceholder}
                    minLength={6}
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
                    {LANG.auth.creatingAccount}
                  </>
                ) : (
                  <>
                    {LANG.auth.createAccount}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {LANG.auth.hasAccount}{" "}
              <Link to="/login" className="text-accent font-semibold hover:underline underline-offset-4">
                {LANG.common.signIn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
