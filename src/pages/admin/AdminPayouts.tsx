import { AdminLayout } from "@/components/AdminLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admin as adminApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { formatCredits } from "@/lib/format";
import type { PayoutBankAccount, PayoutRequest } from "@/lib/api";
import {
  LANG,
  FILTER_OPTIONS,
  accountTypeLabel,
  payoutSourceLabel,
  payoutStatusBadge,
  payoutStatusLabel,
  normalizePayoutStatus,
  requestTypeLabel,
} from "@/lib/language";

const filterDefaults = { status: "", sourceType: "", from: "", to: "" };

function defaultBank(user: PayoutRequest["user"]): PayoutBankAccount | null {
  return user?.bankAccounts?.[0] ?? null;
}

function maskAccountNo(accountNo: string): string {
  const tail = accountNo.length >= 4 ? accountNo.slice(-4) : accountNo;
  return `****${tail}`;
}

const filterFields: FilterField[] = [
  {
    key: "status", label: LANG.common.status, type: "select", placeholder: LANG.common.all,
    options: [...FILTER_OPTIONS.payoutStatus],
  },
  {
    key: "sourceType", label: LANG.filter.sourceType, type: "select", placeholder: LANG.common.all,
    options: [...FILTER_OPTIONS.payoutSourceType],
  },
  { key: "from", label: LANG.filter.fromDate, type: "date", placeholder: LANG.filter.startDate },
  { key: "to", label: LANG.filter.toDate, type: "date", placeholder: LANG.filter.endDate },
];

export default function AdminPayouts() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useUrlFilters(filterDefaults);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: payoutsList, isLoading } = useQuery({
    queryKey: ["admin-payouts", filters],
    queryFn: () => adminApi.payoutsAll({
      status: filters.status || undefined,
      sourceType: filters.sourceType || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
      limit: 100,
    }),
  });

  const { data: usersList } = useQuery({
    queryKey: ["admin-users-for-payouts"],
    queryFn: () => adminApi.users({ limit: 1000 }),
  });

  const usernameByUserId = new Map<string, string>();
  (usersList ?? []).forEach((u) => {
    if (u.username) usernameByUserId.set(u.id, u.username);
  });

  const processMutation = useMutation({
    mutationFn: ({ id, status, rejectionReason }: { id: string; status: string; rejectionReason?: string }) =>
      adminApi.processPayout(id, { status, rejectionReason }),
    onSuccess: () => {
      toast({ title: LANG.redemption.processed });
      qc.invalidateQueries({ queryKey: ["admin-payouts"] });
      setRejectingId(null);
      setRejectReason("");
    },
    onError: (err: any) => toast({ title: LANG.common.error, description: err.message, variant: "destructive" }),
  });

  const STATUS_ORDER: Record<string, number> = {
    PENDING: 0,
    PROCESSED: 1,
    REJECTED: 2,
  };

  const filtered = (payoutsList ?? [])
    .filter(p => {
      if (filters.status && normalizePayoutStatus(p.status) !== filters.status) return false;
      if (filters.sourceType && (p.sourceType ?? "MANUAL") !== filters.sourceType) return false;
      if (filters.from && p.requestedAt < filters.from) return false;
      if (filters.to && p.requestedAt > filters.to) return false;
      return true;
    })
    .sort((a, b) => {
      const statusDiff =
        (STATUS_ORDER[normalizePayoutStatus(a.status)] ?? 99) -
        (STATUS_ORDER[normalizePayoutStatus(b.status)] ?? 99);
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
    });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-xl border-b border-border/60">
          <h1 className="text-2xl font-bold">{LANG.redemption.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{LANG.redemption.subtitle}</p>
        </div>

        <FilterBar
          fields={filterFields}
          values={filters}
          onChange={(k, v) => setFilters({ [k]: v })}
          onReset={resetFilters}
          hasActive={hasActiveFilters}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{LANG.redemption.noneFound}</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => {
              const bank = defaultBank(p.user);
              const typeLabel = accountTypeLabel(bank?.accountType);

              return (
              <div key={p.id} className="bg-card rounded-xl border border-border p-4 animate-fade-in">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm">{LANG.redemption.request}</p>
                    <p className="text-xs text-muted-foreground">
                      {requestTypeLabel(p.requestType)} · {payoutSourceLabel(p.sourceType)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm">{formatCredits(Number(p.amount))}</p>
                    <StatusBadge status={payoutStatusBadge(p.status)}>{payoutStatusLabel(p.status)}</StatusBadge>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 rounded-lg border border-border/70 bg-muted/30 p-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{LANG.common.user}</p>
                    <p className="mt-1 text-sm font-medium truncate">
                      {p.user?.fullName ?? LANG.common.noData}
                      {(() => {
                        const uname = p.user?.username ?? (p.user?.id ? usernameByUserId.get(p.user.id) : undefined);
                        return uname ? ` (${uname})` : "";
                      })()}
                    </p>
                    {p.user?.email && (
                      <p className="text-xs text-muted-foreground truncate">{p.user.email}</p>
                    )}
                    {p.user?.phone && (
                      <p className="text-xs text-muted-foreground">{p.user.phone}</p>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{LANG.bank.account}</p>
                    {bank ? (
                      <>
                        <p className="mt-1 text-sm font-medium truncate">{bank.holderName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {bank.bankName}
                          {typeLabel ? ` · ${typeLabel}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {maskAccountNo(bank.accountNo)} · {bank.ifscCode}
                        </p>
                      </>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{LANG.bank.noDetailsOnFile}</p>
                    )}
                  </div>
                </div>

                {rejectingId === p.id && (
                  <div className="mt-3 space-y-2">
                    <input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder={LANG.redemption.rejectionReasonPlaceholder}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    <div className="flex gap-2">
                      <button onClick={() => processMutation.mutate({ id: p.id, status: "REJECTED", rejectionReason: rejectReason })}
                        disabled={!rejectReason || processMutation.isPending}
                        className="h-8 px-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium disabled:opacity-50">
                        {LANG.common.confirmReject}
                      </button>
                      <button onClick={() => { setRejectingId(null); setRejectReason(""); }}
                        className="h-8 px-3 rounded-lg bg-muted text-xs font-medium">{LANG.common.cancel}</button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {new Date(p.requestedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  {p.status === "PENDING" && rejectingId !== p.id && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => processMutation.mutate({ id: p.id, status: "PROCESSED" })}
                        disabled={processMutation.isPending}
                        className="h-8 px-3 rounded-lg bg-success/10 text-success text-xs font-medium flex items-center gap-1 hover:bg-success/20 transition-colors">
                        <Check className="h-3 w-3" /> {LANG.common.approve}
                      </button>
                      <button onClick={() => setRejectingId(p.id)}
                        className="h-8 px-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium flex items-center gap-1 hover:bg-destructive/20 transition-colors">
                        <X className="h-3 w-3" /> {LANG.common.reject}
                      </button>
                    </div>
                  )}
                </div>

                {p.rejectionReason && (
                  <p className="text-xs text-destructive mt-2">{LANG.common.reason}: {p.rejectionReason}</p>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
