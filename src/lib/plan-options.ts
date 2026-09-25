export interface AdminPlanOption {
  roiPercentage: number;
  planType: string;
  durationMonths: number;
  label: string;
  principalUnchanged: boolean;
}

export const DEFAULT_PLAN_TYPE = "FIVE_PERCENT";

let catalog: AdminPlanOption[] = [];

/** Remember the last successful catalog for this browser session. */
export function setPlanCatalog(plans: AdminPlanOption[]): void {
  catalog = plans;
}

export function getPlanCatalog(): AdminPlanOption[] {
  return catalog;
}

export function planOptionKey(option: AdminPlanOption): string {
  return option.planType;
}

export function findPlanOption(
  roiPercentage: number,
  planType?: string | null,
): AdminPlanOption | undefined {
  if (planType) {
    const byType = catalog.find((opt) => opt.planType === planType);
    if (byType) return byType;
  }
  return catalog.find(
    (opt) => opt.roiPercentage === roiPercentage && (!planType || opt.planType === planType),
  );
}

export function findPlanOptionIndex(
  roiPercentage: number,
  planType?: string | null,
): number {
  const match = findPlanOption(roiPercentage, planType);
  if (!match) {
    const fallback = catalog.findIndex((opt) => opt.planType === DEFAULT_PLAN_TYPE);
    return fallback >= 0 ? fallback : 0;
  }
  return catalog.indexOf(match);
}

export function planLabel(
  roiPercentage: number,
  planType?: string | null,
): string {
  return findPlanOption(roiPercentage, planType)?.label ?? `${roiPercentage}%`;
}

/** Numeric ROI for the packages API. Plan-type filters map back to that percentage. */
export function roiPercentageForFilter(filterValue: string): string | undefined {
  if (!filterValue) return undefined;
  const plan = catalog.find((opt) => opt.planType === filterValue);
  if (plan) return String(plan.roiPercentage);
  return /^\d+$/.test(filterValue) ? filterValue : undefined;
}

export function planFilterOptions(): { label: string; value: string }[] {
  return catalog.map((opt) => ({
    label: opt.label,
    value: planOptionKey(opt),
  }));
}

/** Match a package against a plan filter value (planType key or legacy percent). */
export function matchesPlanFilter(
  roiPercentage: number,
  planType: string | null | undefined,
  filterValue: string,
): boolean {
  if (!filterValue) return true;
  const selected = catalog.find((opt) => planOptionKey(opt) === filterValue);
  if (selected) {
    return findPlanOption(roiPercentage, planType)?.planType === selected.planType;
  }
  return String(roiPercentage) === filterValue;
}
