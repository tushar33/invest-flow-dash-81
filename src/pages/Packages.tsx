import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { TrendingUp, Clock, CalendarDays, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { packages as packagesApi } from "@/lib/api";

function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export default function Packages() {
  const { data: pkgs, isLoading } = useQuery({ queryKey: ["packages"], queryFn: packagesApi.list });

  const totalInvested = pkgs?.reduce((s, p) => s + Number(p.principalAmount), 0) ?? 0;
  const activeCount = pkgs?.filter(p => p.status === "ACTIVE").length ?? 0;

  return (
    <UserLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">My Packages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Assigned by administrator</p>
        </div>

        <div className="fintech-gradient rounded-2xl p-4 text-primary-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest opacity-70">Total Invested</p>
              <p className="text-xl font-bold mt-0.5">{formatINR(totalInvested)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest opacity-70">Active Packages</p>
              <p className="text-xl font-bold mt-0.5 text-accent">{activeCount}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !pkgs?.length ? (
          <p className="text-center text-muted-foreground py-12">No packages assigned yet</p>
        ) : (
          <div className="space-y-3">
            {pkgs.map((pkg) => {
              const statusMap: Record<string, "active" | "completed" | "inactive"> = {
                ACTIVE: "active", MATURED: "completed", CLOSED: "inactive"
              };
              return (
                <div key={pkg.id} className="bg-card rounded-2xl border border-border p-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xl font-bold">{formatINR(Number(pkg.principalAmount))}</p>
                    <StatusBadge status={statusMap[pkg.status] || "inactive"}>{pkg.status}</StatusBadge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-[11px] bg-accent/10 text-accent font-semibold rounded-lg px-2.5 py-1.5">
                      <TrendingUp className="h-3 w-3" />
                      {pkg.roiPercentage}% ROI · {formatINR(Number(pkg.roiCycleAmount))}/cycle
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-muted-foreground">Cycles</span>
                      <span className="font-semibold">{pkg.cyclesCompleted}/{pkg.totalCycles}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full accent-gradient rounded-full transition-all duration-500"
                        style={{ width: `${(pkg.cyclesCompleted / pkg.totalCycles) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <CalendarDays className="h-3 w-3 shrink-0" />
                      <div>
                        <p className="text-[10px] opacity-70">Assigned</p>
                        <p className="font-medium text-foreground">{new Date(pkg.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <RefreshCw className="h-3 w-3 shrink-0" />
                      <div>
                        <p className="text-[10px] opacity-70">Next ROI</p>
                        <p className="font-medium text-foreground">{pkg.status === "ACTIVE" ? new Date(pkg.nextRoiDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
