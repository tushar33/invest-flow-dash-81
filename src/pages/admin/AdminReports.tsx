import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { admin as adminApi } from "@/lib/api";
import { LANG } from "@/lib/language";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { usePlanCatalog } from "@/hooks/usePlanCatalog";
import { BUSINESS_CONTRIBUTORS, LEGACY_CONTRIBUTOR, LEGACY_CONTRIBUTOR_LABEL } from "@/lib/business-contributors";

type RangePreset = "this" | "last" | "last6";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function isoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function endOfMonth(year: number, monthIndex: number): string {
  return isoDate(new Date(year, monthIndex + 1, 0));
}

function presetRange(preset: RangePreset, today = new Date()): { from: string; to: string } {
  const year = today.getFullYear();
  const month = today.getMonth();
  if (preset === "this") {
    return { from: isoDate(new Date(year, month, 1)), to: endOfMonth(year, month) };
  }
  if (preset === "last") {
    const start = new Date(year, month - 1, 1);
    return { from: isoDate(start), to: endOfMonth(start.getFullYear(), start.getMonth()) };
  }
  const start = new Date(year, month - 5, 1);
  return { from: isoDate(start), to: endOfMonth(year, month) };
}

const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const MONTH_OPTIONS = [
  ["01", "January"],
  ["02", "February"],
  ["03", "March"],
  ["04", "April"],
  ["05", "May"],
  ["06", "June"],
  ["07", "July"],
  ["08", "August"],
  ["09", "September"],
  ["10", "October"],
  ["11", "November"],
  ["12", "December"],
] as const;

function yearOptions(selectedYear: number): number[] {
  const current = new Date().getFullYear();
  const start = Math.min(2024, selectedYear);
  const end = Math.max(current, selectedYear);
  const years: number[] = [];
  for (let year = start; year <= end; year += 1) years.push(year);
  return years;
}

