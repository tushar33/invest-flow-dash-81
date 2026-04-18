import { UserLayout } from "@/components/UserLayout";
import { StatCard } from "@/components/StatCard";
import { AutoPayModeBadge } from "@/components/AutoPayModeBadge";
import { Wallet, Gift, TrendingUp, Clock, ArrowDownLeft, ArrowUpRight, ChevronRight, CheckCircle2, AlertCircle, Zap, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { wallet as walletApi, packages as packagesApi, payouts as payoutsApi, bankDetails as bankApi } from "@/lib/api";
import { formatCredits, formatCreditsSigned, formatTransactionLabel } from "@/lib/format";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: walletData } = useQuery({ queryKey: ["wallet"], queryFn: () => walletApi.get() });
  const { data: pkgs } = useQuery({ queryKey: ["packages"], queryFn: () => packagesApi.list() });
  const { data: payoutsList } = useQuery({ queryKey: ["payouts"], queryFn: () => payoutsApi.list() });
  const { data: bank } = useQuery({ queryKey: ["bank-details"], queryFn: bankApi.get });

  const balance = walletData?.availableBalance ?? 0;
  const totalContribution = pkgs?.reduce((s, p) => s + Number(p.principalAmount), 0) ?? 0;
  const totalRewards =
    walletData != null && typeof walletData.totalRoiCredited === "number"
      ? walletData.totalRoiCredited
      : (walletData?.transactions
          ?.filter(
            (t) =>
              t.direction === "CREDIT" &&
              (t.type === "ROI_CREDIT" || t.type === "ROI"),
          )
          .reduce((s, t) => s + Number(t.amount), 0) ?? 0);
  const pendingRedemption = payoutsList?.filter(p => p.status === "PENDING")
    .reduce((s, p) => s + Number(p.amount), 0) ?? 0;
  const activePlans = pkgs?.filter(p => p.status === "ACTIVE").length ?? 0;
  const redemptionReady = !!bank;
  const recentTx = walletData?.transactions?.slice(0, 4) ?? [];

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <UserLayout>
      <div className="space-y-5">
        <div>
          <p className="text-sm text-muted-foreground">{greeting}</p>
          <h1 className="text-xl font-bold mt-0.5">{user?.fullName ?? "User"} 👋</h1>
        </div>

        <div className="fintech-gradient rounded-2xl p-5 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-6 -translate-x-6" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-accent" />
              <span className="text-[11px] uppercase tracking-widest opacity-70 font-medium">Balance</span>
            </div>
            <p className="text-[32px] font-bold leading-tight">{formatCredits(balance)}</p>
            <Link to="/payouts" className="inline-flex items-center gap-1 mt-2 text-[11px] text-accent font-semibold bg-accent/15 rounded-full px-2.5 py-1">
              Request Redemption <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Contribution" value={formatCredits(totalContribution)} icon={Package} />
          <StatCard label="Total Rewards" value={formatCredits(totalRewards)} icon={Gift} />
          <StatCard label="Pending Redemption" value={formatCredits(pendingRedemption)} icon={Clock} />
          <StatCard label="Active Plans" value={String(activePlans)} icon={TrendingUp} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Auto Redemption Mode</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <AutoPayModeBadge mode={user?.autoPayMode ?? "NONE"} className="text-xs" />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            If enabled, reward credits will automatically generate redemption requests.
          </p>
        </div>

        <div className={`rounded-2xl p-4 flex items-center gap-3 ${redemptionReady ? "bg-success/10 border border-success/20" : "bg-warning/10 border border-warning/20"}`}>
          {redemptionReady ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-success">Redemption Ready</p>
                <p className="text-[11px] text-muted-foreground">Account details verified. You can request redemptions.</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-warning shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-warning">Setup Required</p>
                <p className="text-[11px] text-muted-foreground">Add account details to enable redemptions.</p>
              </div>
              <Link to="/bank-details" className="ml-auto text-[11px] font-semibold text-accent">Add Now</Link>
            </>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Recent Activity</h2>
            <Link to="/wallet" className="text-[11px] text-accent font-semibold flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {recentTx.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
            ) : recentTx.map((tx, i) => {
              const isCredit = tx.direction === "CREDIT";
              return (
                <div key={tx.id} className={`flex items-center justify-between p-3.5 ${i < recentTx.length - 1 ? "border-b border-border/50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${isCredit ? "bg-success/10" : "bg-muted"}`}>
                      {isCredit ? <ArrowDownLeft className="h-4 w-4 text-success" /> : <ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold">{formatTransactionLabel(tx.type)}</p>
                      <p className="text-[11px] text-muted-foreground">{tx.description || ""}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[13px] font-bold ${isCredit ? "text-success" : "text-foreground"}`}>
                      {formatCreditsSigned(tx.amount, tx.direction)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</p>
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
