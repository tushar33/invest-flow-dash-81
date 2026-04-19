import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide border",
  {
    variants: {
      status: {
        pending: "bg-warning/10 text-warning border-warning/20",
        approved: "bg-success/10 text-success border-success/20",
        rejected: "bg-destructive/10 text-destructive border-destructive/20",
        active: "bg-accent/10 text-accent border-accent/20",
        inactive: "bg-muted text-muted-foreground border-border",
        completed: "bg-success/10 text-success border-success/20",
        paused: "bg-muted text-muted-foreground border-border",
        credited: "bg-accent/10 text-accent border-accent/20",
      },
    },
    defaultVariants: { status: "pending" },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
  withDot?: boolean;
}

const DOT_COLOR: Record<string, string> = {
  pending: "bg-warning animate-dot-pulse",
  approved: "bg-success",
  rejected: "bg-destructive",
  active: "bg-accent animate-dot-pulse",
  inactive: "bg-muted-foreground",
  completed: "bg-success",
  paused: "bg-muted-foreground",
  credited: "bg-accent",
};

export function StatusBadge({ status, children, className, withDot = true }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {withDot && <span className={cn("h-1.5 w-1.5 rounded-full", DOT_COLOR[status ?? "pending"])} />}
      {children}
    </span>
  );
}
