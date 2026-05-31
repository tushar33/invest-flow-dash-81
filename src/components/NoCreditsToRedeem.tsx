import { Link } from "react-router-dom";
import { Gift, Package, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANG } from "@/lib/language";

const links = [
  { to: "/packages", icon: Package, label: LANG.nav.plans },
  { to: "/wallet", icon: Activity, label: LANG.nav.activity },
  { to: "/wallet/ledger", icon: Gift, label: LANG.dashboard.totalRewards },
] as const;

interface NoCreditsToRedeemProps {
  variant?: "compact" | "card";
  className?: string;
}

export function NoCreditsToRedeem({ variant = "card", className }: NoCreditsToRedeemProps) {
  if (variant === "compact") {
    return (
      <div className={cn("mt-3 space-y-2", className)}>
        <p className="text-[12px] font-semibold text-white/90">{LANG.dashboard.noCreditsToRedeem}</p>
        <p className="text-[11px] opacity-75">{LANG.dashboard.noCreditsToRedeemHint}</p>
        <div className="flex flex-wrap gap-2 pt-0.5">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/15 hover:bg-white/25 rounded-full px-2.5 py-1 transition-colors"
            >
              <Icon className="h-3 w-3" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl p-4 border border-border bg-muted/30 animate-slide-up-fade", className)}>
      <p className="text-sm font-semibold text-foreground">{LANG.dashboard.noCreditsToRedeem}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{LANG.dashboard.noCreditsToRedeemHint}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 hover:bg-accent/20 rounded-full px-3 py-1.5 transition-colors"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
