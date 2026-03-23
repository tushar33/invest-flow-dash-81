import { AdminLayout } from "@/components/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admin as adminApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

function formatINR(n: number) { return "₹" + n.toLocaleString("en-IN"); }

const filterDefaults = { status: "", sourceType: "", from: "", to: "" };

const filterFields: FilterField[] = [
  {
    key: "status", label: "Status", type: "select", placeholder: "All",
    options: [
      { label: "Pending", value: "PENDING" },
      { label: "Approved", value: "PROCESSED" },
      { label: "Rejected", value: "REJECTED" },
    ],
  },
  {
    key: "sourceType", label: "Source Type", type: "select", placeholder: "All",
    options: [
      { label: "Manual", value: "MANUAL" },
      { label: "Auto Pay", value: "AUTO_PAY" },
    ],
  },
  { key: "from", label: "From Date", type: "date", placeholder: "Start date" },
  { key: "to", label: "To Date", type: "date", placeholder: "End date" },
];

export default function AdminPayouts() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useUrlFilters(filterDefaults);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: payoutsList, isLoading } = useQuery({
    queryKey: ["admin-payouts", filters],
    queryFn: () => adminApi.payoutsAll({
      status: filters.status || undefined,
      sourceType: filters.sourceType || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    }),
  });

  const processMutation = useMutation({
    mutationFn: ({ id, status, rejectionReason }: { id: string; status: string; rejectionReason?: string }) =>
      adminApi.processPayout(id, { status, rejectionReason }),
    onSuccess: () => {
      toast({ title: "Payout processed" });
      qc.invalidateQueries({ queryKey: ["admin-payouts"] });
      setRejectingId(null);
      setRejectReason("");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const statusMap: Record<string, "pending" | "approved" | "rejected"> = {
    PENDING: "pending", PROCESSED: "approved", REJECTED: "rejected",
  };

  // Client-side fallback
  const filtered = (payoutsList ?? []).filter(p => {
    if (filters.status && p.status !== filters.status) return false;
    if (filters.sourceType && (p.sourceType ?? "MANUAL") !== filters.sourceType) return false;
    if (filters.from && p.requestedAt < filters.from) return false;
    if (filters.to && p.requestedAt > filters.to) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payout Approvals</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and process withdrawal requests</p>
        </div>

        <FilterBar
          fields={filterFields}
          values={filters}
          onChange={(k, v) => setFilters({ [k]: v })}
          onReset={resetFilters}
          hasActive={hasActiveFilters}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No payouts found</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="bg-card rounded-xl border border-border p-4 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm">{p.requestType} Payout</p>
                    <p className="text-xs text-muted-foreground">{p.sourceType || "MANUAL"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatINR(Number(p.amount))}</p>
                    <StatusBadge status={statusMap[p.status] || "pending"}>{p.status}</StatusBadge>
                  </div>
                </div>

                {rejectingId === p.id && (
                  <div className="mt-3 space-y-2">
                    <input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Rejection reason..."
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    <div className="flex gap-2">
                      <button onClick={() => processMutation.mutate({ id: p.id, status: "REJECTED", rejectionReason: rejectReason })}
                        disabled={!rejectReason || processMutation.isPending}
                        className="h-8 px-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium disabled:opacity-50">
                        Confirm Reject
                      </button>
                      <button onClick={() => { setRejectingId(null); setRejectReason(""); }}
                        className="h-8 px-3 rounded-lg bg-muted text-xs font-medium">Cancel</button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {new Date(p.requestedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  {p.status === "PENDING" && rejectingId !== p.id && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => processMutation.mutate({ id: p.id, status: "PROCESSED" })}
                        disabled={processMutation.isPending}
                        className="h-8 px-3 rounded-lg bg-success/10 text-success text-xs font-medium flex items-center gap-1 hover:bg-success/20 transition-colors">
                        <Check className="h-3 w-3" /> Approve
                      </button>
                      <button onClick={() => setRejectingId(p.id)}
                        className="h-8 px-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium flex items-center gap-1 hover:bg-destructive/20 transition-colors">
                        <X className="h-3 w-3" /> Reject
                      </button>
                    </div>
                  )}
                </div>

                {p.rejectionReason && (
                  <p className="text-xs text-destructive mt-2">Reason: {p.rejectionReason}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
