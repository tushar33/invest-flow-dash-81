import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { PageHeader } from "@/components/ui/page-header";
import { GradientCard } from "@/components/ui/gradient-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Gift, CalendarDays, Package as PackageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { packages as packagesApi } from "@/lib/api";
import { formatCredits } from "@/lib/format";
import { LANG, FILTER_OPTIONS, planStatusLabel } from "@/lib/language";
import { PlanCycleDetails } from "@/components/PlanCycleDetails";

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
              <p className="text-2xl font-bold mt-1 tabular-nums">{activeCount}</p>
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
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((pkg) => {
              const statusMap: Record<string, "active" | "completed" | "inactive"> = {
                ACTIVE: "active", MATURED: "completed", CLOSED: "inactive"
              };
              const planCycles = pkg.totalCycles ?? pkg.durationMonths ?? 1;
              const remainingCycles = Math.max(0, planCycles - pkg.cyclesCompleted);
              const remainingBalance = remainingCycles * Number(pkg.roiCycleAmount);
              const progress = (pkg.cyclesCompleted / planCycles) * 100;
              return (
                <div key={pkg.id} className="group bg-card rounded-xl border border-border/70 p-4 shadow-card hover:shadow-elevated hover:border-accent/40 transition-all animate-slide-up-fade flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <PackageIcon className="h-4.5 w-4.5 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{LANG.plans.contribution}</p>
                        <p className="text-lg font-bold tabular-nums leading-tight">{formatCredits(Number(pkg.principalAmount))}</p>
                        {(pkg.legacyUserCode || pkg.legacyPkgCnt != null) && (
                          <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                            {[pkg.legacyUserCode, pkg.legacyPkgCnt != null ? `pkg ${pkg.legacyPkgCnt}` : null]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={statusMap[pkg.status] || "inactive"}>{planStatusLabel(pkg.status)}</StatusBadge>
                  </div>

                  {/* Reward chip */}
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] bg-gradient-to-r from-accent/15 to-accent/5 text-accent font-semibold rounded-lg px-2.5 py-1.5 border border-accent/20 w-fit">
                    <Gift className="h-3 w-3" />
                    {LANG.reward.rewardCycleLabel(Number(pkg.roiPercentage), formatCredits(Number(pkg.roiCycleAmount)))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-border/50">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{LANG.plans.monthlyBenefit}</p>
                      <p className="text-sm font-semibold mt-0.5 tabular-nums">{formatCredits(Number(pkg.roiCycleAmount))}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{LANG.plans.remainingBalance}</p>
                      <p className="text-sm font-semibold mt-0.5 tabular-nums">{formatCredits(remainingBalance)}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-muted-foreground uppercase tracking-wider font-semibold">{LANG.plans.cyclesCompleted}</span>
                      <span className="font-semibold tabular-nums">{pkg.cyclesCompleted}/{planCycles}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-accent rounded-full transition-all duration-700 shadow-glow"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Assigned date */}
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <CalendarDays className="h-3 w-3 shrink-0" />
                    <span className="opacity-70">{LANG.plans.assigned}:</span>
                    <span className="font-medium text-foreground">{new Date(pkg.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>

                  <PlanCycleDetails pkg={pkg} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
