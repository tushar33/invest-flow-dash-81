import { AdminLayout } from "@/components/AdminLayout";
import { TrendingUp } from "lucide-react";

const logs = [
  { id: 1, user: "Alex Johnson", package: "Growth Plan", amount: "+$45.00", date: "Mar 7, 2026" },
  { id: 2, user: "Sarah Williams", package: "Starter Plan", amount: "+$25.00", date: "Mar 7, 2026" },
  { id: 3, user: "Tom Baker", package: "Premium Plan", amount: "+$60.00", date: "Mar 7, 2026" },
  { id: 4, user: "Mike Chen", package: "Starter Plan", amount: "+$25.00", date: "Mar 6, 2026" },
  { id: 5, user: "Alex Johnson", package: "Growth Plan", amount: "+$45.00", date: "Mar 6, 2026" },
  { id: 6, user: "Sarah Williams", package: "Starter Plan", amount: "+$25.00", date: "Mar 5, 2026" },
  { id: 7, user: "Tom Baker", package: "Premium Plan", amount: "+$60.00", date: "Mar 5, 2026" },
];

export default function AdminROILogs() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">ROI Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Track all ROI credits</p>
        </div>

        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium">{log.user}</p>
                  <p className="text-xs text-muted-foreground">{log.package}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-success">{log.amount}</p>
                <p className="text-xs text-muted-foreground">{log.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
