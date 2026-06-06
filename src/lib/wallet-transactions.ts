import { formatPackageLabel } from "@/lib/package-label";

export interface LedgerPackageSummary {
  id: string;
  principalAmount: string;
  startDate: string;
  status: string;
  roiPercentage: string;
  legacyUserCode?: string | null;
  legacyPkgCnt?: number | null;
}

/** 10% plan principal amortization rows — audit-only, hidden from user activity. */
export function isUserVisibleTransaction(tx: { type: string }): boolean {
  return tx.type !== "PRINCIPAL" && tx.type !== "PRINCIPAL_DEBIT";
}

export function filterUserVisibleTransactions<T extends { type: string }>(
  transactions: readonly T[],
): T[] {
  return transactions.filter(isUserVisibleTransaction);
}

export function isRoiCreditTransaction(tx: { type: string }): boolean {
  return tx.type === "ROI_CREDIT" || tx.type === "ROI";
}

export function formatLedgerPackageLabel(pkg: LedgerPackageSummary): string {
  return formatPackageLabel(pkg);
}
