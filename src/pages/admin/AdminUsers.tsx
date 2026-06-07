import { AdminLayout } from "@/components/AdminLayout";
import { AutoPayModeBadge } from "@/components/AutoPayModeBadge";
import { FilterBar, type FilterField } from "@/components/FilterBar";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { Eye, Plus, BookOpen, Landmark, Check, X, ExternalLink, FileText, FlaskConical } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admin as adminApi, bankVerificationStatusLabel, normalizeBankVerificationStatus, resolveUploadUrl } from "@/lib/api";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "@/hooks/use-toast";
import { formatCredits, formatIndianNumber, amountInIndianWords, parseAmountInput } from "@/lib/format";
import { LANG, FILTER_OPTIONS, autoPayModeLabel, roleLabel, accountTypeDisplay } from "@/lib/language";

const AUTO_PAY_MODES = ["NONE", "HALF", "FULL"] as const;
type AutoPayModeValue = (typeof AUTO_PAY_MODES)[number];

const filterDefaults = { search: "", role: "", autoPayMode: "" };

const filterFields: FilterField[] = [
  { key: "search", label: LANG.common.search, type: "search", placeholder: LANG.filter.nameOrEmailPlaceholder },
  {
    key: "role", label: LANG.common.role, type: "select", placeholder: LANG.filter.allRoles,
    options: [...FILTER_OPTIONS.userRole],
  },
  {
    key: "autoPayMode", label: LANG.filter.autoRedemption, type: "select", placeholder: LANG.filter.allModes,
    options: [...FILTER_OPTIONS.autoPayMode],
  },
];

function formatAdminUserLabel(user: { username?: string | null; name: string }) {
  if (user.username) return `${user.name} (${user.username})`;
  return user.name;
}

function isPdfSource(nameOrUrl: string): boolean {
  return nameOrUrl.toLowerCase().endsWith(".pdf");
}

function BankDocumentPreview({ label, url }: { label: string; url: string }) {
  const isPdf = isPdfSource(url);

  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 overflow-hidden">
      <div className="px-3 py-2 flex items-center justify-between gap-2 border-b border-border/40">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-semibold text-accent inline-flex items-center gap-1 hover:underline"
        >
          {LANG.common.view} <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      {isPdf ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-2 p-6 hover:bg-muted/50 transition-colors"
        >
          <FileText className="h-10 w-10 text-accent" />
          <span className="text-xs font-medium text-muted-foreground">{LANG.common.openPdf}</span>
        </a>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <img src={url} alt={LANG.common.documentAlt(label)} className="w-full max-h-48 object-contain bg-background" />
        </a>
      )}
    </div>
  );
}

