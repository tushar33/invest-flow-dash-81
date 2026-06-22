import { Sparkles, Globe2, ShieldCheck, TrendingUp } from "lucide-react";
import trinityLogo from "@/assets/trinity-arrows-logo.png";
import { LANG } from "@/lib/language";

export function AuthBrandPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-primary-foreground p-12 flex-col"
      style={{
        background:
          "linear-gradient(135deg, #061a2e 0%, #0a2540 45%, #0f3a5f 70%, #14b8a6 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
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

      <div className="relative z-10 flex flex-col justify-between flex-1 w-full max-w-md">
        <div className="flex items-center gap-1.5">
          <img
            src={trinityLogo}
            alt={LANG.brand.name}
            className="h-16 w-16 shrink-0 object-contain object-left drop-shadow-[0_4px_16px_rgba(94,234,212,0.5)]"
          />
          <div className="flex flex-col justify-center -ml-0.5">
            <div className="text-xl font-bold tracking-tight leading-none">{LANG.brand.name}</div>
            <div className="text-[11px] uppercase tracking-[0.22em] opacity-70 leading-none mt-1.5">
              {LANG.brand.tagline}
            </div>
          </div>
        </div>

        <div className="space-y-7">
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

        <div className="text-xs opacity-60">
          © {new Date().getFullYear()} {LANG.brand.name}. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export function AuthMobileBrandStrip() {
  return (
    <div
      className="lg:hidden absolute top-0 inset-x-0 flex items-center justify-center gap-2 py-3 px-4 text-primary-foreground"
      style={{ background: "linear-gradient(135deg, #0a2540, #14b8a6)" }}
    >
      <img src={trinityLogo} alt={LANG.brand.name} className="h-6 w-6 object-contain" />
      <span className="text-sm font-semibold tracking-tight">{LANG.brand.name}</span>
      <span className="text-[10px] uppercase tracking-[0.2em] opacity-80 ml-1">· {LANG.brand.tagline}</span>
    </div>
  );
}
