import { AdminLayout } from "@/components/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Package, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { admin as adminApi } from "@/lib/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function formatINR(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export default function AdminPackages() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userIdFilter = searchParams.get("userId");

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
                      <p className="text-lg font-bold">{formatINR(pkg.principalAmount)}</p>
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
                <div className="mt-3 pt-3 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => navigate(`/wallet/ledger?packageId=${pkg.packageId}`)}
                  >
                    <BookOpen className="h-3.5 w-3.5 mr-1" /> View Ledger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
