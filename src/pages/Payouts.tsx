import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { CreditCard, Plus } from "lucide-react";
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payouts</h1>
            <p className="text-sm text-muted-foreground mt-1">Request and track withdrawals</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="accent-gradient text-accent-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Request
          </button>
        </div>

        {showForm && (
          <div className="bg-card rounded-xl border border-border p-4 animate-fade-in">
            <h3 className="font-semibold text-sm mb-3">New Payout Request</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Amount ($)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full mt-1 px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Bank Account</label>
                <div className="mt-1 px-3 py-2.5 rounded-lg border border-input bg-muted text-sm text-muted-foreground">
                  Chase Bank ****4521
                </div>
              </div>
              <button className="w-full accent-gradient text-accent-foreground text-sm font-medium py-2.5 rounded-lg">
                Submit Request
              </button>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-base font-semibold mb-3">Payout History</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {payouts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.amount}</p>
                    <p className="text-xs text-muted-foreground">{p.bank}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={p.status}>{p.status}</StatusBadge>
                  <p className="text-xs text-muted-foreground mt-1">{p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
