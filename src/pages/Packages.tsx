import { UserLayout } from "@/components/UserLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { TrendingUp, Clock, CalendarDays, RefreshCw } from "lucide-react";

const assignedPackages = [
  {
    id: 1,
    amount: "₹1,00,000",
    roiPercent: "5%",
    roiAmount: "₹5,000",
    assignedDate: "Jan 15, 2026",
    nextROIDate: "Mar 15, 2026",
    cyclesCompleted: 4,
    totalCycles: 12,
    status: "active" as const,
  },
  {
    id: 2,
    amount: "₹1,00,000",
    roiPercent: "3.75%",
    roiAmount: "₹3,750",
    assignedDate: "Feb 1, 2026",
    nextROIDate: "Mar 8, 2026",
    cyclesCompleted: 2,
    totalCycles: 12,
    status: "active" as const,
  },
  {
    id: 3,
    amount: "₹50,000",
    roiPercent: "4%",
    roiAmount: "₹2,000",
    assignedDate: "Sep 10, 2025",
    nextROIDate: "—",
    cyclesCompleted: 12,
    totalCycles: 12,
    status: "completed" as const,
  },
];

export default function Packages() {
  return (
    <UserLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">My Packages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Assigned by administrator</p>
        </div>

        {/* Summary */}
        <div className="fintech-gradient rounded-2xl p-4 text-primary-foreground">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest opacity-70">Total Invested</p>
              <p className="text-xl font-bold mt-0.5">₹2,50,000</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest opacity-70">Active Packages</p>
              <p className="text-xl font-bold mt-0.5 text-accent">2</p>
            </div>
          </div>
        </div>

        {/* Package Cards */}
        <div className="space-y-3">
          {assignedPackages.map((pkg) => (
            <div key={pkg.id} className="bg-card rounded-2xl border border-border p-4 animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xl font-bold">{pkg.amount}</p>
                <StatusBadge status={pkg.status}>{pkg.status}</StatusBadge>
              </div>

              {/* ROI Info */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-[11px] bg-accent/10 text-accent font-semibold rounded-lg px-2.5 py-1.5">
                  <TrendingUp className="h-3 w-3" />
                  {pkg.roiPercent} ROI · {pkg.roiAmount}/cycle
                </div>
              </div>

              {/* Progress bar */}
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

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <CalendarDays className="h-3 w-3 shrink-0" />
                  <div>
                    <p className="text-[10px] opacity-70">Assigned</p>
                    <p className="font-medium text-foreground">{pkg.assignedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <RefreshCw className="h-3 w-3 shrink-0" />
                  <div>
                    <p className="text-[10px] opacity-70">Next ROI</p>
                    <p className="font-medium text-foreground">{pkg.nextROIDate}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
