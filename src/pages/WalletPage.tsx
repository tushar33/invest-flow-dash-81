import { UserLayout } from "@/components/UserLayout";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { wallet as walletApi } from "@/lib/api";
import { formatCredits, formatCreditsSigned, formatTransactionLabel } from "@/lib/format";

const filterDefaults = { type: "", from: "", to: "" };

const filterFields: FilterField[] = [
  {
    key: "type", label: "Type", type: "select", placeholder: "All",
    options: [
      { label: "Reward Credit", value: "ROI" },
      { label: "Redemption", value: "PAYOUT_DEBIT" },
    ],
  },
  { key: "from", label: "From Date", type: "date", placeholder: "Start date" },
  { key: "to", label: "To Date", type: "date", placeholder: "End date" },
];

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const { filters, setFilters, resetFilters, hasActiveFilters } = useUrlFilters(filterDefaults);

  const { data: walletData, isLoading } = useQuery({
    queryKey: ["wallet", filters],
    queryFn: () => walletApi.get({
      type: filters.type || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    }),
  });

  const balance = walletData?.availableBalance ?? 0;
  const transactions = walletData?.transactions ?? [];

  const filtered = transactions.filter(t => {
    if (filters.type) {
      if (filters.type === "ROI" && t.type !== "ROI_CREDIT" && t.type !== "ROI") return false;
      if (filters.type === "PAYOUT_DEBIT" && t.type !== "PAYOUT_DEBIT") return false;
    }
    if (filters.from && new Date(t.createdAt) < new Date(filters.from)) return false;
    if (filters.to && new Date(t.createdAt) > new Date(filters.to)) return false;
    return true;
  });

  const totalCredited = filtered.filter(t => t.direction === "CREDIT").reduce((s, t) => s + Number(t.amount), 0);
  const totalDebited = filtered.filter(t => t.direction === "DEBIT").reduce((s, t) => s + Number(t.amount), 0);

  return (
    <UserLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">Activity</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Reward credits & redemption activity</p>
        </div>

        <div className="fintech-gradient rounded-2xl p-5 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-accent/5 rounded-full -translate-y-6 translate-x-6" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <WalletIcon className="h-4 w-4 text-accent" />
              <span className="text-[11px] uppercase tracking-widest opacity-70 font-medium">Available Balance</span>
              <button onClick={() => setShowBalance(!showBalance)} className="ml-auto opacity-60 hover:opacity-100 transition-opacity">
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[32px] font-bold leading-tight">
              {showBalance ? formatCredits(balance) : "••••••"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl border border-border p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Total Credited</p>
            <p className="text-base font-bold text-success mt-0.5">+{formatCredits(totalCredited)}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Total Redeemed</p>
            <p className="text-base font-bold text-foreground mt-0.5">-{formatCredits(totalDebited)}</p>
          </div>
        </div>

        <FilterBar
          fields={filterFields}
          values={filters}
          onChange={(k, v) => setFilters({ [k]: v })}
          onReset={resetFilters}
          hasActive={hasActiveFilters}
        />

        <div>
          <h2 className="text-sm font-bold mb-3">Ledger</h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No activity found</p>
              ) : filtered.map((tx, i) => {
                const isCredit = tx.direction === "CREDIT";
                return (
                  <div key={tx.id} className={`flex items-center justify-between p-3.5 ${i < filtered.length - 1 ? "border-b border-border/50" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${isCredit ? "bg-success/10" : "bg-muted"}`}>
                        {isCredit ? <ArrowDownLeft className="h-4 w-4 text-success" /> : <ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold">{formatTransactionLabel(tx.type)}</p>
                        <p className="text-[11px] text-muted-foreground">{tx.description || ""}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[13px] font-bold ${isCredit ? "text-success" : "text-foreground"}`}>
                        {formatCreditsSigned(tx.amount, tx.direction)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
