import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { CreditCard, Plus, X, ChevronDown } from "lucide-react";
import { useState } from "react";

const payouts = [
  { id: 1, amount: "$200.00", date: "Mar 5, 2026", bank: "Chase ****4521", status: "pending" as const },
  { id: 2, amount: "$500.00", date: "Feb 20, 2026", bank: "Chase ****4521", status: "approved" as const },
  { id: 3, amount: "$150.00", date: "Feb 10, 2026", bank: "Chase ****4521", status: "completed" as const },
  { id: 4, amount: "$300.00", date: "Jan 28, 2026", bank: "Chase ****4521", status: "rejected" as const },
];

export default function Payouts() {
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false);

  return (
    <UserLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Payouts</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Request withdrawals</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="accent-gradient text-accent-foreground text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-[0.98] transition-transform"
          >
            {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {showForm ? "Cancel" : "New Request"}
          </button>
        </div>

        {/* Pending amount banner */}
        <div className="fintech-gradient rounded-2xl p-4 text-primary-foreground flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest opacity-70">Pending Payouts</p>
            <p className="text-2xl font-bold mt-0.5">$200.00</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-widest opacity-70">Available</p>
            <p className="text-2xl font-bold mt-0.5 text-accent">$1,250.00</p>
          </div>
        </div>

        {showForm && (
          <div className="bg-card rounded-2xl border border-accent/30 p-4 animate-fade-in">
            <h3 className="font-bold text-sm mb-4">New Payout Request</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Amount</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-4 py-3 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Bank Account</label>
                <button className="w-full mt-1.5 px-3 py-3 rounded-xl border border-input bg-muted/50 text-sm font-medium flex items-center justify-between">
                  <span>Chase Bank ****4521</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <button className="w-full accent-gradient text-accent-foreground text-sm font-semibold py-3.5 rounded-xl active:scale-[0.98] transition-transform mt-1">
                Submit Request
              </button>
            </div>
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="text-sm font-bold mb-3">History</h2>
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
                  <p className="text-[11px] text-muted-foreground mt-0.5">{p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
