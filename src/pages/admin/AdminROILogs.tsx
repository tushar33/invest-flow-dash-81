import { AdminLayout } from "@/components/AdminLayout";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { Gift, Zap } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admin as adminApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatCredits } from "@/lib/format";

const filterDefaults = { runType: "", status: "", from: "", to: "" };

const filterFields: FilterField[] = [
  {
    key: "runType", label: "Run Type", type: "select", placeholder: "All",
    options: [{ label: "Manual", value: "MANUAL" }, { label: "Cron", value: "CRON" }],
  },
  {
    key: "status", label: "Status", type: "select", placeholder: "All",
    options: [{ label: "Success", value: "SUCCESS" }, { label: "Failed", value: "FAILED" }],
  },
  { key: "from", label: "From Date", type: "date", placeholder: "Start date" },
  { key: "to", label: "To Date", type: "date", placeholder: "End date" },
];

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
      toast({ title: "Rewards Processed", description: data.message });
      qc.invalidateQueries({ queryKey: ["admin-roi-logs"] });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  // Handle both array and paginated response
  const logItems: any[] = Array.isArray(logs) ? logs : (logs?.data ?? logs?.logs ?? []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-xl border-b border-border/60 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Reward Logs</h1>
            <p className="text-sm text-muted-foreground mt-1">Track reward cycles & trigger processing</p>
          </div>
          <button onClick={() => triggerMutation.mutate()} disabled={triggerMutation.isPending}
            className="accent-gradient text-accent-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 disabled:opacity-50">
            <Zap className="h-4 w-4" />
            {triggerMutation.isPending ? "Processing..." : "Process Rewards"}
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
          <p className="text-center text-muted-foreground py-12">No reward logs found</p>
        ) : (
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {logItems.map((item: any, idx: number) => (
              <div key={item.id ?? item.packageId ?? idx} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Gift className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.userName ?? item.runType ?? "Reward Run"}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.principalAmount ? `${formatCredits(Number(item.principalAmount))} · ${item.roiPercentage}%` : item.status ?? ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {item.cyclesCompleted !== undefined
                      ? `${item.cyclesCompleted}/${item.totalCycles ?? item.durationMonths ?? 1} cycles`
                      : item.processedCount ?? ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.status ?? ""}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