export default function AdminReports() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaults = presetRange("this");
  const from = searchParams.get("from") || defaults.from;
  const to = searchParams.get("to") || defaults.to;
  const reportId = searchParams.get("report") || "packages-assigned";
  const plan = searchParams.get("plan") || "";
  const contributor = searchParams.get("contributor") || "";
  const isBusinessReport = reportId === "monthly-business";
  const defaultMonth = `${new Date().getFullYear()}-${pad(new Date().getMonth() + 1)}`;
  const period = searchParams.get("month") || defaultMonth;
  const isAllTime = period === "all";
  const monthValue = MONTH_PATTERN.test(period) ? period : defaultMonth;
  const [yearPart = String(new Date().getFullYear()), monthPart = "01"] = monthValue.split("-");
  const [downloading, setDownloading] = useState(false);
  const plans = usePlanCatalog();
  const rangeReady = isBusinessReport
    ? isAllTime || MONTH_PATTERN.test(monthValue)
    : DATE_PATTERN.test(from) && DATE_PATTERN.test(to) && from <= to;
  const range = isBusinessReport
    ? {
        ...(isAllTime ? { scope: "all" } : { month: monthValue }),
        planType: plan || undefined,
        contributor: contributor || undefined,
      }
    : { from, to, planType: plan || undefined };

  const catalogQuery = useQuery({
    queryKey: ["admin-reports"],
    queryFn: adminApi.reports,
  });

  const reportQuery = useQuery({
    queryKey: ["admin-report", reportId, from, to, period, plan, contributor],
    queryFn: () => adminApi.report(reportId, range),
    enabled: rangeReady,
  });

  const setParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if ((key === "plan" || key === "contributor") && !value) next.delete(key);
      else next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const activePreset = (["this", "last", "last6"] as const).find((preset) => {
    const range = presetRange(preset);
    return range.from === from && range.to === to;
  });

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await adminApi.downloadReportPdf(reportId, range);
    } catch (err) {
      toast({
        title: LANG.admin.reportDownloadFailed,
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const report = reportQuery.data;
  const catalog = catalogQuery.data ?? [];
  const presets: { id: RangePreset; label: string }[] = [
    { id: "this", label: LANG.admin.thisMonth },
    { id: "last", label: LANG.admin.lastMonth },
    { id: "last6", label: LANG.admin.last6Months },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-xl border-b border-border/60 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{LANG.admin.reportsTitle}</h1>
              <p className="text-sm text-muted-foreground mt-1">{LANG.admin.reportsSubtitle}</p>
            </div>
            <Button onClick={handleDownload} disabled={downloading || !rangeReady || reportQuery.isError}>
              <Download className="h-4 w-4" />
              {downloading ? LANG.admin.downloadingPdf : LANG.admin.downloadPdf}
            </Button>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            {!isBusinessReport && presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setParams(presetRange(preset.id))}
                className={cn(
                  "h-9 rounded-lg border px-3 text-xs font-medium transition-colors",
                  activePreset === preset.id
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {preset.label}
              </button>
            ))}
            <label className="space-y-1">
              <span className="block text-[11px] font-medium text-muted-foreground">
                {LANG.admin.planFilter}
              </span>
              <select
                value={plan}
                onChange={(event) => setParams({ plan: event.target.value })}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">{LANG.admin.allPlans}</option>
                {(plans.data ?? []).map((option) => (
                  <option key={option.planType} value={option.planType}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            {isBusinessReport && (
              <>
                <label className="space-y-1">
                  <span className="block text-[11px] font-medium text-muted-foreground">
                    {LANG.admin.reportMonth}
                  </span>
                  <select
                    value={isAllTime ? "all" : monthPart}
                    onChange={(event) => setParams({
                      month: event.target.value === "all" ? "all" : `${yearPart}-${event.target.value}`,
                    })}
                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    <option value="all">{LANG.admin.allTime}</option>
                    {MONTH_OPTIONS.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
                {!isAllTime && (
                <label className="space-y-1">
                  <span className="block text-[11px] font-medium text-muted-foreground">
                    {LANG.admin.reportYear}
                  </span>
                  <select
                    value={yearPart}
                    onChange={(event) => setParams({ month: `${event.target.value}-${monthPart}` })}
                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    {yearOptions(Number(yearPart)).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </label>
                )}
                <label className="space-y-1">
                  <span className="block text-[11px] font-medium text-muted-foreground">
                    {LANG.admin.contributorFilter}
                  </span>
                  <select
                    value={contributor}
                    onChange={(event) => setParams({ contributor: event.target.value })}
                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    <option value="">{LANG.admin.allContributors}</option>
                    {BUSINESS_CONTRIBUTORS.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                    <option value={LEGACY_CONTRIBUTOR}>{LEGACY_CONTRIBUTOR_LABEL}</option>
                  </select>
                </label>
              </>
            )}
            {!isBusinessReport && (
              <>
                <label className="space-y-1">
                  <span className="block text-[11px] font-medium text-muted-foreground">
                    {LANG.filter.fromDate}
                  </span>
                  <input
                    type="date"
                    value={from}
                    max={to}
                    onChange={(event) => setParams({ from: event.target.value })}
                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  />
                </label>
                <label className="space-y-1">
                  <span className="block text-[11px] font-medium text-muted-foreground">
                    {LANG.filter.toDate}
                  </span>
                  <input
                    type="date"
                    value={to}
                    min={from}
                    onChange={(event) => setParams({ to: event.target.value })}
                    className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                  />
                </label>
              </>
            )}
          </div>
          {!rangeReady && !isBusinessReport && (
            <p className="text-xs text-destructive">{LANG.admin.reportDateOrder}</p>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {(catalog.length > 0 ? catalog : [{ id: reportId, title: report?.title ?? LANG.admin.reportsTitle, description: "" }]).map((item) => {
            const active = item.id === reportId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setParams({ report: item.id })}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {item.title}
              </button>
            );
          })}
        </div>

        {report?.description && (
          <p className="text-sm text-muted-foreground">{report.description}</p>
        )}

        {reportQuery.isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reportQuery.isError ? (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {LANG.admin.reportLoadFailed}
          </div>
        ) : report ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {report.summary.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="mt-1 text-lg font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-sm font-semibold mb-2">{LANG.admin.byPlan}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {report.groups?.map((group) => {
                  const selected = !!group.planType && report.planType === group.planType;
                  return (
                    <button
                      key={group.planType ?? group.label}
                      type="button"
                      disabled={!group.planType}
                      onClick={() => setParams({ plan: selected ? "" : group.planType ?? "" })}
                      className={cn(
                        "rounded-xl border bg-card p-4 text-left transition-colors",
                        selected ? "border-accent bg-accent/10" : "border-border hover:border-accent/40",
                        !group.planType && "cursor-default",
                      )}
                    >
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{group.label}</p>
                      <p className="mt-1 text-lg font-semibold">{group.count}</p>
                      <p className="text-xs text-muted-foreground">{group.amount}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {report.contributorGroups && (
              <div>
                <h2 className="text-sm font-semibold mb-2">{LANG.admin.byContributor}</h2>
                <div className="overflow-x-auto rounded-xl border border-border bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                        <th className="px-3 py-2 font-medium">Contributor</th>
                        <th className="px-3 py-2 font-medium text-right">Package Count</th>
                        <th className="px-3 py-2 font-medium text-right">Unique Members</th>
                        <th className="px-3 py-2 font-medium text-right">Business Amount</th>
                        <th className="px-3 py-2 font-medium text-right">Stopped/Cancelled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.contributorGroups.map((group) => {
                        const selected = report.contributor === group.contributor;
                        return (
                          <tr
                            key={group.contributor}
                            className={cn(
                              "cursor-pointer border-b border-border/70 last:border-0",
                              selected ? "bg-accent/10" : "hover:bg-muted/40",
                            )}
                            onClick={() => setParams({ contributor: selected ? "" : group.contributor })}
                          >
                            <td className="px-3 py-2.5 font-medium">{group.label}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums">{group.packageCount}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums">{group.uniqueMembers}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums">{group.businessAmount}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums">{group.stoppedAmount}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {report.rows.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                {LANG.admin.noReportRows}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                      {report.columns.map((column) => (
                        <th
                          key={column.key}
                          className={cn("px-3 py-2 font-medium", column.align === "right" && "text-right")}
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.rows.map((row, index) => (
                      <tr key={index} className="border-b border-border/70 last:border-0">
                        {report.columns.map((column) => (
                          <td
                            key={column.key}
                            className={cn(
                              "px-3 py-2.5 whitespace-nowrap",
                              column.align === "right" && "text-right tabular-nums",
                            )}
                          >
                            {row[column.key] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {LANG.common.showingEntries(report.rows.length)} · {report.periodLabel}
            </p>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
