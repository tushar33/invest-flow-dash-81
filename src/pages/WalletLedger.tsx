import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { UserLayout } from "@/components/UserLayout";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { wallet, admin } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Filter,
  Calendar as CalendarIcon,
  Search,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function WalletLedger() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [searchParams] = useSearchParams();
  const packageIdFilter = searchParams.get("packageId");
  const userIdFromUrl = searchParams.get("userId");

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>(userIdFromUrl || "");

  const resolvedUserId = userIdFromUrl || selectedUserId;

  const { data: walletData, isLoading } = useQuery({
    queryKey: ["wallet", resolvedUserId, packageIdFilter],
    queryFn: () => {
      if (isAdmin && resolvedUserId) return admin.userWallet(resolvedUserId);
      return wallet.get();
    },
    enabled: isAdmin ? !!resolvedUserId : true,
  });

  const filteredTransactions = walletData?.transactions.filter((txn) => {
    if (typeFilter !== "all" && txn.type !== typeFilter) return false;
    if (fromDate && new Date(txn.createdAt) < fromDate) return false;
    if (toDate && new Date(txn.createdAt) > toDate) return false;
    if (packageIdFilter && txn.referenceId !== packageIdFilter) return false;
    return true;
  }) || [];

  const totalCredits = filteredTransactions
    .filter(txn => txn.direction === "CREDIT")
    .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

  const totalDebits = filteredTransactions
    .filter(txn => txn.direction === "DEBIT")
    .reduce((sum, txn) => sum + parseFloat(txn.amount), 0);

  const getTransactionIcon = (_type: string, direction: string) => {
    return direction === "CREDIT"
      ? <ArrowUpCircle className="h-5 w-5 text-success" />
      : <ArrowDownCircle className="h-5 w-5 text-destructive" />;
  };

  const getTransactionColor = (direction: string) =>
    direction === "CREDIT" ? "text-success" : "text-destructive";

  const getTransactionSign = (direction: string) =>
    direction === "CREDIT" ? "+" : "-";

  const formatTransactionType = (type: string) => {
    switch (type) {
      case "ROI_CREDIT": return "ROI Credit";
      case "PAYOUT_DEBIT": return "Payout Debit";
      case "PRINCIPAL_DEBIT": return "Principal Debit";
      default: return type;
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
            {packageIdFilter
              ? `Showing transactions for package ${packageIdFilter}`
              : "Complete transaction history and wallet summary."}
          </p>
        </div>

        {isAdmin && !userIdFromUrl && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select User</CardTitle>
            </CardHeader>
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

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-accent" />
              <CardTitle className="text-base">Filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Transaction Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ROI_CREDIT">ROI Credit</SelectItem>
                    <SelectItem value="PAYOUT_DEBIT">Payout Debit</SelectItem>
                    <SelectItem value="PRINCIPAL_DEBIT">Principal Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">From Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="mt-1 w-full justify-start text-left font-normal">
                      <CalendarIcon className="h-4 w-4" />
                      {fromDate ? format(fromDate, "MMM d, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={fromDate} onSelect={setFromDate} className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium">To Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="mt-1 w-full justify-start text-left font-normal">
                      <CalendarIcon className="h-4 w-4" />
                      {toDate ? format(toDate, "MMM d, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={toDate} onSelect={setToDate} className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {(typeFilter !== "all" || fromDate || toDate || packageIdFilter) && (
              <div className="flex gap-2 mt-3 pt-3 border-t">
                <Button variant="outline" size="sm" onClick={() => { setTypeFilter("all"); setFromDate(undefined); setToDate(undefined); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

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
