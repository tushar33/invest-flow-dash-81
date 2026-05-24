import { ReactNode, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/trinity-arrows-logo.png";
import { LANG, PUBLIC_NAV } from "@/lib/language";

interface Props {
  children: ReactNode;
  /** Use transparent navbar over hero (homepage). */
  transparentTop?: boolean;
}

export default function PublicLayout({ children, transparentTop = false }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  const isTransparent = transparentTop && !scrolled && !open;

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent border-b border-white/10"
            : "bg-white/90 backdrop-blur-xl border-b border-neutral-200 shadow-sm"
        }`}
      >
        <div className="container flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-1.5">
            <img src={logo} alt={LANG.brand.name} className="w-20 h-20 object-contain" />
            <div className="leading-tight">
              <div className={`font-bold text-xl ${isTransparent ? "text-white" : "text-neutral-900"}`}>
                {LANG.brand.name}
              </div>
              <div className={`text-[10px] uppercase tracking-[0.2em] ${isTransparent ? "text-white/70" : "text-emerald-700"}`}>
                {LANG.brand.tagline}
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {PUBLIC_NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative py-2 ${
                    isActive
                      ? isTransparent
                        ? "text-white"
                        : "text-emerald-700"
                      : isTransparent
                      ? "text-white/80 hover:text-white"
                      : "text-neutral-700 hover:text-emerald-700"
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300 ${
                    "after:w-0 hover:after:w-full"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button
              onClick={() => navigate("/login")}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-7 h-11 font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
            >
              {LANG.common.joinUs}
            </Button>
          </div>

          <button
            className={`lg:hidden p-2 rounded-md ${isTransparent ? "text-white" : "text-neutral-900"}`}
            onClick={() => setOpen(!open)}
            aria-label={LANG.brand.menuAria}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden bg-white border-t border-neutral-200">
            <div className="container py-4 flex flex-col gap-1">
              {PUBLIC_NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    `text-sm font-medium py-3 px-3 rounded-lg ${
                      isActive ? "bg-emerald-50 text-emerald-700" : "text-neutral-700 hover:bg-neutral-50"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <Button
                onClick={() => navigate("/login")}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full mt-3 h-11 font-semibold"
              >
                {LANG.common.joinUs}
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className={`flex-1 ${transparentTop ? "" : "pt-20"}`}>{children}</main>

      <footer className="bg-neutral-950 text-neutral-300 mt-24">
        <div className="container py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-1.5 mb-5">
              <img src={logo} alt={LANG.brand.name} className="w-16 h-16 object-contain" />
              <div className="leading-tight">
                <div className="font-bold text-lg text-white">{LANG.brand.name}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-400">{LANG.brand.tagline}</div>
              </div>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {LANG.public.footerDescription}
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                  aria-label={LANG.brand.socialLinkAria}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">{LANG.public.company}</h4>
            <ul className="space-y-2.5 text-sm">
              {PUBLIC_NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-neutral-400 hover:text-emerald-400 transition-colors">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">{LANG.nav.services}</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              {LANG.public.footerServices.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">{LANG.public.getInTouch}</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" /> {LANG.public.contactEmail}
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                {LANG.public.contactAddress}
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800">
          <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
            <div>{LANG.brand.copyright(new Date().getFullYear())}</div>
            <div className="flex gap-5">
              <a href="#" className="hover:text-neutral-300">{LANG.public.privacy}</a>
              <a href="#" className="hover:text-neutral-300">{LANG.public.terms}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
