import { CycleModeBadge } from "@/components/CycleModeBadge";
import { LANG } from "@/lib/language";
import {
  cycleModeDescription,
  formatCycleDate,
  parseCycleMode,
  resolveNextCycleDate,
} from "@/lib/cycle-schedule";

interface PlanCycleDetailsProps {
  pkg: {
    status: string;
    cycleMode?: string | null;
    nextCycleDate?: string | null;
    nextRoiDate?: string | null;
    lastCycleDate?: string | null;
  };
  daysBetweenCycles?: number;
  compact?: boolean;
}

export function PlanCycleDetails({ pkg, daysBetweenCycles, compact = false }: PlanCycleDetailsProps) {
  const nextDate = resolveNextCycleDate(pkg);
  const isActive = pkg.status === "ACTIVE";
  const mode = parseCycleMode(pkg.cycleMode);

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <CycleModeBadge mode={pkg.cycleMode} />
        <span>
          {LANG.plans.nextCycleDate}:{" "}
          <span className="font-medium text-foreground">
            {isActive ? formatCycleDate(nextDate) : LANG.common.noData}
          </span>
        </span>
        {pkg.lastCycleDate && (
          <span>
            {LANG.plans.lastCycleDate}:{" "}
            <span className="font-medium text-foreground">{formatCycleDate(pkg.lastCycleDate)}</span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-3 border-t border-border/50">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
          {LANG.plans.cycleMode}
        </span>
        <CycleModeBadge mode={pkg.cycleMode} />
      </div>
      <p className="text-[11px] text-muted-foreground">
        {cycleModeDescription(pkg.cycleMode, daysBetweenCycles)}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            {LANG.plans.nextCycleDate}
          </p>
          <p className="text-[13px] font-semibold mt-0.5">
            {isActive ? formatCycleDate(nextDate) : LANG.common.noData}
          </p>
          {mode === "FIXED_DAYS" && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {cycleModeDescription("FIXED_DAYS", daysBetweenCycles)}
            </p>
          )}
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            {LANG.plans.lastCycleDate}
          </p>
          <p className="text-[13px] font-semibold mt-0.5">
            {formatCycleDate(pkg.lastCycleDate)}
          </p>
        </div>
      </div>
    </div>
  );
}
