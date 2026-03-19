import { AdminLayout } from "@/components/AdminLayout";
import { StatCard } from "@/components/StatCard";
import { Users, DollarSign, TrendingUp, CreditCard, Package, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { admin as adminApi } from "@/lib/api";

function formatINR(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export default function AdminDashboard() {
  const { data: summary } = useQuery({ queryKey: ["admin-summary"], queryFn: adminApi.summary });
  const { data: financial } = useQuery({ queryKey: ["admin-financial"], queryFn: adminApi.financialSummary });
  const { data: users } = useQuery({ queryKey: ["admin-users"], queryFn: adminApi.users });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">System overview</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link to="/admin/users" className="animate-fade-in" style={{ animationDelay: "0ms" }}><StatCard label="Total Users" value={String(summary?.totalUsers ?? 0)} icon={Users} /></Link>
          <Link to="/admin/packages" className="animate-fade-in" style={{ animationDelay: "60ms", animationFillMode: "both" }}><StatCard label="Total Invested" value={formatINR(financial?.totalInvestment ?? 0)} icon={DollarSign} /></Link>
          <Link to="/admin/roi-logs" className="animate-fade-in" style={{ animationDelay: "120ms", animationFillMode: "both" }}><StatCard label="ROI Generated" value={formatINR(financial?.totalRoiGenerated ?? 0)} icon={TrendingUp} /></Link>
          <Link to="/admin/payouts" className="animate-fade-in" style={{ animationDelay: "180ms", animationFillMode: "both" }}><StatCard label="Pending Payouts" value={String(summary?.totalPendingPayouts ?? 0)} icon={CreditCard} /></Link>
          <Link to="/admin/packages" className="animate-fade-in" style={{ animationDelay: "240ms", animationFillMode: "both" }}><StatCard label="Active Packages" value={String(summary?.totalActivePackages ?? 0)} icon={Package} /></Link>
          <Link to="/admin/settings" className="animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "both" }}><StatCard label="Current Liability" value={formatINR(financial?.currentLiability ?? 0)} icon={Activity} /></Link>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="text-base font-semibold mb-3">Recent Users</h2>
          <div className="divide-y divide-border">
            {(users ?? []).slice(0, 5).map((u) => (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email || "—"}</p>
                </div>
                <span className="text-xs text-muted-foreground">{u.totalPackages} pkgs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
