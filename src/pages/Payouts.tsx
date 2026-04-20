import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { PageHeader } from "@/components/ui/page-header";
import { GradientCard } from "@/components/ui/gradient-card";
import { EmptyState } from "@/components/ui/empty-state";
import { CreditCard, Plus, X, Clock, Info, ArrowDownToLine } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payouts as payoutsApi, wallet as walletApi, bankDetails as bankApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatCredits } from "@/lib/format";

function isPayoutWindow(): boolean {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 9 && hours < 12;
}

const filterDefaults = { status: "", from: "", to: "" };

const filterFields: FilterField[] = [
  {
    key: "status", label: "Status", type: "select", placeholder: "All",
    options: [
      { label: "Pending", value: "PENDING" },
      { label: "Approved", value: "PROCESSED" },
      { label: "Rejected", value: "REJECTED" },
    ],
  },
  { key: "from", label: "From Date", type: "date", placeholder: "Start date" },
  { key: "to", label: "To Date", type: "date", placeholder: "End date" },
];

export default function Payouts() {
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false);
  const withinWindow = isPayoutWindow();
  const { toast } = useToast();
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
  const { data: bank } = useQuery({ queryKey: ["bank-details"], queryFn: bankApi.get });

  const pendingAmount = payoutsList?.filter(p => p.status === "PENDING").reduce((s, p) => s + Number(p.amount), 0) ?? 0;

  const createMutation = useMutation({
    mutationFn: (amt: number) => payoutsApi.create({ requestType: "ROI", amount: amt }),
    onSuccess: () => {
      toast({ title: "Redemption requested" });
      setAmount("");
      setShowForm(false);
      qc.invalidateQueries({ queryKey: ["payouts"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    const val = Number(amount);
    if (!val || val <= 0) {
      toast({ title: "Error", description: "Enter a valid amount", variant: "destructive" });
      return;
    }
    createMutation.mutate(val);
  };

  const statusMap: Record<string, "pending" | "approved" | "rejected"> = {
    PENDING: "pending", PROCESSED: "approved", REJECTED: "rejected",
  };

  const filtered = (payoutsList ?? []).filter(p => {
    if (filters.status && p.status !== filters.status) return false;
    if (filters.from && p.requestedAt < filters.from) return false;
    if (filters.to && p.requestedAt > filters.to) return false;
    return true;
  });

  return (
    <UserLayout>
      <div className="space-y-6">
        <PageHeader
          icon={<ArrowDownToLine className="h-5 w-5" />}
          title="Redemptions"
          subtitle="Request & track redemptions"
          actions={
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-accent text-accent-foreground text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-transform shadow-glow"
            >
              {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showForm ? "Cancel" : "Request"}
            </button>
          }
        />

        <div className={`rounded-2xl p-3.5 flex items-start gap-3 border animate-slide-up-fade ${withinWindow ? "bg-success/10 border-success/20" : "bg-warning/10 border-warning/20"}`}>
          <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${withinWindow ? "bg-success/15" : "bg-warning/15"}`}>
            <Clock className={`h-4 w-4 ${withinWindow ? "text-success" : "text-warning"}`} />
          </div>
          <div>
            <p className={`text-[12px] font-semibold ${withinWindow ? "text-success" : "text-warning"}`}>
              {withinWindow ? "Redemption Window Open" : "Redemption Window Closed"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Redemption requests accepted between <span className="font-semibold text-foreground">9:00 AM – 12:00 PM</span>.
            </p>
          </div>
        </div>

        <GradientCard variant="hero" className="animate-slide-up-fade">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest opacity-80 font-semibold">Balance</p>
              <p className="text-2xl font-bold mt-1 text-accent tabular-nums">{formatCredits(walletData?.availableBalance ?? 0)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest opacity-80 font-semibold">Pending Redemption</p>
              <p className="text-2xl font-bold mt-1 tabular-nums">{formatCredits(pendingAmount)}</p>
            </div>
          </div>
        </GradientCard>

        {showForm && (
          <div className="bg-card rounded-2xl border border-accent/30 p-4 shadow-elevated animate-slide-up-fade">
            <h3 className="font-bold text-sm mb-1">New Redemption Request</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Amount will be deducted from your balance</p>

            {!bank ? (
              <div className="flex items-start gap-2 bg-warning/10 rounded-lg p-2.5 mb-3 border border-warning/20">
                <Info className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                <p className="text-[11px] text-warning">Please add account details before requesting a redemption.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Amount (Credits)</label>
                  <div className="relative mt-1.5">
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"
                      className="w-full pl-4 pr-20 py-3 rounded-xl border border-input bg-background text-sm font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">Credits</span>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Account</label>
                  <div className="mt-1.5 px-3 py-3 rounded-xl border border-input bg-muted/50 text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{bank.bankName} – ****{bank.accountNumber.slice(-4)} ({bank.accountHolderName})</span>
                  </div>
                </div>

                {!withinWindow && (
                  <div className="flex items-start gap-2 bg-warning/10 rounded-lg p-2.5 border border-warning/20">
                    <Info className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                    <p className="text-[11px] text-warning">Request will be queued and processed in the next redemption window.</p>
                  </div>
                )}

                <button onClick={handleSubmit} disabled={createMutation.isPending}
                  className="w-full bg-gradient-accent text-accent-foreground text-sm font-semibold py-3.5 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform shadow-glow">
                  {createMutation.isPending ? "Submitting..." : "Submit Redemption Request"}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="animate-slide-up-fade">
          <h2 className="text-sm font-bold tracking-tight mb-3">Redemption Requests</h2>

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
                  <EmptyState icon={ArrowDownToLine} title="No redemption requests" description="Your redemption history will appear here." />
                ) : filtered.map((p, i) => (
                  <div key={p.id} className={`flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors ${i < filtered.length - 1 ? "border-b border-border/50" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold tabular-nums">{formatCredits(p.amount)}</p>
                        <p className="text-[11px] text-muted-foreground">Redemption</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={statusMap[p.status] || "pending"}>{p.status}</StatusBadge>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(p.requestedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
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