function VerifyBankDetailsModal({
  open,
  onOpenChange,
  userId,
  userName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}) {
  const queryClient = useQueryClient();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const { data: bankDetails, isLoading, isError } = useQuery({
    queryKey: ["admin-user-bank-details", userId],
    queryFn: () => adminApi.userBankDetails(userId),
    enabled: open && Boolean(userId),
  });

  const verifyMutation = useMutation({
    mutationFn: (payload: { status: "VERIFIED" | "REJECTED"; rejectionReason?: string }) =>
      adminApi.verifyUserBankDetails(userId, payload),
    onSuccess: (_, variables) => {
      toast({
        title: variables.status === "VERIFIED" ? LANG.toast.bankVerified : LANG.toast.bankRejected,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-user-bank-details", userId] });
      setShowRejectForm(false);
      setRejectReason("");
    },
    onError: (err: Error) => {
      toast({ title: LANG.toast.actionFailed, description: err.message, variant: "destructive" });
    },
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setShowRejectForm(false);
      setRejectReason("");
    }
    onOpenChange(next);
  };

  const status = normalizeBankVerificationStatus(bankDetails?.verificationStatus);
  const statusVariant =
    status === "verified" ? "approved" : status === "rejected" ? "rejected" : "pending";

  const aadharUrl = resolveUploadUrl(bankDetails?.aadharDocumentUrl);
  const panUrl = resolveUploadUrl(bankDetails?.panDocumentUrl);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{LANG.admin.verifyBankDetails}</DialogTitle>
          <DialogDescription>{LANG.admin.verifyBankFor(userName)}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive py-6 text-center">{LANG.admin.bankLoadFailed}</p>
        ) : !bankDetails ? (
          <p className="text-sm text-muted-foreground py-6 text-center">{LANG.admin.noBankSubmitted}</p>
        ) : (
          <div className="space-y-4 py-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{LANG.admin.verificationStatus}</p>
              <StatusBadge status={statusVariant}>{bankVerificationStatusLabel(status)}</StatusBadge>
            </div>

            {status === "rejected" && bankDetails.rejectionReason && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-destructive">{LANG.bank.rejectionReason}</p>
                <p className="text-sm mt-1">{bankDetails.rejectionReason}</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 rounded-lg border border-border/70 bg-muted/30 p-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{LANG.admin.accountHolder}</p>
                <p className="text-sm font-medium mt-1">{bankDetails.accountHolderName}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{LANG.admin.bankName}</p>
                <p className="text-sm font-medium mt-1">{bankDetails.bankName}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{LANG.admin.accountNumber}</p>
                <p className="text-sm font-medium mt-1 font-mono">{bankDetails.accountNumber}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{LANG.admin.ifscCode}</p>
                <p className="text-sm font-medium mt-1 font-mono">{bankDetails.ifscCode}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{LANG.admin.accountType}</p>
                <p className="text-sm font-medium mt-1 capitalize">{accountTypeDisplay(bankDetails.accountType ?? "saving")}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{LANG.admin.aadharNumber}</p>
                <p className="text-sm font-medium mt-1">{bankDetails.aadharNumber || LANG.common.noData}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{LANG.admin.panNumber}</p>
                <p className="text-sm font-medium mt-1">{bankDetails.panNumber || LANG.common.noData}</p>
              </div>
            </div>

            {(aadharUrl || panUrl) && (
              <div className="grid gap-3 sm:grid-cols-2">
                {aadharUrl && <BankDocumentPreview label={LANG.admin.aadharDocument} url={aadharUrl} />}
                {panUrl && <BankDocumentPreview label={LANG.admin.panDocument} url={panUrl} />}
              </div>
            )}

            {showRejectForm && (
              <div className="space-y-2">
                <Label htmlFor="reject-reason">{LANG.bank.rejectionReason}</Label>
                <Textarea
                  id="reject-reason"
                  placeholder={LANG.admin.rejectReasonPlaceholder}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
        )}

        {bankDetails && status === "pending" && (
          <DialogFooter className="gap-2 sm:gap-0">
            {showRejectForm ? (
              <>
                <Button variant="outline" onClick={() => setShowRejectForm(false)} disabled={verifyMutation.isPending}>
                  {LANG.common.cancel}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() =>
                    verifyMutation.mutate({ status: "REJECTED", rejectionReason: rejectReason.trim() })
                  }
                  disabled={!rejectReason.trim() || verifyMutation.isPending}
                >
                  {verifyMutation.isPending ? LANG.common.rejecting : LANG.common.confirmReject}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => handleOpenChange(false)}>
                  {LANG.common.close}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectForm(true)}
                  disabled={verifyMutation.isPending}
                >
                  <X className="h-3.5 w-3.5 mr-1" /> {LANG.common.reject}
                </Button>
                <Button
                  onClick={() => verifyMutation.mutate({ status: "VERIFIED" })}
                  disabled={verifyMutation.isPending}
                >
                  <Check className="h-3.5 w-3.5 mr-1" />
                  {verifyMutation.isPending ? LANG.common.verifying : LANG.common.verify}
                </Button>
              </>
            )}
          </DialogFooter>
        )}

        {bankDetails && status !== "pending" && (
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>{LANG.common.close}</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AssignPlanForm({
  pkgAmount,
  onAmountChange,
  roiPct,
  onRoiChange,
}: {
  pkgAmount: string;
  onAmountChange: (value: string) => void;
  roiPct: string;
  onRoiChange: (value: string) => void;
}) {
  const parsedAmount = useMemo(() => parseAmountInput(pkgAmount), [pkgAmount]);
  const formattedAmount = parsedAmount != null ? formatIndianNumber(parsedAmount) : "";
  const wordsAmount = parsedAmount != null ? amountInIndianWords(parsedAmount) : "";
  const selectedPlanName = roiPct ? LANG.plans.rewardPlanName(Number(roiPct)) : null;
  const showSummary = parsedAmount != null && parsedAmount > 0;

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="assign-amount">{LANG.plans.contributionAmount}</Label>
        <Input
          id="assign-amount"
          type="number"
          min={0}
          placeholder={LANG.plans.contributionPlaceholder}
          value={pkgAmount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="tabular-nums"
        />
        {showSummary && (
          <div className="space-y-0.5 pt-0.5">
            <p className="text-xs text-muted-foreground">
              {LANG.plans.formattedAs}:{" "}
              <span className="font-semibold tabular-nums text-foreground">{formattedAmount}</span>
            </p>
            <p className="text-sm font-semibold text-accent">{wordsAmount}</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>{LANG.plans.rewardPercentage}</Label>
        <Select value={roiPct} onValueChange={onRoiChange}>
          <SelectTrigger><SelectValue placeholder={LANG.plans.selectRewardPercent} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5%</SelectItem>
            <SelectItem value="7">7%</SelectItem>
            <SelectItem value="10">10%</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showSummary && (
        <div className="rounded-xl border border-border/70 bg-gradient-to-br from-muted/40 to-muted/20 p-4 shadow-sm space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {LANG.plans.planSummary}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {LANG.plans.contributionAmount}
              </p>
              <p className="text-lg font-bold tabular-nums">{formattedAmount}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {LANG.plans.amountInWords}
              </p>
              <p className="text-base font-semibold text-accent leading-snug">{wordsAmount}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-border/50 space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {LANG.plans.selectedPlan}
            </p>
            <p className="text-sm font-semibold">
              {selectedPlanName ?? (
                <span className="text-muted-foreground font-normal">{LANG.plans.selectPlanToPreview}</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { filters, setFilters, resetFilters, hasActiveFilters } = useUrlFilters(filterDefaults);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () => adminApi.users({
      search: filters.search || undefined,
      role: filters.role || undefined,
      autoPayMode: filters.autoPayMode || undefined,
    }),
  });

  const [autopayUpdatingUserId, setAutopayUpdatingUserId] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [bankVerifyOpen, setBankVerifyOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [pkgAmount, setPkgAmount] = useState("");
  const [selectedUserAutoPay, setSelectedUserAutoPay] = useState<AutoPayModeValue>("NONE");

  const [roiPct, setRoiPct] = useState("");

  const handlePreviewSchedule = () => {
    if (!pkgAmount || !roiPct) return;
    const params = new URLSearchParams({
      principal: pkgAmount,
      roi: roiPct,
      autoPay: selectedUserAutoPay,
      userName: selectedUserName,
      from: "assign",
    });
    setAssignOpen(false);
    navigate(`/admin/simulator?${params.toString()}`);
  };

  const assignMutation = useMutation({
    mutationFn: () =>
      adminApi.assignPackage({
        userId: selectedUserId,
        principalAmount: Number(pkgAmount),
        roiPercentage: Number(roiPct),
      }),
    onSuccess: () => {
      toast({ title: LANG.toast.planAssigned });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      setAssignOpen(false);
      setPkgAmount("");
      setRoiPct("");
    },
    onError: (err: Error) => {
      toast({ title: LANG.toast.planAssignFailed, description: err.message, variant: "destructive" });
    },
  });

  const autopayMutation = useMutation({
    mutationFn: ({ userId, autoPayMode }: { userId: string; autoPayMode: AutoPayModeValue }) =>
      adminApi.configureAutopay(userId, { autoPayMode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setAutopayUpdatingUserId(null);
      toast({ title: LANG.toast.autoRedemptionUpdated });
    },
    onError: (err: Error) => {
      setAutopayUpdatingUserId(null);
      toast({ title: LANG.toast.autoRedemptionFailed, description: err.message, variant: "destructive" });
    },
  });

  const handleAutopayChange = (userId: string, autoPayMode: AutoPayModeValue) => {
    setAutopayUpdatingUserId(userId);
    autopayMutation.mutate({ userId, autoPayMode });
  };

  const openAssignModal = (userId: string, userName: string, autoPayMode?: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setSelectedUserAutoPay((autoPayMode as AutoPayModeValue) ?? "NONE");
    setPkgAmount("");
    setRoiPct("");
    setAssignOpen(true);
  };

  const openBankVerifyModal = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setBankVerifyOpen(true);
  };

  const filtered = (users ?? []).filter(u => {
    if (filters.search && !u.name.toLowerCase().includes(filters.search.toLowerCase()) && !(u.email ?? "").toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.role && u.role !== filters.role) return false;
    if (filters.autoPayMode && (u.autoPayMode ?? "NONE") !== filters.autoPayMode) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-xl border-b border-border/60">
          <h1 className="text-2xl font-bold">{LANG.admin.usersTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1">{LANG.admin.usersSubtitle}</p>
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
        ) : (
          <>
            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {filtered.map((u) => (
                <div key={u.id} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{formatAdminUserLabel(u)}</p>
                      <p className="text-xs text-muted-foreground">{u.email || LANG.common.noData}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full">{roleLabel(u.role)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">{LANG.common.availableBalance}</span>
                    <span className="text-sm font-semibold">{formatCredits(u.currentBalance)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{LANG.common.totalRewards}</span>
                    <span className="text-sm font-semibold">{formatCredits(u.totalRewardsCredited ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{LANG.nav.plans}</span>
                    <span className="text-sm font-semibold">{u.totalPackages}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1.5">{LANG.admin.autoRedemptionMode}</p>
                    {currentUser?.id === u.id ? (
                      <AutoPayModeBadge mode={u.autoPayMode ?? "NONE"} />
                    ) : (
                      <Select
                        value={u.autoPayMode ?? "NONE"}
                        onValueChange={(v) => handleAutopayChange(u.id, v as AutoPayModeValue)}
                        disabled={autopayUpdatingUserId === u.id}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AUTO_PAY_MODES.map((m) => (
                            <SelectItem key={m} value={m}>{autoPayModeLabel(m)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
                    <Button size="sm" variant="outline" className="w-full justify-start text-xs" onClick={() => openAssignModal(u.id, u.name, u.autoPayMode)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> {LANG.admin.assignPlanAction}
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start text-xs" onClick={() => navigate(`/admin/packages?userId=${u.id}`)}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> {LANG.admin.viewPlans}
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start text-xs" onClick={() => navigate(`/wallet/ledger?userId=${u.id}`)}>
                      <BookOpen className="h-3.5 w-3.5 mr-1" /> {LANG.plans.viewLedger}
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start text-xs" onClick={() => openBankVerifyModal(u.id, u.name)}>
                      <Landmark className="h-3.5 w-3.5 mr-1" /> {LANG.admin.verifyBankDetails}
                    </Button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-12">{LANG.admin.noUsers}</p>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">{LANG.common.name}</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">{LANG.common.email}</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">{LANG.filter.autoRedemption}</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">{LANG.nav.plans}</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">{LANG.common.availableBalance}</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">{LANG.common.totalRewards}</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-4">{LANG.common.role}</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-4">{LANG.common.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 text-sm font-medium">{formatAdminUserLabel(u)}</td>
                      <td className="p-4 text-sm text-muted-foreground">{u.email || LANG.common.noData}</td>
                      <td className="p-4">
                        {currentUser?.id === u.id ? (
                          <AutoPayModeBadge mode={u.autoPayMode ?? "NONE"} />
                        ) : (
                          <Select
                            value={u.autoPayMode ?? "NONE"}
                            onValueChange={(v) => handleAutopayChange(u.id, v as AutoPayModeValue)}
                            disabled={autopayUpdatingUserId === u.id}
                          >
                            <SelectTrigger className="h-8 w-[100px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {AUTO_PAY_MODES.map((m) => (
                                <SelectItem key={m} value={m}>{autoPayModeLabel(m)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </td>
                      <td className="p-4 text-sm font-semibold">{u.totalPackages}</td>
                      <td className="p-4 text-sm font-semibold">{formatCredits(u.currentBalance)}</td>
                      <td className="p-4 text-sm font-semibold">{formatCredits(u.totalRewardsCredited ?? 0)}</td>
                      <td className="p-4"><span className="text-[10px] font-bold bg-accent/15 text-accent px-2 py-0.5 rounded-full">{roleLabel(u.role)}</span></td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col gap-2 w-[160px] ml-auto">
                          <Button size="sm" variant="outline" className="text-xs justify-center w-full" onClick={() => openAssignModal(u.id, u.name, u.autoPayMode)}>
                            <Plus className="h-3.5 w-3.5 mr-1" /> {LANG.admin.assignPlanAction}
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs justify-center w-full" onClick={() => navigate(`/admin/packages?userId=${u.id}`)}>
                            <Eye className="h-3.5 w-3.5 mr-1" /> {LANG.admin.viewPlans}
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs justify-center w-full" onClick={() => navigate(`/wallet/ledger?userId=${u.id}`)}>
                            <BookOpen className="h-3.5 w-3.5 mr-1" /> {LANG.plans.viewLedger}
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs justify-center w-full" onClick={() => openBankVerifyModal(u.id, u.name)}>
                            <Landmark className="h-3.5 w-3.5 mr-1" /> {LANG.admin.verifyBankDetails}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="text-center text-muted-foreground py-12">{LANG.admin.noUsers}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Assign Plan Modal */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{LANG.admin.assignPlanAction}</DialogTitle>
            <DialogDescription>{LANG.plans.assignPlanTo(selectedUserName)}</DialogDescription>
          </DialogHeader>
          <AssignPlanForm
            pkgAmount={pkgAmount}
            onAmountChange={setPkgAmount}
            roiPct={roiPct}
            onRoiChange={setRoiPct}
          />
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handlePreviewSchedule}
              disabled={!pkgAmount || !roiPct}
              className="w-full sm:w-auto"
            >
              <FlaskConical className="h-4 w-4" />
              {LANG.simulator.previewSchedule}
            </Button>
            <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
              <Button variant="outline" onClick={() => setAssignOpen(false)}>{LANG.common.cancel}</Button>
              <Button
                onClick={() => assignMutation.mutate()}
                disabled={!pkgAmount || !roiPct || assignMutation.isPending}
              >
                {assignMutation.isPending ? LANG.common.assigning : LANG.plans.assignPlan}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <VerifyBankDetailsModal
        open={bankVerifyOpen}
        onOpenChange={setBankVerifyOpen}
        userId={selectedUserId}
        userName={selectedUserName}
      />
    </AdminLayout>
  );
}
