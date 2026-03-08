import { UserLayout } from "@/components/UserLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Wallet, DollarSign, TrendingUp, Clock, ArrowDownLeft, ArrowUpRight, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const recentTransactions = [
  { id: 1, type: "ROI Credit", desc: "Growth Package", amount: "+₹3,750", date: "Mar 7, 2026" },
  { id: 2, type: "Payout Debit", desc: "Bank withdrawal", amount: "-₹15,000", date: "Mar 5, 2026" },
  { id: 3, type: "ROI Credit", desc: "Growth Package", amount: "+₹3,750", date: "Mar 4, 2026" },
  { id: 4, type: "ROI Credit", desc: "Starter Package", amount: "+₹1,250", date: "Mar 3, 2026" },
];

export default function Dashboard() {
  const payoutReady = true; // bank details added

  return (
    <UserLayout>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <p className="text-sm text-muted-foreground">Good morning</p>
          <h1 className="text-xl font-bold mt-0.5">Rahul Sharma 👋</h1>
        </div>

        {/* Wallet Balance Hero */}
        <div className="fintech-gradient rounded-2xl p-5 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-6 -translate-x-6" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-accent" />
              <span className="text-[11px] uppercase tracking-widest opacity-70 font-medium">Wallet Balance</span>
            </div>
            <p className="text-[32px] font-bold leading-tight">₹24,500</p>
            <Link to="/payouts" className="inline-flex items-center gap-1 mt-2 text-[11px] text-accent font-semibold bg-accent/15 rounded-full px-2.5 py-1">
              Request Payout <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Stat Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Investment" value="₹2,00,000" icon={DollarSign} />
          <StatCard label="Total ROI Earned" value="₹48,500" icon={TrendingUp} trend="+₹5,000 this week" trendUp />
          <StatCard label="Pending Payout" value="₹15,000" icon={Clock} />
          <StatCard label="Active Packages" value="2" icon={DollarSign} />
        </div>

        {/* Payout Readiness */}
        <div className={`rounded-2xl p-4 flex items-center gap-3 ${payoutReady ? "bg-success/10 border border-success/20" : "bg-warning/10 border border-warning/20"}`}>
          {payoutReady ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-success">Payout Ready</p>
                <p className="text-[11px] text-muted-foreground">Bank details verified. You can request payouts.</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-warning shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-warning">Setup Required</p>
                <p className="text-[11px] text-muted-foreground">Add bank details to enable payouts.</p>
              </div>
              <Link to="/bank-details" className="ml-auto text-[11px] font-semibold text-accent">
                Add Now
              </Link>
            </>
          )}
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Recent Transactions</h2>
            <Link to="/wallet" className="text-[11px] text-accent font-semibold flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {recentTransactions.map((tx, i) => {
              const isCredit = tx.type === "ROI Credit";
              return (
                <div key={tx.id} className={`flex items-center justify-between p-3.5 ${i < recentTransactions.length - 1 ? "border-b border-border/50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${isCredit ? "bg-success/10" : "bg-muted"}`}>
                      {isCredit ? (
                        <ArrowDownLeft className="h-4 w-4 text-success" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold">{tx.type}</p>
                      <p className="text-[11px] text-muted-foreground">{tx.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[13px] font-bold ${isCredit ? "text-success" : "text-foreground"}`}>
                      {tx.amount}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
