/**
 * Credit-based formatting helpers.
 *
 * The platform is presented as a credit-based reward system, NOT a financial
 * product. All numeric values that previously displayed as currency (₹/INR)
 * are now rendered as "Credits".
 */

export function formatCredits(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number(value) : (value ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  return `${safe.toLocaleString("en-IN")} Credits`;
}

/** Compact form: "50,000 CR" — useful for tight layouts. */
export function formatCreditsCompact(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number(value) : (value ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  return `${safe.toLocaleString("en-IN")} CR`;
}

/** Signed credit amount, e.g. "+50,000 Credits" / "-2,500 Credits". */
export function formatCreditsSigned(
  value: number | string | null | undefined,
  direction: "CREDIT" | "DEBIT",
): string {
  const sign = direction === "CREDIT" ? "+" : "-";
  return `${sign}${formatCredits(value)}`;
}

/** Map raw transaction types from the API to user-facing reward labels. */
export function formatTransactionLabel(type: string): string {
  switch (type) {
    case "ROI_CREDIT":
    case "ROI":
      return "Reward Credit";
    case "PAYOUT_DEBIT":
      return "Redemption";
    case "PRINCIPAL_DEBIT":
    case "PRINCIPAL":
      return "Balance Adjustment";
    default:
      return type.replace(/_/g, " ");
  }
}
