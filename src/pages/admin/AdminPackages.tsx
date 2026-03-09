import { AdminLayout } from "@/components/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { admin as adminApi } from "@/lib/api";

function formatINR(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export default function AdminPackages() {
  const { data: pkgs, isLoading } = useQuery({ queryKey: ["admin-packages"], queryFn: adminApi.packages });

  const statusMap: Record<string, "active" | "completed" | "inactive"> = {
    ACTIVE: "active", MATURED: "completed", CLOSED: "inactive",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Packages</h1>
          <p className="text-sm text-muted-foreground mt-1">All assigned packages</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {(pkgs ?? []).map((pkg) => (
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
                  <span>Assigned: {new Date(pkg.assignedDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
