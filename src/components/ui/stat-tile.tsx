import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatTileProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  hint?: string;
  trend?: { value: string; up?: boolean };
  accent?: "default" | "success" | "warning" | "info" | "primary";
  className?: string;
}

const ACCENT: Record<NonNullable<StatTileProps["accent"]>, { wrap: string; icon: string }> = {
  default: { wrap: "bg-accent/10", icon: "text-accent" },
  success: { wrap: "bg-success/10", icon: "text-success" },
  warning: { wrap: "bg-warning/15", icon: "text-warning" },
  info:    { wrap: "bg-info/10", icon: "text-info" },
  primary: { wrap: "bg-primary/10", icon: "text-primary" },
};

export function StatTile({ label, value, icon: Icon, hint, trend, accent = "default", className }: StatTileProps) {
  const a = ACCENT[accent];
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border border-border p-4 shadow-card",
        "transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 hover:border-accent/30",
        "animate-slide-up-fade",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="mt-1.5 text-xl font-bold text-foreground tabular-nums truncate">{value}</p>
          {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
          {trend && (
            <p className={cn("text-[11px] mt-1 font-medium", trend.up ? "text-success" : "text-destructive")}>
              {trend.up ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={cn("h-9 w-9 shrink-0 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110", a.wrap)}>
          <Icon className={cn("h-4 w-4", a.icon)} />
        </div>
      </div>
      {/* hover sheen */}
      <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
