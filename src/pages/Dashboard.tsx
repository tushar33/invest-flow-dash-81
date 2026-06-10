import { UserLayout } from "@/components/UserLayout";
import { GradientCard } from "@/components/ui/gradient-card";
import { StatTile } from "@/components/ui/stat-tile";
import { EmptyState } from "@/components/ui/empty-state";
import { Wallet, Gift, TrendingUp, Clock, ArrowDownLeft, ArrowUpRight, ChevronRight, CheckCircle2, AlertCircle, Package, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { wallet as walletApi, packages as packagesApi, payouts as payoutsApi, bankDetailsQueryOptions } from "@/lib/api";
import { isBankVerifiedForUser } from "@/lib/onboarding";
import { formatCredits, formatCreditsSigned, formatTransactionLabel } from "@/lib/format";
import { LANG, greeting } from "@/lib/language";
import { NoCreditsToRedeem } from "@/components/NoCreditsToRedeem";
import { filterUserVisibleTransactions } from "@/lib/wallet-transactions";

export default function Dashboard() {
  const { user } = useAuth();
  const walletQuery = useQuery({ queryKey: ["wallet"], queryFn: () => walletApi.get() });
  const packagesQuery = useQuery({ queryKey: ["packages"], queryFn: () => packagesApi.list() });
  const payoutsQuery = useQuery({ queryKey: ["payouts"], queryFn: () => payoutsApi.list() });
  const bankQuery = useQuery(bankDetailsQueryOptions(user?.id));

  const { data: walletData } = walletQuery;
  const { data: pkgs } = packagesQuery;
  const { data: payoutsList } = payoutsQuery;
  const { data: bank } = bankQuery;

  const isLoading =
    walletQuery.isLoading || packagesQuery.isLoading || payoutsQuery.isLoading || bankQuery.isLoading;
  const isError =
    walletQuery.isError || packagesQuery.isError || payoutsQuery.isError || bankQuery.isError;
  const error =
    walletQuery.error ?? packagesQuery.error ?? payoutsQuery.error ?? bankQuery.error;

  const refetchAll = () => {
    void walletQuery.refetch();
    void packagesQuery.refetch();
    void payoutsQuery.refetch();
    void bankQuery.refetch();
  };

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
  const activePlansAmount = pkgs?.filter(p => p.status === "ACTIVE")
    .reduce((s, p) => s + Number(p.principalAmount), 0) ?? 0;
  const bankVerified = isBankVerifiedForUser(bank);
  const redemptionReady = bankVerified;
  const canRequestRedemption = balance > 0;
  const recentTx = filterUserVisibleTransactions(walletData?.transactions ?? []).slice(0, 4);

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center py-24">
          <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </UserLayout>
    );
  }

  if (isError) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : LANG.dashboard.loadFailed}
          </p>
          <Button variant="outline" size="sm" onClick={refetchAll}>
            {LANG.common.retry}
          </Button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-4">
        <div className="sticky top-0 z-30 -mx-4 px-4 pb-4 bg-background/85 backdrop-blur-xl border-b border-border/60 space-y-4">
          <div className="pt-3 animate-slide-up-fade">
            <p className="text-sm text-muted-foreground">{greeting()}</p>
            <h1 className="text-2xl font-bold tracking-tight mt-0.5">{user?.fullName ?? LANG.dashboard.fallbackName} <span className="inline-block">👋</span></h1>
          </div>

          <GradientCard variant="hero" glow className="animate-slide-up-fade">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-7 w-7 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
              <Wallet className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-[11px] uppercase tracking-widest opacity-80 font-semibold">{LANG.dashboard.availableBalance}</span>
          </div>
          <p className="text-[36px] font-bold leading-tight tabular-nums">{formatCredits(balance)}</p>
          {canRequestRedemption ? (
            <Link to="/payouts" className="inline-flex items-center gap-1 mt-3 text-[12px] text-accent-foreground font-semibold bg-accent/90 hover:bg-accent rounded-full px-3 py-1.5 transition-colors shadow-glow">
              {LANG.dashboard.requestRedemption} <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <NoCreditsToRedeem variant="compact" />
          )}
        </GradientCard>

        <div className="grid grid-cols-2 gap-3">
          <StatTile label={LANG.dashboard.totalContribution} value={formatCredits(totalContribution)} icon={Package} accent="primary" />
          <StatTile label={LANG.dashboard.totalRewards} value={formatCredits(totalRewards)} icon={Gift} accent="success" />
          <StatTile label={LANG.dashboard.pendingRedemption} value={formatCredits(pendingRedemption)} icon={Clock} accent="warning" />
          <StatTile label={LANG.dashboard.activePlans} value={formatCredits(activePlansAmount)} icon={TrendingUp} accent="info" />
        </div>

        <div className={`rounded-2xl p-4 flex items-center gap-3 border animate-slide-up-fade ${redemptionReady && canRequestRedemption ? "bg-success/10 border-success/20" : !canRequestRedemption && redemptionReady ? "bg-muted/50 border-border" : "bg-warning/10 border-warning/20"}`}>
          {redemptionReady && canRequestRedemption ? (
            <>
              <div className="h-9 w-9 shrink-0 rounded-xl bg-success/15 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-success">{LANG.status.redemptionReady}</p>
                <p className="text-[11px] text-muted-foreground">{LANG.dashboard.redemptionReadyDescription}</p>
              </div>
            </>
          ) : redemptionReady && !canRequestRedemption ? (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-foreground">{LANG.dashboard.noCreditsToRedeem}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{LANG.dashboard.noCreditsToRedeemHint}</p>
            </div>
          ) : (
            <>
              <div className="h-9 w-9 shrink-0 rounded-xl bg-warning/15 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-warning">
                  {bank
                    ? bank.verificationStatus?.toLowerCase() === "rejected"
                      ? LANG.status.verificationRejected
                      : LANG.status.verificationPending
                    : LANG.status.setupRequired}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {bank
                    ? bank.verificationStatus?.toLowerCase() === "rejected"
                      ? LANG.dashboard.updateDetailsPrompt
                      : LANG.dashboard.underReviewPrompt
                    : LANG.dashboard.addDetailsPrompt}
                </p>
              </div>
              <Link to="/bank-details" className="text-[11px] font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-full hover:bg-accent/20 transition-colors">
                {bank ? LANG.dashboard.viewDetails : LANG.dashboard.addNow}
              </Link>
            </>
          )}
        </div>

          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight">{LANG.dashboard.recentActivity}</h2>
            <Link to="/wallet" className="text-[11px] text-accent font-semibold flex items-center gap-0.5 hover:gap-1 transition-all">
              {LANG.common.viewAll} <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="animate-slide-up-fade">
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
            {recentTx.length === 0 ? (
              <EmptyState icon={Activity} title={LANG.dashboard.noActivityYet} description={LANG.dashboard.noActivityDescription} />
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
