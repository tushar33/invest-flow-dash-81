import { ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf } from "lucide-react";

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white">
              <Leaf className="w-5 h-5" />
            </span>
            <span>FreshHarvest</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-emerald-600" : "text-foreground/70 hover:text-foreground"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button
              onClick={() => navigate("/login")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6"
            >
              Join Us
            </Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container py-4 flex flex-col gap-3">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-medium py-2 ${isActive ? "text-emerald-600" : "text-foreground/70"}`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full mt-2"
              >
                Join Us
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-muted/30 mt-16">
        <div className="container py-10 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white">
                <Leaf className="w-4 h-4" />
              </span>
              FreshHarvest
            </div>
            <p className="text-sm text-muted-foreground">
              Global fruit import & export solutions delivering quality produce worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="hover:text-foreground">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>info@freshharvest.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Trade Avenue, Mumbai, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FreshHarvest. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
