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

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigitWords(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return ones === 0 ? TENS[tens] : `${TENS[tens]} ${ONES[ones]}`;
}

function threeDigitWords(n: number): string {
  if (n === 0) return "";
  if (n < 100) return twoDigitWords(n);
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  return rest === 0 ? `${ONES[hundreds]} Hundred` : `${ONES[hundreds]} Hundred ${twoDigitWords(rest)}`;
}

/** Parse a raw amount input into a whole number, or null when empty/invalid. */
export function parseAmountInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.floor(n);
}

/** Indian grouping without a credits suffix, e.g. 500000 → "5,00,000". */
export function formatIndianNumber(value: number | string | null | undefined): string {
  if (value === "" || value === null || value === undefined) return "";
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n) || n < 0) return "";
  return Math.floor(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

/** Indian English amount in words, e.g. 500000 → "Five Lakh". */
export function amountInIndianWords(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number(value) : (value ?? NaN);
  if (!Number.isFinite(n) || n <= 0) return "";
  let remaining = Math.floor(n);

  const parts: string[] = [];

  const crore = Math.floor(remaining / 10_000_000);
  remaining %= 10_000_000;
  if (crore > 0) parts.push(`${threeDigitWords(crore)} Crore`);

  const lakh = Math.floor(remaining / 100_000);
  remaining %= 100_000;
  if (lakh > 0) parts.push(`${twoDigitWords(lakh)} Lakh`);

  const thousand = Math.floor(remaining / 1_000);
  remaining %= 1_000;
  if (thousand > 0) parts.push(`${twoDigitWords(thousand)} Thousand`);

  if (remaining > 0) parts.push(threeDigitWords(remaining));

  return parts.join(" ");
}
