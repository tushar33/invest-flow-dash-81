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
import { LANG, FILTER_OPTIONS, planStatusLabel } from "@/lib/language";
import { PlanCycleDetails } from "@/components/PlanCycleDetails";
import { DEFAULT_DAYS_BETWEEN_CYCLES } from "@/lib/cycle-schedule";

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
        <DialogHeader><h3 className="text-lg font-semibold">{LANG.plans.editAssignmentDate}</h3></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">{LANG.plans.userLabel}</span> {pkg.userName}</p>
            <p><span className="font-medium text-foreground">{LANG.plans.contributionLabel}</span> {formatCredits(Number(pkg.principalAmount))}</p>
            <p><span className="font-medium text-foreground">{LANG.plans.cyclesCompletedLabel}</span> {pkg.cyclesCompleted}/{pkg.totalCycles ?? pkg.durationMonths ?? 1}</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assignedDate">{LANG.plans.newAssignmentDate}</Label>
              <Input id="assignedDate" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
              <p className="text-xs text-muted-foreground">{LANG.plans.editDateHint}</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>{LANG.common.cancel}</Button>
              <Button type="submit" disabled={mutation.isPending || date === currentDate}>
                {mutation.isPending ? LANG.common.updating : LANG.plans.updateDate}
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
      toast({ title: LANG.toast.planCancelled });
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: LANG.toast.planCancelBlocked, description: err.message, variant: "destructive" });
      onClose();
    },
  });

  return (
    <AlertDialog open onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{LANG.plans.cancelConfirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {LANG.plans.cancelConfirmDescription}
            <span className="block mt-2 text-foreground font-medium">
              {pkg.userName} — {formatCredits(Number(pkg.principalAmount))}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>{LANG.plans.keepPlan}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={mutation.isPending}
            onClick={(e) => { e.preventDefault(); mutation.mutate(); }}
          >
            {mutation.isPending ? LANG.common.cancelling : LANG.plans.yesCancelPlan}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ── Filters ─────────────────────────────────────────────────────────── */
const filterDefaults = { userId: "", status: "", roiPercentage: "", from: "", to: "" };

const filterFields: FilterField[] = [
  { key: "userId", label: LANG.filter.userSearch, type: "search", placeholder: LANG.filter.userSearchPlaceholder },
  {
    key: "status", label: LANG.common.status, type: "select", placeholder: LANG.common.all,
    options: [...FILTER_OPTIONS.planStatusWithClosed],
  },
  {
    key: "roiPercentage", label: LANG.filter.rewardPercent, type: "select", placeholder: LANG.common.all,
    options: [...FILTER_OPTIONS.rewardPercent],
  },
  { key: "from", label: LANG.filter.fromDate, type: "date", placeholder: LANG.filter.startDate },
  { key: "to", label: LANG.filter.toDate, type: "date", placeholder: LANG.filter.endDate },
];

export default function AdminPackages() {
  const navigate = useNavigate();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useUrlFilters(filterDefaults);
  const [editTarget, setEditTarget] = useState<AdminPackage | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AdminPackage | null>(null);

  const { data: pkgs, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-packages", filters],
    queryFn: () => adminApi.packages({
      userId: filters.userId || undefined,
      status: filters.status || undefined,
      roiPercentage: filters.roiPercentage || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    }),
  });

  const { data: settings = [] } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: adminApi.settings,
  });

  const daysBetweenCycles = Number(
    settings.find((s) => s.key === "daysBetweenCycles")?.value
      ?? settings.find((s) => s.key === "roiCycleDays")?.value
      ?? DEFAULT_DAYS_BETWEEN_CYCLES,
  );

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
        <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-xl border-b border-border/60 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{LANG.plans.adminTitle}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filters.userId ? LANG.plans.filteredByUser : LANG.plans.allAssigned}
            </p>
          </div>
          {filters.userId && (
            <Button variant="outline" size="sm" onClick={() => setFilters({ userId: "" })}>
              {LANG.common.showAll}
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
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : LANG.common.error}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              {LANG.common.retry}
            </Button>
          </div>
        ) : !filtered.length ? (
          <p className="text-center text-muted-foreground py-12">{LANG.plans.noneFound}</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((pkg) => {
              const planCycles = pkg.totalCycles ?? pkg.durationMonths ?? 1;
              const progress = Math.min(100, (pkg.cyclesCompleted / planCycles) * 100);
              return (
              <div key={pkg.packageId} className="group bg-card rounded-xl border border-border/70 p-3.5 hover:border-accent/40 hover:shadow-md transition-all animate-fade-in flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Package className="h-4.5 w-4.5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-xs text-muted-foreground truncate">{pkg.userName}</p>
                      <p className="text-base font-bold tabular-nums leading-tight">{formatCredits(Number(pkg.principalAmount))}</p>
                    </div>
                  </div>
                  <StatusBadge status={statusMap[pkg.status] || "inactive"}>{planStatusLabel(pkg.status)}</StatusBadge>
                </div>

                {/* Inline stats */}
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20">
                    {pkg.roiPercentage}% Reward
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground tabular-nums">
                    {pkg.cyclesCompleted}/{planCycles} cycles
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                    {new Date(pkg.assignedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}
                  </span>
                </div>

                {/* Progress */}
                <div className="mt-2.5 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>

                {/* Cycle details */}
                <div className="mt-2.5">
                  <PlanCycleDetails pkg={pkg} daysBetweenCycles={daysBetweenCycles} compact />
                </div>

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-1 -mx-0.5">
                  <Button size="sm" variant="ghost" className="flex-1 h-8 text-[11px] px-2" onClick={() => navigate(`/wallet/ledger?userId=${pkg.userId}`)}>
                    <BookOpen className="h-3.5 w-3.5 mr-1" /> Ledger
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1 h-8 text-[11px] px-2"
                    disabled={pkg.cyclesCompleted > 0}
                    title={pkg.cyclesCompleted > 0 ? LANG.plans.cannotEditTooltip : LANG.plans.editDateTooltip}
                    onClick={() => setEditTarget(pkg)}
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1" /> Date
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1 h-8 text-[11px] px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={pkg.status !== "ACTIVE"}
                    title={pkg.status !== "ACTIVE" ? LANG.plans.onlyActiveCancelTooltip : LANG.plans.cancelPlanTooltip}
                    onClick={() => setCancelTarget(pkg)}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
              );
            })}
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
