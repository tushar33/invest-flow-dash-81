import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { PageHeader } from "@/components/ui/page-header";
import { GradientCard } from "@/components/ui/gradient-card";
import { EmptyState } from "@/components/ui/empty-state";
import { CreditCard, Plus, X, Clock, Info, ArrowDownToLine } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payouts as payoutsApi, wallet as walletApi, bankDetails as bankApi, normalizeBankVerificationStatus } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatCredits } from "@/lib/format";
import { useAuth } from "@/contexts/AuthContext";
import { LANG, FILTER_OPTIONS, normalizePayoutStatus, payoutStatusBadge, payoutStatusLabel } from "@/lib/language";

function isPayoutWindow(): boolean {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 9 && hours < 12;
}

const filterDefaults = { status: "", from: "", to: "" };

const filterFields: FilterField[] = [
  {
    key: "status", label: LANG.common.status, type: "select", placeholder: LANG.common.all,
    options: [...FILTER_OPTIONS.payoutStatus],
  },
  { key: "from", label: LANG.filter.fromDate, type: "date", placeholder: LANG.filter.startDate },
  { key: "to", label: LANG.filter.toDate, type: "date", placeholder: LANG.filter.endDate },
];

export default function Payouts() {
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false);
  const withinWindow = isPayoutWindow();
  const { toast } = useToast();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useUrlFilters(filterDefaults);

  const { data: payoutsList, isLoading } = useQuery({
    queryKey: ["payouts", filters],
    queryFn: () => payoutsApi.list({
      status: filters.status || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    }),
  });
  const { data: walletData } = useQuery({ queryKey: ["wallet"], queryFn: () => walletApi.get() });
  const { data: bank } = useQuery({
    queryKey: ["bank-details", user?.id],
    queryFn: bankApi.get,
    enabled: Boolean(user?.id),
    refetchOnMount: "always",
  });

  const pendingAmount = payoutsList?.filter(p => p.status === "PENDING").reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const bankVerificationStatus = normalizeBankVerificationStatus(bank?.verificationStatus);
  const bankVerified = bankVerificationStatus === "verified";

  const createMutation = useMutation({
    mutationFn: (amt: number) => payoutsApi.create({ requestType: "ROI", amount: amt }),
    onSuccess: () => {
      toast({ title: LANG.redemption.requested });
      setAmount("");
      setShowForm(false);
      qc.invalidateQueries({ queryKey: ["payouts"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
    onError: (err: any) => {
      toast({ title: LANG.common.error, description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    const val = Number(amount);
    if (!val || val <= 0) {
      toast({ title: LANG.common.error, description: LANG.redemption.invalidAmount, variant: "destructive" });
      return;
    }
    createMutation.mutate(val);
  };

  const filtered = (payoutsList ?? []).filter(p => {
    if (filters.status && normalizePayoutStatus(p.status) !== filters.status) return false;
    if (filters.from && p.requestedAt < filters.from) return false;
    if (filters.to && p.requestedAt > filters.to) return false;
    return true;
  });

  return (
    <UserLayout>
      <div className="space-y-6">
        <PageHeader
          icon={<ArrowDownToLine className="h-5 w-5" />}
          title={LANG.redemption.pageTitle}
          subtitle={LANG.redemption.pageSubtitle}
          actions={
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-accent text-accent-foreground text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-transform shadow-glow"
            >
              {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showForm ? LANG.common.cancel : LANG.common.request}
            </button>
          }
        />

        <div className={`rounded-2xl p-3.5 flex items-start gap-3 border animate-slide-up-fade ${withinWindow ? "bg-success/10 border-success/20" : "bg-warning/10 border-warning/20"}`}>
          <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${withinWindow ? "bg-success/15" : "bg-warning/15"}`}>
            <Clock className={`h-4 w-4 ${withinWindow ? "text-success" : "text-warning"}`} />
          </div>
          <div>
            <p className={`text-[12px] font-semibold ${withinWindow ? "text-success" : "text-warning"}`}>
              {withinWindow ? LANG.redemption.windowOpen : LANG.redemption.windowClosed}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {LANG.redemption.windowHours} <span className="font-semibold text-foreground">{LANG.redemption.windowTimeRange}</span>.
            </p>
          </div>
        </div>

        <GradientCard variant="hero" className="animate-slide-up-fade">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest opacity-80 font-semibold">{LANG.common.balance}</p>
              <p className="text-2xl font-bold mt-1 text-accent tabular-nums">{formatCredits(walletData?.availableBalance ?? 0)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest opacity-80 font-semibold">{LANG.dashboard.pendingRedemption}</p>
              <p className="text-2xl font-bold mt-1 tabular-nums">{formatCredits(pendingAmount)}</p>
            </div>
          </div>
        </GradientCard>

        {showForm && (
          <div className="bg-card rounded-2xl border border-accent/30 p-4 shadow-elevated animate-slide-up-fade">
            <h3 className="font-bold text-sm mb-1">{LANG.redemption.newRequest}</h3>
            <p className="text-[11px] text-muted-foreground mb-4">{LANG.redemption.amountDeducted}</p>

            {!bank ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2 bg-warning/10 rounded-lg p-2.5 border border-warning/20">
                  <Info className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                  <p className="text-[11px] text-warning">{LANG.redemption.addDetailsFirst}</p>
                </div>
                <Link
                  to="/bank-details"
                  className="w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-glow"
                >
                  <Plus className="h-4 w-4" />
                  {LANG.redemption.addBankAccount}
                </Link>
              </div>
            ) : !bankVerified ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2 bg-warning/10 rounded-lg p-2.5 border border-warning/20">
                  <Info className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                  <p className="text-[11px] text-warning">
                    {bankVerificationStatus === "rejected"
                      ? LANG.redemption.rejectedBeforeRequest
                      : LANG.bank.underReviewRedemption}
                  </p>
                </div>
                <Link
                  to="/bank-details"
                  className="w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-glow"
                >
                  {bankVerificationStatus === "rejected" ? LANG.redemption.updateAccountDetails : LANG.redemption.viewAccountDetails}
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.redemption.amountCredits}</label>
                  <div className="relative mt-1.5">
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={LANG.common.amountPlaceholder}
                      className="w-full pl-4 pr-20 py-3 rounded-xl border border-input bg-background text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">{LANG.transaction.credits}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{LANG.redemption.account}</label>
                  <div className="mt-1.5 px-3 py-3 rounded-xl border border-input bg-muted/50 text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{bank.bankName} – ****{bank.accountNumber.slice(-4)} ({bank.accountHolderName})</span>
                  </div>
                </div>

                {!withinWindow && (
                  <div className="flex items-start gap-2 bg-warning/10 rounded-lg p-2.5 border border-warning/20">
                    <Info className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                    <p className="text-[11px] text-warning">{LANG.redemption.queuedMessage}</p>
                  </div>
                )}

                <button onClick={handleSubmit} disabled={createMutation.isPending}
                  className="w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3.5 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform shadow-glow">
                  {createMutation.isPending ? LANG.common.submitting : LANG.redemption.submitRequest}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="animate-slide-up-fade">
          <h2 className="text-sm font-bold tracking-tight mb-3">{LANG.redemption.requestsTitle}</h2>

          <FilterBar
            fields={filterFields}
            values={filters}
            onChange={(k, v) => setFilters({ [k]: v })}
            onReset={resetFilters}
            hasActive={hasActiveFilters}
          />

          <div className="mt-3">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
                {!filtered.length ? (
                  <EmptyState icon={ArrowDownToLine} title={LANG.redemption.noRequests} description={LANG.redemption.noRequestsDescription} />
                ) : filtered.map((p, i) => (
                  <div key={p.id} className={`p-3.5 hover:bg-muted/30 transition-colors ${i < filtered.length - 1 ? "border-b border-border/50" : ""}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold tabular-nums">{formatCredits(p.amount)}</p>
                          <p className="text-[11px] text-muted-foreground">{LANG.redemption.label}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={payoutStatusBadge(p.status)}>{payoutStatusLabel(p.status)}</StatusBadge>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(p.requestedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                    </div>
                    {p.status === "REJECTED" && p.rejectionReason && (
                      <p className="text-[11px] text-destructive mt-2 pl-12">{LANG.common.reason}: {p.rejectionReason}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
