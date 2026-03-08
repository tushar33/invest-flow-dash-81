import { UserLayout } from "@/components/UserLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { TrendingUp, Wallet, DollarSign, Clock, ArrowUpRight, ArrowDownLeft, Bell, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const recentTransactions = [
  { id: 1, type: "ROI Credit", amount: "+$45.00", date: "Mar 7, 2026", status: "completed" as const },
  { id: 2, type: "Payout", amount: "-$200.00", date: "Mar 5, 2026", status: "pending" as const },
  { id: 3, type: "ROI Credit", amount: "+$45.00", date: "Mar 4, 2026", status: "completed" as const },
  { id: 4, type: "Investment", amount: "-$1,000.00", date: "Mar 1, 2026", status: "completed" as const },
];

export default function Dashboard() {
  return (
    <UserLayout>
      <div className="space-y-5">
        {/* Mobile Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Good morning</p>
            <h1 className="text-xl font-bold mt-0.5">Alex Johnson 👋</h1>
          </div>
          <button className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center relative">
            <Bell className="h-4.5 w-4.5 text-muted-foreground" />
            <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
          </button>
        </div>

        {/* Hero Balance Card */}
        <div className="fintech-gradient rounded-2xl p-5 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-6 -translate-x-6" />
          <div className="relative">
            <p className="text-xs uppercase tracking-widest opacity-70 font-medium">Total Portfolio</p>
            <p className="text-[32px] font-bold mt-1 leading-tight">$12,450.00</p>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-1 bg-accent/20 rounded-full px-2 py-0.5">
                <TrendingUp className="h-3 w-3 text-accent" />
                <span className="text-[11px] text-accent font-semibold">+12.5%</span>
              </div>
              <span className="text-[11px] opacity-60">this month</span>
            </div>
          </div>
        </div>

        {/* Stat Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Invested" value="$10,000" icon={DollarSign} trend="+2 packages" trendUp />
          <StatCard label="ROI Earned" value="$2,450" icon={TrendingUp} trend="+$450/wk" trendUp />
          <StatCard label="Wallet" value="$1,250" icon={Wallet} />
          <StatCard label="Pending" value="$200" icon={Clock} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Link to="/packages" className="bg-card rounded-xl border border-border p-3 flex flex-col items-center gap-1.5 hover:border-accent/30 transition-colors">
            <div className="h-9 w-9 rounded-xl accent-gradient flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="text-[11px] font-semibold">Invest</span>
          </Link>
          <Link to="/wallet" className="bg-card rounded-xl border border-border p-3 flex flex-col items-center gap-1.5 hover:border-accent/30 transition-colors">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <span className="text-[11px] font-semibold">Deposit</span>
          </Link>
          <Link to="/payouts" className="bg-card rounded-xl border border-border p-3 flex flex-col items-center gap-1.5 hover:border-accent/30 transition-colors">
            <div className="h-9 w-9 rounded-xl bg-success/10 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-success" />
            </div>
            <span className="text-[11px] font-semibold">Withdraw</span>
          </Link>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Recent Activity</h2>
            <Link to="/wallet" className="text-xs text-accent font-medium flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {recentTransactions.map((tx, i) => (
              <div key={tx.id} className={`flex items-center justify-between p-3.5 ${i < recentTransactions.length - 1 ? "border-b border-border/50" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${tx.amount.startsWith("+") ? "bg-success/10" : "bg-muted"}`}>
                    {tx.amount.startsWith("+") ? (
                      <ArrowDownLeft className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold">{tx.type}</p>
                    <p className="text-[11px] text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[13px] font-bold ${tx.amount.startsWith("+") ? "text-success" : "text-foreground"}`}>
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
