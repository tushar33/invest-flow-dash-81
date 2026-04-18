import { useState, type FormEvent } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { Package, BookOpen, Calendar, XCircle } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { admin as adminApi, type AdminPackage } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatCredits } from "@/lib/format";

/* ── Edit Assignment Date Modal ───────────────────────────────────────── */
interface EditDateModalProps { pkg: AdminPackage; onClose: () => void; onSuccess: () => void; }

function EditDateModal({ pkg, onClose, onSuccess }: EditDateModalProps) {
  const currentDate = pkg.assignedDate.slice(0, 10);
  const [date, setDate] = useState(currentDate);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (assignedDate: string) =>
      adminApi.updateAssignmentDate(pkg.packageId, { assignedDate: new Date(assignedDate).toISOString() }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-packages"] }); onSuccess(); onClose(); },
    onError: (err: Error) => setError(err.message),
  });
  function handleSubmit(e: FormEvent) { e.preventDefault(); setError(""); if (date === currentDate) return; mutation.mutate(date); }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><h3 className="text-lg font-semibold">Edit Assignment Date</h3></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">User:</span> {pkg.userName}</p>
            <p><span className="font-medium text-foreground">Contribution:</span> {formatCredits(Number(pkg.principalAmount))}</p>
            <p><span className="font-medium text-foreground">Cycles completed:</span> {pkg.cyclesCompleted}/{pkg.totalCycles}</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assignedDate">New Assignment Date</Label>
              <Input id="assignedDate" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
              <p className="text-xs text-muted-foreground">Only allowed when no reward cycles have been processed.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending || date === currentDate}>
                {mutation.isPending ? "Updating…" : "Update Date"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Cancel Plan Confirmation ──────────────────────────────────────── */
interface CancelModalProps { pkg: AdminPackage; onClose: () => void; }

function CancelPackageModal({ pkg, onClose }: CancelModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => adminApi.cancelPackage(pkg.packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      toast({ title: "Plan cancelled successfully" });
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: "Cannot cancel plan after rewards started", description: err.message, variant: "destructive" });
      onClose();
    },
  });

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Plan</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this plan?
            <span className="block mt-2 text-foreground font-medium">
              {pkg.userName} — {formatCredits(Number(pkg.principalAmount))}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>No, keep it</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={mutation.isPending}
            onClick={(e) => { e.preventDefault(); mutation.mutate(); }}
          >
            {mutation.isPending ? "Cancelling…" : "Yes, cancel plan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ── Filters ─────────────────────────────────────────────────────────── */
const filterDefaults = { userId: "", status: "", roiPercentage: "", from: "", to: "" };

const filterFields: FilterField[] = [
  { key: "userId", label: "User Search", type: "search", placeholder: "User ID..." },
  {
    key: "status", label: "Status", type: "select", placeholder: "All",
    options: [{ label: "Active", value: "ACTIVE" }, { label: "Completed", value: "MATURED" }, { label: "Closed", value: "CLOSED" }],
  },
  {
    key: "roiPercentage", label: "Reward %", type: "select", placeholder: "All",
    options: [{ label: "5%", value: "5" }, { label: "7%", value: "7" }, { label: "10%", value: "10" }],
  },
  { key: "from", label: "From Date", type: "date", placeholder: "Start date" },
  { key: "to", label: "To Date", type: "date", placeholder: "End date" },
];

export default function AdminPackages() {
  const navigate = useNavigate();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useUrlFilters(filterDefaults);
  const [editTarget, setEditTarget] = useState<AdminPackage | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AdminPackage | null>(null);

  const { data: pkgs, isLoading } = useQuery({
    queryKey: ["admin-packages", filters],
    queryFn: () => adminApi.packages({
      userId: filters.userId || undefined,
      status: filters.status || undefined,
      roiPercentage: filters.roiPercentage || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    }),
  });

  const filtered = (pkgs ?? []).filter(p => {
    if (filters.userId && p.userId !== filters.userId && !p.userName.toLowerCase().includes(filters.userId.toLowerCase())) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.roiPercentage && String(p.roiPercentage) !== filters.roiPercentage) return false;
    if (filters.from && p.assignedDate < filters.from) return false;
    if (filters.to && p.assignedDate > filters.to) return false;
    return true;
  });

  const statusMap: Record<string, "active" | "completed" | "inactive"> = {
    ACTIVE: "active", MATURED: "completed", CLOSED: "inactive",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Plans</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filters.userId ? `Filtered by user` : "All assigned plans"}
            </p>
          </div>
          {filters.userId && (
            <Button variant="outline" size="sm" onClick={() => setFilters({ userId: "" })}>
              Show All
            </Button>
          )}
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
        ) : !filtered.length ? (
          <p className="text-center text-muted-foreground py-12">No plans found</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((pkg) => (
              <div key={pkg.packageId} className="bg-card rounded-xl border border-border p-4 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{pkg.userName}</p>
                      <p className="text-lg font-bold">{formatCredits(Number(pkg.principalAmount))}</p>
                    </div>
                  </div>
                  <StatusBadge status={statusMap[pkg.status] || "inactive"}>{pkg.status}</StatusBadge>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground flex-wrap">
                  <span>Reward: {pkg.roiPercentage}%</span>
                  <span>Cycles: {pkg.cyclesCompleted}/{pkg.totalCycles}</span>
                  <span>Next Reward: {new Date(pkg.nextRoiDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span>Assigned: {new Date(pkg.assignedDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => navigate(`/wallet/ledger?userId=${pkg.userId}`)}>
                    <BookOpen className="h-3.5 w-3.5 mr-1" /> View Ledger
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs"
                    disabled={pkg.cyclesCompleted > 0}
                    title={pkg.cyclesCompleted > 0 ? "Cannot edit after reward cycles are processed" : "Edit assignment date"}
                    onClick={() => setEditTarget(pkg)}
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1" /> Edit Date
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    disabled={pkg.status !== "ACTIVE"}
                    title={pkg.status !== "ACTIVE" ? "Only active plans can be cancelled" : "Cancel this plan"}
                    onClick={() => setCancelTarget(pkg)}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel Plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {editTarget && (
          <EditDateModal pkg={editTarget} onClose={() => setEditTarget(null)} onSuccess={() => setEditTarget(null)} />
        )}
        {cancelTarget && (
          <CancelPackageModal pkg={cancelTarget} onClose={() => setCancelTarget(null)} />
        )}
      </div>
    </AdminLayout>
  );
}
