import { LANG } from "@/lib/language";

export type CycleMode = "FIXED_DAYS" | "CALENDAR_MONTHLY";

export const DEFAULT_CYCLE_MODE: CycleMode = "CALENDAR_MONTHLY";
export const DEFAULT_DAYS_BETWEEN_CYCLES = 30;

export function parseCycleMode(value?: string | null): CycleMode {
  if (value === "FIXED_DAYS") return "FIXED_DAYS";
  if (value === "CALENDAR_MONTHLY") return "CALENDAR_MONTHLY";
  return DEFAULT_CYCLE_MODE;
}

/** Readable cycle date, e.g. "5 Feb 2026". Never computes dates — display only. */
export function formatCycleDate(value: string | Date | null | undefined): string {
  if (!value) return LANG.common.noData;
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return LANG.common.noData;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function cycleModeLabel(mode?: string | null): string {
  return parseCycleMode(mode) === "FIXED_DAYS"
    ? LANG.cycle.fixedDays
    : LANG.cycle.calendarMonthly;
}

export function cycleModeDescription(mode?: string | null, daysBetweenCycles?: number): string {
  if (parseCycleMode(mode) === "FIXED_DAYS") {
    const days = daysBetweenCycles && daysBetweenCycles > 0 ? daysBetweenCycles : DEFAULT_DAYS_BETWEEN_CYCLES;
    return LANG.cycle.fixedDaysInterval(days);
  }
  return LANG.cycle.calendarMonthlyDescription;
}

export function resolveNextCycleDate(pkg: {
  nextCycleDate?: string | null;
  nextRoiDate?: string | null;
}): string | null {
  return pkg.nextCycleDate ?? pkg.nextRoiDate ?? null;
}
