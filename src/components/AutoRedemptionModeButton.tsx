import { useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { profile as profileApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LANG } from "@/lib/language";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AUTO_PAY_OPTIONS, normalizeAutoPayMode, type AutoPayMode } from "@/lib/auto-pay-options";

interface AutoRedemptionModeButtonProps {
  className?: string;
}

export function AutoRedemptionModeButton({ className }: AutoRedemptionModeButtonProps) {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<AutoPayMode | null>(null);

  const autopayMutation = useMutation({
    mutationFn: (autoPayMode: AutoPayMode) => profileApi.updateAutopay({ autoPayMode }),
    onSuccess: () => {
      toast({ title: LANG.toast.autoRedemptionUpdated });
      refreshUser();
      setOpen(false);
    },
    onError: (err: Error) =>
      toast({ title: LANG.toast.autoRedemptionFailed, description: err.message, variant: "destructive" }),
  });

  const current = normalizeAutoPayMode(user?.autoPayMode);
  const active = AUTO_PAY_OPTIONS.find((o) => o.value === current) ?? AUTO_PAY_OPTIONS[0];
  const ActiveIcon = active.icon;
  const pendingMode = autopayMutation.isPending ? autopayMutation.variables : null;
  const describedMode = hovered ?? current;
  const description = AUTO_PAY_OPTIONS.find((o) => o.value === describedMode)?.description ?? "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          style={{ background: "linear-gradient(135deg, hsl(222 47% 14%) 0%, hsl(210 50% 50%) 100%)" }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold text-white shadow-[0_8px_20px_-6px_hsl(210_50%_50%/0.6)] transition-all hover:brightness-110 active:scale-[0.97]",
            className,
          )}
          aria-label={LANG.profile.autoRedemptionMode}
        >
          <ActiveIcon className="h-3.5 w-3.5" />
          <span className="leading-none">{LANG.profile.autoPay}</span>
          <span className="leading-none rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-bold">{active.label}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-64 p-3">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {LANG.profile.autoRedemptionMode}
        </p>
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
                  "relative flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-center transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed",
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
                <span className="text-[12px] font-bold leading-none">{opt.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed mt-2 min-h-[2.5em]">{description}</p>
      </PopoverContent>
    </Popover>
  );
}
