/** UI / URL filter values for wallet activity type. */
export type WalletActivityTypeFilter = "" | "ROI" | "PAYOUT_DEBIT" | "PRINCIPAL";

export interface WalletUiFilters {
  type?: string;
  from?: string;
  to?: string;
  packageId?: string;
  page?: number;
  limit?: number;
  userId?: string;
  direction?: string;
}

/** Map frontend filter fields to backend query params (`GET /user/wallet`, `GET /wallet/ledger`). */
export function toWalletApiParams(
  filters?: WalletUiFilters,
): Record<string, string> {
  if (!filters) return {};
  const params: Record<string, string> = {};

  if (filters.type) {
    if (filters.type === "PAYOUT_DEBIT") {
      params.transactionType = "PAYOUT";
    } else {
      params.transactionType = filters.type;
    }
  }
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.userId) params.userId = filters.userId;
  if (filters.direction) params.direction = filters.direction;
  if (filters.packageId) params.packageId = filters.packageId;
  if (filters.page != null) params.page = String(filters.page);
  if (filters.limit != null) params.limit = String(filters.limit);

  return params;
}

/** Client-side fallback when API returns a broader slice (e.g. packageId filter). */
export function matchesActivityTypeFilter(
  txnType: string,
  filter: string,
): boolean {
  if (!filter) return true;
  if (filter === "ROI") return txnType === "ROI_CREDIT" || txnType === "ROI";
  if (filter === "PRINCIPAL") return txnType === "PRINCIPAL";
  if (filter === "PAYOUT_DEBIT" || filter === "PAYOUT") {
    return txnType === "PAYOUT_DEBIT";
  }
  return txnType === filter;
}
