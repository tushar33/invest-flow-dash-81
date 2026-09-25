export const ADMIN_PLAN_OPTIONS = [
  {
    roiPercentage: 2,
    planType: "TWO_PERCENT",
    label: "2% (12 Months)",
  },
  {
    roiPercentage: 5,
    planType: "FIVE_PERCENT",
    label: "5% (12 Months)",
  },
  {
    roiPercentage: 7,
    planType: "SEVEN_PERCENT",
    label: "7% (12 Months)",
  },
  {
    roiPercentage: 10,
    planType: "TEN_PERCENT_NORMAL",
    label: "10% (12 Months)",
  },
  {
    roiPercentage: 10,
    planType: "TEN_PERCENT_FIXED_PAYOUT",
    label: "10% (15 Months)",
  },
  {
    roiPercentage: 11,
    planType: "ELEVEN_PERCENT",
    label: "11% (12 Months)",
  },
  {
    roiPercentage: 15,
    planType: "FIFTEEN_PERCENT",
    label: "15% (12 Months)",
  },
] as const;

export type AdminPlanOption = (typeof ADMIN_PLAN_OPTIONS)[number];

/** Assign-package dropdown default stays 5% (12 months). */
export const DEFAULT_ASSIGN_PLAN_KEY = String(
  ADMIN_PLAN_OPTIONS.findIndex((opt) => opt.planType === "FIVE_PERCENT"),
);

export function planOptionKey(option: AdminPlanOption): string {
  return option.planType;
}

export function findPlanOptionIndex(
  roiPercentage: number,
  planType?: string | null,
): number {
  if (planType) {
    const byType = ADMIN_PLAN_OPTIONS.findIndex((opt) => opt.planType === planType);
    if (byType >= 0) return byType;
  }
  const byRoi = ADMIN_PLAN_OPTIONS.findIndex(
    (opt) => opt.roiPercentage === roiPercentage && (!planType || opt.planType === planType),
  );
  if (byRoi >= 0) return byRoi;
  if (roiPercentage === 2) return 0;
  if (roiPercentage === 5) return 1;
  if (roiPercentage === 7) return 2;
  if (roiPercentage === 10 && planType === "TEN_PERCENT_FIXED_PAYOUT") return 4;
  if (roiPercentage === 10) return 3;
  if (roiPercentage === 11) return 5;
  if (roiPercentage === 15) return 6;
  return Number(DEFAULT_ASSIGN_PLAN_KEY);
}

export function planTypeFromRoi(roiPercentage: number): string | undefined {
  if (roiPercentage === 2) return "TWO_PERCENT";
  if (roiPercentage === 5) return "FIVE_PERCENT";
  if (roiPercentage === 7) return "SEVEN_PERCENT";
  if (roiPercentage === 11) return "ELEVEN_PERCENT";
  if (roiPercentage === 15) return "FIFTEEN_PERCENT";
  return undefined;
}

export function planLabel(
  roiPercentage: number,
  planType?: string | null,
): string {
  const idx = findPlanOptionIndex(roiPercentage, planType);
  return ADMIN_PLAN_OPTIONS[idx]?.label ?? `${roiPercentage}%`;
}

/** Filter options for reward/plan dropdowns (all distinct plan variants). */
export const PLAN_FILTER_OPTIONS = ADMIN_PLAN_OPTIONS.map((opt) => ({
  label: opt.label,
  value: planOptionKey(opt),
}));

/** Match a package against a plan filter value (planType key or legacy percent). */
export function matchesPlanFilter(
  roiPercentage: number,
  planType: string | null | undefined,
  filterValue: string,
): boolean {
  if (!filterValue) return true;
  const selectedIdx = ADMIN_PLAN_OPTIONS.findIndex(
    (opt) => planOptionKey(opt) === filterValue,
  );
  if (selectedIdx >= 0) {
    return findPlanOptionIndex(roiPercentage, planType) === selectedIdx;
  }
  // Legacy URL values like "10", "11", "15"
  return String(roiPercentage) === filterValue;
}
