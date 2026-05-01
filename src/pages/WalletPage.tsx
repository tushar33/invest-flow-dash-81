import { UserLayout } from "@/components/UserLayout";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { PageHeader } from "@/components/ui/page-header";
import { GradientCard } from "@/components/ui/gradient-card";
import { StatTile } from "@/components/ui/stat-tile";
import { EmptyState } from "@/components/ui/empty-state";
import { ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, Eye, EyeOff, Activity, TrendingUp, TrendingDown } from "lucide-react";
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
      <div className="space-y-4">
        <div className="sticky top-0 z-30 -mx-4 px-4 pb-4 bg-background/85 backdrop-blur-xl border-b border-border/60 space-y-4">
          <PageHeader
            icon={<Activity className="h-5 w-5" />}
            title="Activity"
            subtitle="Reward credits & redemption activity"
            className="sticky-none static border-b-0 -mx-0 px-0 py-3 bg-transparent backdrop-blur-none"
          />

          <GradientCard variant="hero" glow className="animate-slide-up-fade">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-7 w-7 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
              <WalletIcon className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-[11px] uppercase tracking-widest opacity-80 font-semibold">Available Balance</span>
            <button onClick={() => setShowBalance(!showBalance)} className="ml-auto opacity-70 hover:opacity-100 transition-opacity">
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[36px] font-bold leading-tight tabular-nums">
            {showBalance ? formatCredits(balance) : "••••••"}
          </p>
        </GradientCard>

        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Total Credited" value={`+${formatCredits(totalCredited)}`} icon={TrendingUp} accent="success" />
          <StatTile label="Total Redeemed" value={`-${formatCredits(totalDebited)}`} icon={TrendingDown} accent="warning" />
        </div>

        <FilterBar
          fields={filterFields}
          values={filters}
          onChange={(k, v) => setFilters({ [k]: v })}
          onReset={resetFilters}
          hasActive={hasActiveFilters}
        />

        <div className="animate-slide-up-fade">
          <h2 className="text-sm font-bold tracking-tight mb-3">Ledger</h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
              {filtered.length === 0 ? (
                <EmptyState icon={Activity} title="No activity found" description="Try adjusting your filters or check back later." />
              ) : filtered.map((tx, i) => {
                const isCredit = tx.direction === "CREDIT";
                return (
                  <div key={tx.id} className={`flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors ${i < filtered.length - 1 ? "border-b border-border/50" : ""}`}>
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
                      <p className={`text-[13px] font-bold tabular-nums ${isCredit ? "text-success" : "text-foreground"}`}>
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
