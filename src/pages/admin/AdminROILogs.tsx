import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { StatusBadge } from "@/components/StatusBadge";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { ChevronDown, Clock, Zap } from "lucide-react";
import { format, isToday } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admin as adminApi, type RoiLogCreditedPackage, type RoiProcessingLog } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { LANG, FILTER_OPTIONS, runStatusLabel, runTypeLabel } from "@/lib/language";
import { cn } from "@/lib/utils";

const filterDefaults = { runType: "", status: "", from: "", to: "" };

const filterFields: FilterField[] = [
  {
    key: "runType", label: LANG.filter.runType, type: "select", placeholder: LANG.common.all,
    options: [...FILTER_OPTIONS.runType],
  },
  {
    key: "status", label: LANG.common.status, type: "select", placeholder: LANG.common.all,
    options: [...FILTER_OPTIONS.runStatus],
  },
  { key: "from", label: LANG.filter.fromDate, type: "date", placeholder: LANG.filter.startDate },
  { key: "to", label: LANG.filter.toDate, type: "date", placeholder: LANG.filter.endDate },
];

function formatRunTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return LANG.common.noData;
  if (isToday(d)) return LANG.reward.runToday(format(d, "h:mm a"));
  return format(d, "MMM d, yyyy 'at' h:mm a");
}

function formatRunListDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return LANG.common.noData;
  if (isToday(d)) return LANG.reward.runToday(format(d, "h:mm a"));
  return format(d, "MMM d, h:mm a");
}

function runLogDescription(log: RoiProcessingLog): string {
  if (log.status === "FAILED") {
    return log.errorsCount > 0 ? LANG.reward.runLogErrors(log.errorsCount) : LANG.status.failed;
  }
  if (log.packagesProcessed > 0) {
    return LANG.reward.runLogPackagesCredited(log.packagesProcessed);
  }
  if (log.runType === "MANUAL") return LANG.reward.runLogTriggeredByAdmin;
  return "";
}

function runStatusVariant(status: RoiProcessingLog["status"]) {
  if (status === "SUCCESS") return "approved" as const;
  if (status === "FAILED") return "rejected" as const;
  return "pending" as const;
}

function formatInr(amount: string | number | null | undefined): string {
  const value = Number(amount);
  if (!Number.isFinite(value)) return LANG.common.noData;
  return `₹${value.toLocaleString("en-IN")}`;
}

function RunLogCard({ log }: { log: RoiProcessingLog }) {
  const [expanded, setExpanded] = useState(false);
  const showPackages = log.status !== "FAILED" && log.packagesProcessed > 0;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-roi-log-packages", log.id],
    queryFn: () => adminApi.roiLogPackages(log.id),
    enabled: expanded && showPackages,
  });

  const packages: RoiLogCreditedPackage[] = data?.data ?? [];

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-2.5">
      <p className="text-sm font-medium">{formatRunListDate(log.startedAt)}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border",
            log.runType === "CRON"
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-accent/10 text-accent border-accent/20",
          )}
        >
          {runTypeLabel(log.runType)}
        </span>
        <StatusBadge status={runStatusVariant(log.status)}>{runStatusLabel(log.status)}</StatusBadge>
      </div>
      {runLogDescription(log) && (
        <p className="text-xs text-muted-foreground">{runLogDescription(log)}</p>
      )}
      {showPackages && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
            {expanded ? LANG.reward.runLogHidePackages : LANG.reward.runLogViewPackages}
          </button>
          {expanded && (
            <div className="mt-2 rounded-lg border border-border/70 bg-muted/20 p-3 space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {LANG.reward.runLogCreditedPackages}
              </p>
              {isLoading ? (
                <div className="flex justify-center py-3">
                  <div className="h-5 w-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : packages.length === 0 ? (
                <p className="text-xs text-muted-foreground">{LANG.reward.runLogNoPackageDetails}</p>
              ) : (
                <ul className="space-y-2">
                  {packages.map((pkg) => (
                    <li
                      key={`${pkg.packageId}-${pkg.creditedAt}`}
                      className="flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {pkg.userName}
                          {pkg.username && (
                            <span className="ml-1 text-accent font-mono font-normal">(@{pkg.username})</span>
                          )}
                        </p>
                        <p className="text-muted-foreground truncate">
                          {formatInr(pkg.principalAmount)} · {pkg.roiPercentage}% reward
                          {pkg.cycleNumber != null ? ` · ${LANG.reward.runLogCycleLabel(pkg.cycleNumber)}` : ""}
                        </p>
                      </div>
                      {pkg.roiAmount && (
                        <p className="shrink-0 font-medium text-emerald-500">+{formatInr(pkg.roiAmount)}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminROILogs() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useUrlFilters(filterDefaults);

  const { data: logs, isLoading } = useQuery({
    queryKey: ["admin-roi-logs", filters],
    queryFn: () => adminApi.roiLogs({
      runType: filters.runType || undefined,
      status: filters.status || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    }),
  });

  const triggerMutation = useMutation({
    mutationFn: adminApi.triggerRoi,
    onSuccess: (data) => {
      toast({ title: LANG.reward.processed, description: data.message });
      qc.invalidateQueries({ queryKey: ["admin-roi-logs"] });
    },
    onError: (err: any) => toast({ title: LANG.common.error, description: err.message, variant: "destructive" }),
  });

  const logItems: RoiProcessingLog[] = logs?.data ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-xl border-b border-border/60 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{LANG.reward.logs}</h1>
            <p className="text-sm text-muted-foreground mt-1">{LANG.reward.logsSubtitle}</p>
            {logItems[0]?.startedAt && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {LANG.reward.lastRun(formatRunTimestamp(logItems[0].startedAt))}
              </p>
            )}
          </div>
          <button onClick={() => triggerMutation.mutate()} disabled={triggerMutation.isPending}
            className="accent-gradient text-accent-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 disabled:opacity-50">
            <Zap className="h-4 w-4" />
            {triggerMutation.isPending ? LANG.common.processing : LANG.reward.process}
          </button>
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
        ) : logItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{LANG.reward.noneFound}</p>
        ) : (
          <div className="space-y-3">
            {logItems.map((log) => (
              <RunLogCard key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
