import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { profile as profileApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LANG } from "@/lib/language";
import { cn } from "@/lib/utils";
import { AUTO_PAY_OPTIONS, normalizeAutoPayMode, type AutoPayMode } from "@/lib/auto-pay-options";

interface AutoRedemptionModeCardProps {
  className?: string;
}

export function AutoRedemptionModeCard({ className }: AutoRedemptionModeCardProps) {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [hovered, setHovered] = useState<AutoPayMode | null>(null);

  const autopayMutation = useMutation({
    mutationFn: (autoPayMode: AutoPayMode) => profileApi.updateAutopay({ autoPayMode }),
    onSuccess: () => {
      toast({ title: LANG.toast.autoRedemptionUpdated });
      refreshUser();
    },
    onError: (err: Error) =>
      toast({ title: LANG.toast.autoRedemptionFailed, description: err.message, variant: "destructive" }),
  });

  const current = normalizeAutoPayMode(user?.autoPayMode);
  const pendingMode = autopayMutation.isPending ? autopayMutation.variables : null;
  const describedMode = hovered ?? current;
  const description = AUTO_PAY_OPTIONS.find((o) => o.value === describedMode)?.description ?? "";

  return (
    <div className={cn("bg-card rounded-2xl border border-border overflow-hidden shadow-card animate-slide-up-fade", className)}>
      <div className="px-4 pt-3 pb-2">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {LANG.profile.autoRedemptionMode}
        </p>
      </div>
      <div className="px-4 pb-4 space-y-3">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-muted/60 p-1.5">
          {AUTO_PAY_OPTIONS.map((opt) => {
            const selected = current === opt.value;
            const isPending = pendingMode === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => !selected && autopayMutation.mutate(opt.value)}
                onMouseEnter={() => setHovered(opt.value)}
                onMouseLeave={() => setHovered(null)}
                disabled={autopayMutation.isPending}
                aria-pressed={selected}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-center transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed",
                  selected
                    ? "bg-gradient-accent text-accent-foreground shadow-glow"
                    : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                )}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className={cn("h-4 w-4", selected ? "text-accent-foreground" : "text-muted-foreground")} />
                )}
                <span className="text-[13px] font-bold leading-none">{opt.label}</span>
                <span className={cn("text-[10px] leading-none", selected ? "text-accent-foreground/80" : "text-muted-foreground/70")}>
                  {opt.caption}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed min-h-[2.5em]">{description}</p>
      </div>
    </div>
  );
}
