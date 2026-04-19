import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientCardProps {
  children: ReactNode;
  className?: string;
  variant?: "hero" | "accent" | "primary";
  glow?: boolean;
}

/**
 * Premium gradient surface used for hero KPIs and standout cards.
 * Includes a soft mesh overlay and optional glow.
 */
export function GradientCard({ children, className, variant = "hero", glow = false }: GradientCardProps) {
  const bg =
    variant === "accent" ? "bg-gradient-accent" :
    variant === "primary" ? "bg-gradient-primary" :
    "bg-gradient-hero";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl text-primary-foreground p-5",
        bg,
        glow && "shadow-glow",
        !glow && "shadow-primary-glow",
        className,
      )}
    >
      {/* Mesh overlay */}
      <div aria-hidden className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-primary-glow/40 blur-3xl" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
