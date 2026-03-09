import { AdminLayout } from "@/components/AdminLayout";
import { TrendingUp, Zap } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admin as adminApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AdminROILogs() {
  const { toast } = useToast();
  const qc = useQueryClient();

  // We show packages with their ROI cycle info
  const { data: pkgs, isLoading } = useQuery({ queryKey: ["admin-packages"], queryFn: adminApi.packages });

  const triggerMutation = useMutation({
    mutationFn: adminApi.triggerRoi,
    onSuccess: (data) => {
      toast({ title: "ROI Processed", description: data.message });
      qc.invalidateQueries({ queryKey: ["admin-packages"] });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ROI Logs</h1>
            <p className="text-sm text-muted-foreground mt-1">Track ROI cycles & trigger processing</p>
          </div>
          <button onClick={() => triggerMutation.mutate()} disabled={triggerMutation.isPending}
            className="accent-gradient text-accent-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 disabled:opacity-50">
            <Zap className="h-4 w-4" />
            {triggerMutation.isPending ? "Processing..." : "Process ROI"}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {(pkgs ?? []).map((pkg) => (
              <div key={pkg.packageId} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{pkg.userName}</p>
                    <p className="text-xs text-muted-foreground">₹{pkg.principalAmount.toLocaleString("en-IN")} · {pkg.roiPercentage}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{pkg.cyclesCompleted}/{pkg.totalCycles} cycles</p>
                  <p className="text-xs text-muted-foreground">{pkg.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
