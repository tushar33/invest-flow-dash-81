import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { TrendingUp, Clock, CalendarDays, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { packages as packagesApi } from "@/lib/api";

function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

const filterDefaults = { status: "", roiPercentage: "" };

const filterFields: FilterField[] = [
  {
    key: "status", label: "Status", type: "select", placeholder: "All",
    options: [{ label: "Active", value: "ACTIVE" }, { label: "Completed", value: "MATURED" }],
  },
  {
    key: "roiPercentage", label: "ROI %", type: "select", placeholder: "All",
    options: [{ label: "5%", value: "5" }, { label: "7%", value: "7" }, { label: "10%", value: "10" }],
  },
];

export default function Packages() {
  const { filters, setFilters, resetFilters, hasActiveFilters } = useUrlFilters(filterDefaults);

  const { data: pkgs, isLoading } = useQuery({
    queryKey: ["packages", filters],
    queryFn: () => packagesApi.list({
      status: filters.status || undefined,
      roiPercentage: filters.roiPercentage || undefined,
    }),
  });

  // Client-side fallback
  const filtered = (pkgs ?? []).filter(p => {
    if (filters.status && p.status !== filters.status) return false;
    if (filters.roiPercentage && p.roiPercentage !== filters.roiPercentage) return false;
    return true;
  });

  const totalInvested = filtered.reduce((s, p) => s + Number(p.principalAmount), 0);
  const activeCount = filtered.filter(p => p.status === "ACTIVE").length;

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
          <p className="text-center text-muted-foreground py-12">No packages found</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((pkg) => {
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
