import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { UserLayout } from "@/components/UserLayout";
import { AdminLayout } from "@/components/AdminLayout";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useAuth } from "@/contexts/AuthContext";
import { wallet, admin } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { StatTile } from "@/components/ui/stat-tile";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ArrowUpCircle, ArrowDownCircle, Search, Wallet,
  TrendingUp, TrendingDown, Coins
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { formatCredits, formatCreditsSigned, formatTransactionLabel } from "@/lib/format";
import { LANG, FILTER_OPTIONS, directionLabel } from "@/lib/language";
import { matchesActivityTypeFilter } from "@/lib/wallet-api-params";
import {
  filterUserVisibleTransactions,
  formatLedgerPackageLabel,
  isRoiCreditTransaction,
} from "@/lib/wallet-transactions";
import { usePlanFilterOptions } from "@/hooks/usePlanFilterOptions";

export default function WalletLedger() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [searchParams, setSearchParams] = useSearchParams();
  const packageIdFilter = searchParams.get("packageId") || "";
  const userIdFromUrl = searchParams.get("userId") || "";
  const typeFilter = searchParams.get("type") || "";
  const fromFilter = searchParams.get("from") || "";
  const toFilter = searchParams.get("to") || "";

  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(userIdFromUrl);

  const resolvedUserId = userIdFromUrl || selectedUserId;

  const filterValues = {
    type: typeFilter,
    from: fromFilter,
    to: toFilter,
    packageId: packageIdFilter,
  };

  const planOptionsQuery = usePlanFilterOptions(
    isAdmin ? resolvedUserId || undefined : undefined,
    isAdmin ? !!resolvedUserId : true,
  );
  const planOptions = planOptionsQuery.data ?? [];

  const ledgerFilterFields = useMemo<FilterField[]>(
    () => [
      {
        key: "packageId",
        label: LANG.wallet.filterByPlan,
        type: "select",
        placeholder: LANG.wallet.allPlans,
        options: planOptions,
      },
      {
        key: "type",
        label: LANG.filter.activityType,
        type: "select",
        placeholder: LANG.filter.allTypes,
        options: [...(isAdmin ? FILTER_OPTIONS.ledgerType : FILTER_OPTIONS.transactionType)],
      },
      { key: "from", label: LANG.filter.fromDate, type: "date", placeholder: LANG.filter.startDate },
      { key: "to", label: LANG.filter.toDate, type: "date", placeholder: LANG.filter.endDate },
    ],
    [isAdmin, planOptions],
  );

  const selectedPlanLabel = planOptions.find((o) => o.value === packageIdFilter)?.label;

  const setFilter = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value) next.delete(key); else next.set(key, value);
      return next;
    }, { replace: true });
  };

  const resetFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams();
      if (prev.get("userId")) next.set("userId", prev.get("userId")!);
      return next;
    }, { replace: true });
  };

  const hasActiveFilters = !!(typeFilter || fromFilter || toFilter || packageIdFilter);

  const { data: walletData, isLoading } = useQuery({
    queryKey: ["wallet", resolvedUserId, packageIdFilter, typeFilter, fromFilter, toFilter],
    queryFn: async () => {
      const filterParams = {
        type: typeFilter || undefined,
        from: fromFilter || undefined,
        to: toFilter || undefined,
        packageId: packageIdFilter || undefined,
        limit: 200,
      };
      if (isAdmin && resolvedUserId) {
        const [balance, ledger] = await Promise.all([
          admin.userWallet(resolvedUserId),
          wallet.getLedger({ ...filterParams, userId: resolvedUserId }),
        ]);
        return {
          ...ledger,
          availableBalance: balance.availableBalance,
          totalRoiCredited: balance.totalRoiCredited,
        };
      }
      return wallet.get(filterParams);
    },
    enabled: isAdmin ? !!resolvedUserId : true,
  });

  const visibleTransactions = isAdmin
    ? walletData?.transactions ?? []
    : filterUserVisibleTransactions(walletData?.transactions ?? []);

  const filteredTransactions = visibleTransactions.filter((txn) => {
    if (typeFilter && !matchesActivityTypeFilter(txn.type, typeFilter)) return false;
    return true;
  });

  const totalCredits = filteredTransactions.filter(txn => txn.direction === "CREDIT").reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
  const totalDebits = filteredTransactions.filter(txn => txn.direction === "DEBIT").reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

  const getTransactionIcon = (_type: string, direction: string) =>
    direction === "CREDIT" ? <ArrowUpCircle className="h-5 w-5 text-success" /> : <ArrowDownCircle className="h-5 w-5 text-destructive" />;

  const getTransactionColor = (direction: string) => direction === "CREDIT" ? "text-success" : "text-destructive";

  const Layout = isAdmin ? AdminLayout : UserLayout;

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          icon={<Wallet className="h-5 w-5" />}
          title={LANG.wallet.activityLedgerTitle}
          subtitle={
            selectedPlanLabel
              ? `${LANG.wallet.plan}: ${selectedPlanLabel}`
              : LANG.wallet.ledgerSubtitle
          }
        />

        {isAdmin && !userIdFromUrl && (
          <Card className="shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">{LANG.common.selectUser}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={LANG.filter.searchByUserIdPlaceholder} value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="pl-9" />
                </div>
                <Button onClick={() => setSelectedUserId(userSearch)} disabled={!userSearch.trim()} className="bg-gradient-accent text-accent-foreground shadow-glow">{LANG.common.loadActivity}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {walletData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatTile label={LANG.common.balance} value={formatCredits(walletData.availableBalance)} icon={Coins} accent="primary" />
            <StatTile label={LANG.wallet.totalCredits} value={formatCredits(totalCredits)} icon={TrendingUp} accent="success" />
            <StatTile label={LANG.wallet.totalDebits} value={formatCredits(totalDebits)} icon={TrendingDown} accent="warning" />
          </div>
        )}

        <FilterBar
          fields={ledgerFilterFields}
          values={filterValues}
          onChange={(k, v) => setFilter(k, v)}
          onReset={resetFilters}
          hasActive={hasActiveFilters}
        />

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">{LANG.wallet.activityHistory}</CardTitle>
            <p className="text-sm text-muted-foreground">{LANG.common.showingEntries(filteredTransactions.length)}</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-xl">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-3 w-1/3" /></div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <EmptyState icon={Wallet} title={LANG.wallet.noActivity} description={LANG.wallet.noEntriesFilters} />
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((txn) => (
                  <div key={txn.id} className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/30 hover:border-accent/30 transition-all">
                    <div className="flex-shrink-0">{getTransactionIcon(txn.type, txn.direction)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{formatTransactionLabel(txn.type)}</p>
                        <Badge variant={txn.direction === "CREDIT" ? "default" : "destructive"} className="text-xs">{directionLabel(txn.direction)}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{format(new Date(txn.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                      {isRoiCreditTransaction(txn) && txn.package ? (
                        <p className="text-xs text-muted-foreground mt-1">
                          {LANG.wallet.plan}: {formatLedgerPackageLabel(txn.package)}
                          {txn.roiCycleNumber != null
                            ? ` · ${LANG.wallet.planCycle(txn.roiCycleNumber)}`
                            : ""}
                        </p>
                      ) : (
                        <>
                          {txn.description && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">{txn.description}</p>
                          )}
                          {txn.referenceId && !txn.package && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {LANG.common.ref} {txn.referenceId}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={cn("font-bold text-sm", getTransactionColor(txn.direction))}>
                        {formatCreditsSigned(txn.amount, txn.direction)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
