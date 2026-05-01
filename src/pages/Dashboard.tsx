import { UserLayout } from "@/components/UserLayout";
import { GradientCard } from "@/components/ui/gradient-card";
import { StatTile } from "@/components/ui/stat-tile";
import { EmptyState } from "@/components/ui/empty-state";
import { AutoPayModeBadge } from "@/components/AutoPayModeBadge";
import { Wallet, Gift, TrendingUp, Clock, ArrowDownLeft, ArrowUpRight, ChevronRight, CheckCircle2, AlertCircle, Zap, Package, Activity } from "lucide-react";
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
      <div className="space-y-6">
        <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-xl border-b border-border/60 animate-slide-up-fade">
          <p className="text-sm text-muted-foreground">{greeting}</p>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">{user?.fullName ?? "User"} <span className="inline-block">👋</span></h1>
        </div>

        <GradientCard variant="hero" glow className="animate-slide-up-fade">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-7 w-7 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
              <Wallet className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-[11px] uppercase tracking-widest opacity-80 font-semibold">Available Balance</span>
          </div>
          <p className="text-[36px] font-bold leading-tight tabular-nums">{formatCredits(balance)}</p>
          <Link to="/payouts" className="inline-flex items-center gap-1 mt-3 text-[12px] text-accent-foreground font-semibold bg-accent/90 hover:bg-accent rounded-full px-3 py-1.5 transition-colors shadow-glow">
            Request Redemption <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </GradientCard>

        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Total Contribution" value={formatCredits(totalContribution)} icon={Package} accent="primary" />
          <StatTile label="Total Rewards" value={formatCredits(totalRewards)} icon={Gift} accent="success" />
          <StatTile label="Pending Redemption" value={formatCredits(pendingRedemption)} icon={Clock} accent="warning" />
          <StatTile label="Active Plans" value={String(activePlans)} icon={TrendingUp} accent="info" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-card hover:shadow-elevated transition-shadow animate-slide-up-fade">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-lg bg-accent/10 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Auto Redemption Mode</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <AutoPayModeBadge mode={user?.autoPayMode ?? "NONE"} className="text-xs" />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            If enabled, reward credits will automatically generate redemption requests.
          </p>
        </div>

        <div className={`rounded-2xl p-4 flex items-center gap-3 border animate-slide-up-fade ${redemptionReady ? "bg-success/10 border-success/20" : "bg-warning/10 border-warning/20"}`}>
          {redemptionReady ? (
            <>
              <div className="h-9 w-9 shrink-0 rounded-xl bg-success/15 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-success">Redemption Ready</p>
                <p className="text-[11px] text-muted-foreground">Account details verified. You can request redemptions.</p>
              </div>
            </>
          ) : (
            <>
              <div className="h-9 w-9 shrink-0 rounded-xl bg-warning/15 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-warning">Setup Required</p>
                <p className="text-[11px] text-muted-foreground">Add account details to enable redemptions.</p>
              </div>
              <Link to="/bank-details" className="text-[11px] font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-full hover:bg-accent/20 transition-colors">Add Now</Link>
            </>
          )}
        </div>

        <div className="animate-slide-up-fade">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold tracking-tight">Recent Activity</h2>
            <Link to="/wallet" className="text-[11px] text-accent font-semibold flex items-center gap-0.5 hover:gap-1 transition-all">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
            {recentTx.length === 0 ? (
              <EmptyState icon={Activity} title="No activity yet" description="Your reward credits and redemptions will appear here." />
            ) : recentTx.map((tx, i) => {
              const isCredit = tx.direction === "CREDIT";
              return (
                <div key={tx.id} className={`flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors ${i < recentTx.length - 1 ? "border-b border-border/50" : ""}`}>
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
                    <p className={`text-[13px] font-bold tabular-nums ${isCredit ? "text-success" : "text-foreground"}`}>
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
