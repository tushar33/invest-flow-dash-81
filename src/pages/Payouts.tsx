import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { CreditCard, Plus, X, Clock, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";

const payouts = [
  { id: 1, amount: "₹15,000", date: "Mar 5, 2026", bank: "SBI ****4521", status: "pending" as const },
  { id: 2, amount: "₹10,000", date: "Feb 20, 2026", bank: "SBI ****4521", status: "approved" as const },
  { id: 3, amount: "₹8,000", date: "Feb 10, 2026", bank: "SBI ****4521", status: "completed" as const },
  { id: 4, amount: "₹5,000", date: "Jan 28, 2026", bank: "SBI ****4521", status: "rejected" as const },
];

function isPayoutWindow(): boolean {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 9 && hours < 12;
}

export default function Payouts() {
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false);
  const withinWindow = isPayoutWindow();

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

        {/* Payout Window Notice */}
        <div className={`rounded-2xl p-3.5 flex items-start gap-3 ${withinWindow ? "bg-success/10 border border-success/20" : "bg-warning/10 border border-warning/20"}`}>
          <Clock className={`h-4 w-4 mt-0.5 shrink-0 ${withinWindow ? "text-success" : "text-warning"}`} />
          <div>
            <p className={`text-[12px] font-semibold ${withinWindow ? "text-success" : "text-warning"}`}>
              {withinWindow ? "Payout Window Open" : "Payout Window Closed"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Payout requests are processed daily between <span className="font-semibold text-foreground">9:00 AM – 12:00 PM</span>. Requests outside this window will be queued.
            </p>
          </div>
        </div>

        {/* Balance & Pending */}
        <div className="fintech-gradient rounded-2xl p-4 text-primary-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest opacity-70">Wallet Balance</p>
              <p className="text-xl font-bold mt-0.5 text-accent">₹24,500</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest opacity-70">Pending Payout</p>
              <p className="text-xl font-bold mt-0.5">₹15,000</p>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="bg-card rounded-2xl border border-accent/30 p-4 animate-fade-in">
            <h3 className="font-bold text-sm mb-1">New Payout Request</h3>
            <p className="text-[11px] text-muted-foreground mb-4">Amount will be deducted from your wallet balance</p>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Amount (₹)</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-7 pr-4 py-3 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Bank Account</label>
                <div className="mt-1.5 px-3 py-3 rounded-xl border border-input bg-muted/50 text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>SBI – ****4521 (Rahul Sharma)</span>
                </div>
              </div>

              {!withinWindow && (
                <div className="flex items-start gap-2 bg-warning/10 rounded-lg p-2.5">
                  <Info className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                  <p className="text-[11px] text-warning">Request will be queued and processed in the next payout window.</p>
                </div>
              )}

              <button className="w-full accent-gradient text-accent-foreground text-sm font-semibold py-3.5 rounded-xl active:scale-[0.98] transition-transform">
                Submit Payout Request
              </button>
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="text-sm font-bold mb-3">Payout History</h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {payouts.map((p, i) => (
              <div key={p.id} className={`flex items-center justify-between p-3.5 ${i < payouts.length - 1 ? "border-b border-border/50" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold">{p.amount}</p>
                    <p className="text-[11px] text-muted-foreground">{p.bank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={p.status}>{p.status}</StatusBadge>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
