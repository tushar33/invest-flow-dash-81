import { useState, type FormEvent } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Package, BookOpen, Calendar } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { admin as adminApi, type AdminPackage } from "@/lib/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatINR(n: number) { return "₹" + n.toLocaleString("en-IN"); }

/* ── Edit Assignment Date Modal ───────────────────────────────────────── */

interface EditDateModalProps {
  pkg: AdminPackage;
  onClose: () => void;
  onSuccess: () => void;
}

function EditDateModal({ pkg, onClose, onSuccess }: EditDateModalProps) {
  const currentDate = pkg.assignedDate.slice(0, 10);
  const [date, setDate] = useState(currentDate);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (assignedDate: string) =>
      adminApi.updateAssignmentDate(pkg.packageId, { assignedDate: new Date(assignedDate).toISOString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      onSuccess();
      onClose();
    },
    onError: (err: Error) => setError(err.message),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (date === currentDate) return;
    mutation.mutate(date);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <h3 className="text-lg font-semibold">Edit Assignment Date</h3>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">User:</span> {pkg.userName}</p>
            <p><span className="font-medium text-foreground">Principal:</span> {formatINR(Number(pkg.principalAmount))}</p>
            <p><span className="font-medium text-foreground">Cycles completed:</span> {pkg.cyclesCompleted}/{pkg.totalCycles}</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assignedDate">New Assignment Date</Label>
              <Input
                id="assignedDate"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Only allowed when no ROI cycles have been processed.
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending || date === currentDate}
              >
                {mutation.isPending ? "Updating…" : "Update Date"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminPackages() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userIdFilter = searchParams.get("userId");
  const [editTarget, setEditTarget] = useState<AdminPackage | null>(null);

  const { data: pkgs, isLoading } = useQuery({ queryKey: ["admin-packages"], queryFn: adminApi.packages });

  const filtered = userIdFilter
    ? (pkgs ?? []).filter(p => p.userId === userIdFilter)
    : (pkgs ?? []);

  const statusMap: Record<string, "active" | "completed" | "inactive"> = {
    ACTIVE: "active", MATURED: "completed", CLOSED: "inactive",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Packages</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {userIdFilter ? `Showing packages for user ${userIdFilter}` : "All assigned packages"}
            </p>
          </div>
          {userIdFilter && (
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/packages")}>
              Show All
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !filtered.length ? (
          <p className="text-center text-muted-foreground py-12">No packages found</p>
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
                      <p className="text-lg font-bold">{formatINR(Number(pkg.principalAmount))}</p>
                    </div>
                  </div>
                  <StatusBadge status={statusMap[pkg.status] || "inactive"}>{pkg.status}</StatusBadge>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground flex-wrap">
                  <span>ROI: {pkg.roiPercentage}%</span>
                  <span>Cycles: {pkg.cyclesCompleted}/{pkg.totalCycles}</span>
                  <span>Next ROI: {new Date(pkg.nextRoiDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span>Assigned: {new Date(pkg.assignedDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => navigate(`/wallet/ledger?userId=${pkg.userId}`)}
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1" /> View Ledger
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    disabled={pkg.cyclesCompleted > 0}
                    title={pkg.cyclesCompleted > 0 ? "Cannot edit after ROI cycles are processed" : "Edit assignment date"}
                    onClick={() => setEditTarget(pkg)}
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1" /> Edit Date
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {editTarget && (
          <EditDateModal
            pkg={editTarget}
            onClose={() => setEditTarget(null)}
            onSuccess={() => setEditTarget(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}
