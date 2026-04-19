import { cn } from "@/lib/utils";

export type AutoPayMode = "NONE" | "HALF" | "FULL";

const variantClasses: Record<AutoPayMode, string> = {
  NONE: "bg-muted text-muted-foreground border-border",
  HALF: "bg-info/10 text-info border-info/20",
  FULL: "bg-success/10 text-success border-success/20",
};

const dotClasses: Record<AutoPayMode, string> = {
  NONE: "bg-muted-foreground",
  HALF: "bg-info",
  FULL: "bg-success",
};

interface AutoPayModeBadgeProps {
  mode: AutoPayMode | string;
  className?: string;
}

export function AutoPayModeBadge({ mode, className }: AutoPayModeBadgeProps) {
  const normalized = (mode?.toUpperCase() || "NONE") as AutoPayMode;
  const variant = variantClasses[normalized] ?? variantClasses.NONE;
  const dot = dotClasses[normalized] ?? dotClasses.NONE;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide border",
        variant,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {normalized}
    </span>
  );
}
