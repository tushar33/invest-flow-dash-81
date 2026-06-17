export const ADMIN_PLAN_OPTIONS = [
  { roiPercentage: 5, label: "5%" },
  { roiPercentage: 7, label: "7%" },
  {
    roiPercentage: 10,
    planType: "TEN_PERCENT_NORMAL",
    label: "10% Normal",
  },
  {
    roiPercentage: 10,
    planType: "TEN_PERCENT_FIXED_PAYOUT",
    label: "10% Fixed Payout",
  },
] as const;

export type AdminPlanOption = (typeof ADMIN_PLAN_OPTIONS)[number];

export function planOptionKey(option: AdminPlanOption): string {
  return option.planType ?? String(option.roiPercentage);
}

export function findPlanOptionIndex(
  roiPercentage: number,
  planType?: string | null,
): number {
  const idx = ADMIN_PLAN_OPTIONS.findIndex((opt) => {
    if (opt.roiPercentage !== roiPercentage) return false;
    if (opt.planType) return opt.planType === planType;
    return !planType || planType === `FIVE_PERCENT` || planType === `SEVEN_PERCENT`;
  });
  if (idx >= 0) return idx;
  if (roiPercentage === 5) return 0;
  if (roiPercentage === 7) return 1;
  if (roiPercentage === 10 && planType === "TEN_PERCENT_FIXED_PAYOUT") return 3;
  if (roiPercentage === 10) return 2;
  return 0;
}

export function planTypeFromRoi(roiPercentage: number): string | undefined {
  if (roiPercentage === 5) return "FIVE_PERCENT";
  if (roiPercentage === 7) return "SEVEN_PERCENT";
  return undefined;
}

export function planLabel(
  roiPercentage: number,
  planType?: string | null,
): string {
  const idx = findPlanOptionIndex(roiPercentage, planType);
  return ADMIN_PLAN_OPTIONS[idx]?.label ?? `${roiPercentage}%`;
}
