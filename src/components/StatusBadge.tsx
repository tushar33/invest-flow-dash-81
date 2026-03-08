import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
  {
    variants: {
      status: {
        pending: "bg-warning/15 text-warning",
        approved: "bg-success/15 text-success",
        rejected: "bg-destructive/15 text-destructive",
        active: "bg-accent/15 text-accent",
        inactive: "bg-muted text-muted-foreground",
        completed: "bg-success/15 text-success",
        paused: "bg-muted text-muted-foreground",
        credited: "bg-accent/15 text-accent",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {children}
    </span>
  );
}
