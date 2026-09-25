import { formatCredits, formatCreditsCompact } from "@/lib/format";
import { planLabel } from "@/lib/plan-options";

export interface PackageLabelFields {
  principalAmount: string | number;
  roiPercentage?: string | number;
  planType?: string | null;
  startDate?: string;
  legacyUserCode?: string | null;
  legacyPkgCnt?: number | null;
}

function planTypePart(pkg: PackageLabelFields): string | null {
  if (pkg.roiPercentage == null || pkg.roiPercentage === "") return null;
  return planLabel(Number(pkg.roiPercentage), pkg.planType);
}

/** Human-readable plan label; legacy fields distinguish separate migrated packages. */
export function formatPackageLabel(pkg: PackageLabelFields): string {
  const parts = [formatCredits(pkg.principalAmount)];
  const plan = planTypePart(pkg);
  if (plan) parts.push(plan);
  if (pkg.legacyUserCode) parts.push(pkg.legacyUserCode);
  if (pkg.legacyPkgCnt != null) parts.push(`pkg ${pkg.legacyPkgCnt}`);
  if (!pkg.legacyUserCode && pkg.startDate) {
    const started = new Date(pkg.startDate).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
    parts.push(started);
  }
  return parts.join(" · ");
}

/** Compact label for filter dropdowns. */
export function formatPackageFilterLabel(pkg: PackageLabelFields): string {
  const parts = [formatCreditsCompact(pkg.principalAmount)];
  const plan = planTypePart(pkg);
  if (plan) parts.push(plan);
  if (pkg.legacyUserCode) parts.push(pkg.legacyUserCode);
  if (pkg.legacyPkgCnt != null) parts.push(`pkg ${pkg.legacyPkgCnt}`);
  else if (pkg.startDate) {
    const started = new Date(pkg.startDate).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
    parts.push(started);
  }
  return parts.join(" · ");
}
