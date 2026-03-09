import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { CreditCard, Plus, X, Clock, Info } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payouts as payoutsApi, wallet as walletApi, bankDetails as bankApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function isPayoutWindow(): boolean {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 9 && hours < 12;
}

export default function Payouts() {
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false);
  const withinWindow = isPayoutWindow();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: payoutsList, isLoading } = useQuery({ queryKey: ["payouts"], queryFn: () => payoutsApi.list() });
  const { data: walletData } = useQuery({ queryKey: ["wallet"], queryFn: walletApi.get });
  const { data: bank } = useQuery({ queryKey: ["bank-details"], queryFn: bankApi.get });

  const pendingAmount = payoutsList?.filter(p => p.status === "PENDING").reduce((s, p) => s + Number(p.amount), 0) ?? 0;

  const createMutation = useMutation({
    mutationFn: (amt: number) => payoutsApi.create({ requestType: "ROI", amount: amt }),
    onSuccess: () => {
      toast({ title: "Payout requested" });
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

  return (
    <UserLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Payouts</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Request & track withdrawals</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="accent-gradient text-accent-foreground text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-transform"
          >
            {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showForm ? "Cancel" : "Request"}
          </button>
        </div>

        <div className={`rounded-2xl p-3.5 flex items-start gap-3 ${withinWindow ? "bg-success/10 border border-success/20" : "bg-warning/10 border border-warning/20"}`}>
          <Clock className={`h-4 w-4 mt-0.5 shrink-0 ${withinWindow ? "text-success" : "text-warning"}`} />
          <div>
            <p className={`text-[12px] font-semibold ${withinWindow ? "text-success" : "text-warning"}`}>
              {withinWindow ? "Payout Window Open" : "Payout Window Closed"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Payout requests accepted between <span className="font-semibold text-foreground">9:00 AM – 12:00 PM</span>.
            </p>
          </div>
        </div>

        <div className="fintech-gradient rounded-2xl p-4 text-primary-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest opacity-70">Wallet Balance</p>
              <p className="text-xl font-bold mt-0.5 text-accent">₹{(walletData?.availableBalance ?? 0).toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest opacity-70">Pending Payout</p>
              <p className="text-xl font-bold mt-0.5">₹{pendingAmount.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-card rounded-2xl border border-accent/30 p-4 animate-fade-in">
            <h3 className="font-bold text-sm mb-1">New Payout Request</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Amount will be deducted from your wallet balance</p>

            {!bank ? (
              <div className="flex items-start gap-2 bg-warning/10 rounded-lg p-2.5 mb-3">
                <Info className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                <p className="text-[11px] text-warning">Please add bank details before requesting a payout.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Amount (₹)</label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">₹</span>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"
                      className="w-full pl-7 pr-4 py-3 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Bank Account</label>
                  <div className="mt-1.5 px-3 py-3 rounded-xl border border-input bg-muted/50 text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{bank.bankName} – ****{bank.accountNumber.slice(-4)} ({bank.accountHolderName})</span>
                  </div>
                </div>

                {!withinWindow && (
                  <div className="flex items-start gap-2 bg-warning/10 rounded-lg p-2.5">
                    <Info className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                    <p className="text-[11px] text-warning">Request will be queued and processed in the next payout window.</p>
                  </div>
                )}

                <button onClick={handleSubmit} disabled={createMutation.isPending}
                  className="w-full accent-gradient text-accent-foreground text-sm font-semibold py-3.5 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-transform">
                  {createMutation.isPending ? "Submitting..." : "Submit Payout Request"}
                </button>
              </div>
            )}
          </div>
        )}

        <div>
          <h2 className="text-sm font-bold mb-3">Payout History</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {!payoutsList?.length ? (
                <p className="text-sm text-muted-foreground text-center py-8">No payout requests yet</p>
              ) : payoutsList.map((p, i) => (
                <div key={p.id} className={`flex items-center justify-between p-3.5 ${i < payoutsList.length - 1 ? "border-b border-border/50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold">₹{Number(p.amount).toLocaleString("en-IN")}</p>
                      <p className="text-[11px] text-muted-foreground">{p.requestType}</p>
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
    </UserLayout>
  );
}
