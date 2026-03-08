import { AdminLayout } from "@/components/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Check, X } from "lucide-react";

const payouts = [
  { id: 1, user: "Alex Johnson", amount: "$200.00", bank: "Chase ****4521", date: "Mar 5, 2026", status: "pending" as const },
  { id: 2, user: "Tom Baker", amount: "$750.00", bank: "Wells Fargo ****8899", date: "Mar 5, 2026", status: "pending" as const },
  { id: 3, user: "Sarah Williams", amount: "$500.00", bank: "BofA ****1234", date: "Mar 4, 2026", status: "approved" as const },
  { id: 4, user: "Mike Chen", amount: "$300.00", bank: "Citi ****5678", date: "Mar 3, 2026", status: "completed" as const },
  { id: 5, user: "Lisa Park", amount: "$150.00", bank: "Chase ****9012", date: "Mar 2, 2026", status: "rejected" as const },
];

export default function AdminPayouts() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payout Approvals</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and process withdrawal requests</p>
        </div>

        <div className="space-y-3">
          {payouts.map((p) => (
            <div key={p.id} className="bg-card rounded-xl border border-border p-4 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{p.user}</p>
                  <p className="text-xs text-muted-foreground">{p.bank}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{p.amount}</p>
                  <StatusBadge status={p.status}>{p.status}</StatusBadge>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">{p.date}</span>
                {p.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button className="h-8 px-3 rounded-lg bg-success/10 text-success text-xs font-medium flex items-center gap-1 hover:bg-success/20 transition-colors">
                      <Check className="h-3 w-3" /> Approve
                    </button>
                    <button className="h-8 px-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium flex items-center gap-1 hover:bg-destructive/20 transition-colors">
                      <X className="h-3 w-3" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
