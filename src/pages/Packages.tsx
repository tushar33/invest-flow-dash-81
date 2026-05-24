import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { PageHeader } from "@/components/ui/page-header";
import { GradientCard } from "@/components/ui/gradient-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Gift, CalendarDays, RefreshCw, Package as PackageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { packages as packagesApi } from "@/lib/api";
import { formatCredits } from "@/lib/format";
import { LANG, FILTER_OPTIONS, planStatusLabel } from "@/lib/language";

const filterDefaults = { status: "", roiPercentage: "" };

const filterFields: FilterField[] = [
  {
    key: "status", label: LANG.common.status, type: "select", placeholder: LANG.common.all,
    options: [...FILTER_OPTIONS.planStatus],
  },
  {
    key: "roiPercentage", label: LANG.filter.rewardPercent, type: "select", placeholder: LANG.common.all,
    options: [...FILTER_OPTIONS.rewardPercent],
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

  const filtered = (pkgs ?? []).filter(p => {
    if (filters.status && p.status !== filters.status) return false;
    if (filters.roiPercentage && p.roiPercentage !== filters.roiPercentage) return false;
    return true;
  });

  const totalContribution = filtered.reduce((s, p) => s + Number(p.principalAmount), 0);
  const activeCount = filtered.filter(p => p.status === "ACTIVE").length;

  return (
    <UserLayout>
      <div className="space-y-6">
        <PageHeader
          icon={<PackageIcon className="h-5 w-5" />}
          title={LANG.plans.myPlans}
          subtitle={LANG.plans.assignedByAdmin}
        />

        <GradientCard variant="hero" className="animate-slide-up-fade">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest opacity-80 font-semibold">{LANG.dashboard.totalContribution}</p>
              <p className="text-2xl font-bold mt-1 tabular-nums">{formatCredits(totalContribution)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest opacity-80 font-semibold">{LANG.dashboard.activePlans}</p>
              <p className="text-2xl font-bold mt-1 text-accent tabular-nums">{activeCount}</p>
            </div>
          </div>
        </GradientCard>

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
          <EmptyState icon={PackageIcon} title={LANG.plans.noneFound} description={LANG.plans.noneDescription} />
        ) : (
          <div className="space-y-3">
            {filtered.map((pkg) => {
              const statusMap: Record<string, "active" | "completed" | "inactive"> = {
                ACTIVE: "active", MATURED: "completed", CLOSED: "inactive"
              };
              const planCycles = pkg.totalCycles ?? pkg.durationMonths ?? 1;
              const remainingCycles = Math.max(0, planCycles - pkg.cyclesCompleted);
              const remainingBalance = remainingCycles * Number(pkg.roiCycleAmount);
              const progress = (pkg.cyclesCompleted / planCycles) * 100;
              return (
                <div key={pkg.id} className="bg-card rounded-2xl border border-border p-4 shadow-card hover:shadow-elevated hover:border-accent/30 transition-all animate-slide-up-fade">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{LANG.plans.contribution}</p>
                      <p className="text-xl font-bold tabular-nums">{formatCredits(Number(pkg.principalAmount))}</p>
                    </div>
                    <StatusBadge status={statusMap[pkg.status] || "inactive"}>{planStatusLabel(pkg.status)}</StatusBadge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-[11px] bg-gradient-to-r from-accent/15 to-accent/5 text-accent font-semibold rounded-lg px-2.5 py-1.5 border border-accent/20">
                      <Gift className="h-3 w-3" />
                      {LANG.reward.rewardCycleLabel(Number(pkg.roiPercentage), formatCredits(Number(pkg.roiCycleAmount)))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-border/50">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{LANG.plans.monthlyBenefit}</p>
                      <p className="text-[13px] font-semibold mt-0.5 tabular-nums">{formatCredits(Number(pkg.roiCycleAmount))}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{LANG.plans.remainingBalance}</p>
                      <p className="text-[13px] font-semibold mt-0.5 tabular-nums">{formatCredits(remainingBalance)}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-muted-foreground">{LANG.plans.cyclesCompleted}</span>
                      <span className="font-semibold tabular-nums">{pkg.cyclesCompleted}/{planCycles}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-accent rounded-full transition-all duration-700 shadow-glow"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <CalendarDays className="h-3 w-3 shrink-0" />
                      <div>
                        <p className="text-[10px] opacity-70">{LANG.plans.assigned}</p>
                        <p className="font-medium text-foreground">{new Date(pkg.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <RefreshCw className="h-3 w-3 shrink-0" />
                      <div>
                        <p className="text-[10px] opacity-70">{LANG.plans.nextReward}</p>
                        <p className="font-medium text-foreground">{pkg.status === "ACTIVE" ? new Date(pkg.nextRoiDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : LANG.common.noData}</p>
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
