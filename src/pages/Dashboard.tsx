import { UserLayout } from "@/components/UserLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { TrendingUp, Wallet, DollarSign, Clock, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const recentTransactions = [
  { id: 1, type: "ROI Credit", amount: "+$45.00", date: "Mar 7, 2026", status: "completed" as const },
  { id: 2, type: "Payout", amount: "-$200.00", date: "Mar 5, 2026", status: "pending" as const },
  { id: 3, type: "ROI Credit", amount: "+$45.00", date: "Mar 4, 2026", status: "completed" as const },
  { id: 4, type: "Investment", amount: "-$1,000.00", date: "Mar 1, 2026", status: "completed" as const },
];

export default function Dashboard() {
  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Alex 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Here's your investment overview</p>
        </div>

        {/* Hero Card */}
        <div className="fintech-gradient rounded-xl p-5 text-primary-foreground">
          <p className="text-xs uppercase tracking-wider opacity-80">Total Portfolio Value</p>
          <p className="text-3xl font-bold mt-1">$12,450.00</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-accent" />
            <span className="text-xs text-accent font-medium">+12.5% this month</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Invested" value="$10,000" icon={DollarSign} trend="+2 packages" trendUp />
          <StatCard label="ROI Earned" value="$2,450" icon={TrendingUp} trend="+$450 this week" trendUp />
          <StatCard label="Wallet" value="$1,250" icon={Wallet} />
          <StatCard label="Pending" value="$200" icon={Clock} />
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-base font-semibold mb-3">Recent Activity</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.amount.startsWith("+") ? "bg-success/10" : "bg-muted"}`}>
                    {tx.amount.startsWith("+") ? (
                      <ArrowDownLeft className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.type}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.amount.startsWith("+") ? "text-success" : "text-foreground"}`}>
                    {tx.amount}
                  </p>
                  <StatusBadge status={tx.status}>{tx.status}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
