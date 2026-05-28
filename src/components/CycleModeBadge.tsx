import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cycleModeLabel, parseCycleMode } from "@/lib/cycle-schedule";

interface CycleModeBadgeProps {
  mode?: string | null;
  className?: string;
}

export function CycleModeBadge({ mode, className }: CycleModeBadgeProps) {
  const parsed = parseCycleMode(mode);
  const isCalendar = parsed === "CALENDAR_MONTHLY";

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        isCalendar
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      {cycleModeLabel(mode)}
    </Badge>
  );
}
