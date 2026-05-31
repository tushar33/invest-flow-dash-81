/** 10% plan principal amortization rows — audit-only, hidden from user activity. */
export function isUserVisibleTransaction(tx: { type: string }): boolean {
  return tx.type !== "PRINCIPAL" && tx.type !== "PRINCIPAL_DEBIT";
}

export function filterUserVisibleTransactions<T extends { type: string }>(
  transactions: readonly T[],
): T[] {
  return transactions.filter(isUserVisibleTransaction);
}
