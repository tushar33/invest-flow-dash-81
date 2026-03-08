import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  iconClassName?: string;
}

export function StatCard({ label, value, icon: Icon, trend, trendUp, className, iconClassName }: StatCardProps) {
  return (
    <div className={cn("rounded-lg bg-card p-4 shadow-sm border border-border animate-fade-in", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", iconClassName || "bg-accent/10")}>
          <Icon className={cn("h-4 w-4", iconClassName ? "text-primary-foreground" : "text-accent")} />
        </div>
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      {trend && (
        <p className={cn("text-xs mt-1 font-medium", trendUp ? "text-success" : "text-destructive")}>
          {trendUp ? "↑" : "↓"} {trend}
        </p>
      )}
    </div>
  );
}
