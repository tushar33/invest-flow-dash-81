import { cn } from "@/lib/utils";

export type AutoPayMode = "NONE" | "HALF" | "FULL";

const variantClasses: Record<AutoPayMode, string> = {
  NONE: "bg-muted text-muted-foreground",
  HALF: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  FULL: "bg-success/15 text-success",
};

interface AutoPayModeBadgeProps {
  mode: AutoPayMode | string;
  className?: string;
}

export function AutoPayModeBadge({ mode, className }: AutoPayModeBadgeProps) {
  const normalized = (mode?.toUpperCase() || "NONE") as AutoPayMode;
  const variant = variantClasses[normalized] ?? variantClasses.NONE;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        variant,
        className
      )}
    >
      {normalized}
    </span>
  );
}
