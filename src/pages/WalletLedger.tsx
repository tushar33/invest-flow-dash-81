import { useState } from "react";
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
import {
  ArrowUpCircle, ArrowDownCircle, Search, Wallet,
  TrendingUp, TrendingDown, DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const filterFields: FilterField[] = [
  {
    key: "type", label: "Transaction Type", type: "select", placeholder: "All Types",
    options: [
      { label: "ROI Credit", value: "ROI" },
      { label: "Payout Debit", value: "PAYOUT_DEBIT" },
      { label: "Principal", value: "PRINCIPAL" },
    ],
  },
  { key: "from", label: "From Date", type: "date", placeholder: "Start date" },
  { key: "to", label: "To Date", type: "date", placeholder: "End date" },
];

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

  const filterValues = { type: typeFilter, from: fromFilter, to: toFilter };

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
      // Keep userId/packageId
      if (prev.get("userId")) next.set("userId", prev.get("userId")!);
      if (prev.get("packageId")) next.set("packageId", prev.get("packageId")!);
      return next;
    }, { replace: true });
  };

  const hasActiveFilters = !!(typeFilter || fromFilter || toFilter);

  const { data: walletData, isLoading } = useQuery({
    queryKey: ["wallet", resolvedUserId, packageIdFilter, typeFilter, fromFilter, toFilter],
    queryFn: () => {
      const filterParams = {
        type: typeFilter || undefined,
        from: fromFilter || undefined,
        to: toFilter || undefined,
        packageId: packageIdFilter || undefined,
      };
      if (isAdmin && resolvedUserId) return admin.userWallet(resolvedUserId, filterParams);
      return wallet.get(filterParams);
    },
    enabled: isAdmin ? !!resolvedUserId : true,
  });

  const matchesTypeFilter = (txnType: string, filter: string) => {
    if (!filter) return true;
    if (filter === "ROI") return txnType === "ROI_CREDIT" || txnType === "ROI";
    if (filter === "PRINCIPAL") return txnType === "PRINCIPAL_DEBIT" || txnType === "PRINCIPAL";
    return txnType === filter;
  };

  const filteredTransactions = walletData?.transactions.filter((txn) => {
    if (typeFilter && !matchesTypeFilter(txn.type, typeFilter)) return false;
    if (fromFilter && new Date(txn.createdAt) < new Date(fromFilter)) return false;
    if (toFilter && new Date(txn.createdAt) > new Date(toFilter)) return false;
    if (packageIdFilter && txn.referenceId !== packageIdFilter) return false;
    return true;
  }) || [];

  const totalCredits = filteredTransactions.filter(txn => txn.direction === "CREDIT").reduce((sum, txn) => sum + parseFloat(txn.amount), 0);
  const totalDebits = filteredTransactions.filter(txn => txn.direction === "DEBIT").reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

  const getTransactionIcon = (_type: string, direction: string) =>
    direction === "CREDIT" ? <ArrowUpCircle className="h-5 w-5 text-success" /> : <ArrowDownCircle className="h-5 w-5 text-destructive" />;

  const getTransactionColor = (direction: string) => direction === "CREDIT" ? "text-success" : "text-destructive";
  const getTransactionSign = (direction: string) => direction === "CREDIT" ? "+" : "-";

  const formatTransactionType = (type: string) => {
    switch (type) {
      case "ROI_CREDIT": case "ROI": return "ROI Credit";
      case "PAYOUT_DEBIT": return "Payout Debit";
      case "PRINCIPAL_DEBIT": case "PRINCIPAL": return "Principal Debit";
      default: return type.replace(/_/g, " ");
    }
  };

  const Layout = isAdmin ? AdminLayout : UserLayout;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">Wallet Ledger</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {packageIdFilter ? `Transactions for package ${packageIdFilter}` : "Complete transaction history and wallet summary."}
          </p>
        </div>

        {isAdmin && !userIdFromUrl && (
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Select User</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by user ID..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="pl-9" />
                </div>
                <Button onClick={() => setSelectedUserId(userSearch)} disabled={!userSearch.trim()}>Load Wallet</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {walletData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-accent" /></div><div><p className="text-sm text-muted-foreground">Wallet Balance</p><p className="text-xl font-bold">₹{walletData.availableBalance.toLocaleString()}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-success" /></div><div><p className="text-sm text-muted-foreground">Total Credits</p><p className="text-xl font-bold text-success">₹{totalCredits.toLocaleString()}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center"><TrendingDown className="h-5 w-5 text-destructive" /></div><div><p className="text-sm text-muted-foreground">Total Debits</p><p className="text-xl font-bold text-destructive">₹{totalDebits.toLocaleString()}</p></div></div></CardContent></Card>
          </div>
        )}

        <FilterBar
          fields={filterFields}
          values={filterValues}
          onChange={(k, v) => setFilter(k, v)}
          onReset={resetFilters}
          hasActive={hasActiveFilters}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaction History</CardTitle>
            <p className="text-sm text-muted-foreground">Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-3 w-1/3" /></div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No wallet transactions found</h3>
                <p className="text-muted-foreground">No transactions match your current filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((txn) => (
                  <div key={txn.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">{getTransactionIcon(txn.type, txn.direction)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{formatTransactionType(txn.type)}</p>
                        <Badge variant={txn.direction === "CREDIT" ? "default" : "destructive"} className="text-xs">{txn.direction}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{format(new Date(txn.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                      {txn.description && <p className="text-xs text-muted-foreground mt-1 truncate">{txn.description}</p>}
                      {txn.referenceId && <p className="text-xs text-muted-foreground mt-1">Ref: {txn.referenceId}</p>}
                    </div>
                    <div className="text-right">
                      <p className={cn("font-bold text-sm", getTransactionColor(txn.direction))}>
                        {getTransactionSign(txn.direction)}₹{parseFloat(txn.amount).toLocaleString()}
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
