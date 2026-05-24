/**
 * Credit-based formatting helpers.
 *
 * The platform is presented as a credit-based reward system, NOT a financial
 * product. All numeric values that previously displayed as currency (₹/INR)
 * are now rendered as "Credits".
 */

import { LANG, transactionTypeLabel } from "@/lib/language";

/** Ledger amounts may carry fractional sub-units; display as whole credits (round up). */
function toDisplayCredits(value: number | string | null | undefined): number {
  const n = typeof value === "string" ? Number(value) : (value ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  return Math.ceil(safe);
}

export function formatCredits(value: number | string | null | undefined): string {
  const rounded = toDisplayCredits(value);
  return `${rounded.toLocaleString("en-IN", { maximumFractionDigits: 0 })} ${LANG.transaction.credits}`;
}

/** Compact form: "50,000 CR" — useful for tight layouts. */
export function formatCreditsCompact(value: number | string | null | undefined): string {
  const rounded = toDisplayCredits(value);
  return `${rounded.toLocaleString("en-IN", { maximumFractionDigits: 0 })} ${LANG.transaction.creditsCompact}`;
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
  return transactionTypeLabel(type);
}
