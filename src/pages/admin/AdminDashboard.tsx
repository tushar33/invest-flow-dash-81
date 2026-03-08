import { AdminLayout } from "@/components/AdminLayout";
import { StatCard } from "@/components/StatCard";
import { Users, DollarSign, TrendingUp, CreditCard, Package, Activity } from "lucide-react";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">System overview</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Total Users" value="1,248" icon={Users} trend="+32 this week" trendUp />
          <StatCard label="Total Invested" value="$2.4M" icon={DollarSign} trend="+$120K" trendUp />
          <StatCard label="ROI Paid" value="$340K" icon={TrendingUp} />
          <StatCard label="Pending Payouts" value="$18.5K" icon={CreditCard} />
          <StatCard label="Active Packages" value="4" icon={Package} />
          <StatCard label="Active Plans" value="892" icon={Activity} trend="71% of users" trendUp />
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="text-base font-semibold mb-3">Recent Signups</h2>
          <div className="divide-y divide-border">
            {[
              { name: "Sarah Williams", email: "sarah@mail.com", date: "Mar 7" },
              { name: "Mike Chen", email: "mike@mail.com", date: "Mar 7" },
              { name: "Lisa Park", email: "lisa@mail.com", date: "Mar 6" },
              { name: "Tom Baker", email: "tom@mail.com", date: "Mar 6" },
            ].map((u) => (
              <div key={u.email} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">{u.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
