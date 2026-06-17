import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { CycleModeBadge } from "@/components/CycleModeBadge";
import {
  FlaskConical,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  Gift,
  CreditCard,
  Wallet,
  RotateCcw,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  admin as adminApi,
  type SimulateInput,
  type SimulationResult,
} from "@/lib/api";
import { LANG } from "@/lib/language";
import {
  DEFAULT_CYCLE_MODE,
  DEFAULT_DAYS_BETWEEN_CYCLES,
  cycleModeDescription,
  cycleModeLabel,
  formatCycleDate,
  parseCycleMode,
  type CycleMode,
} from "@/lib/cycle-schedule";
import { formatCredits } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";
import {
  ADMIN_PLAN_OPTIONS,
  findPlanOptionIndex,
  planLabel,
  type AdminPlanOption,
} from "@/lib/plan-options";

function planKeyFromSearchParams(searchParams: URLSearchParams): string {
  const roi = Number(searchParams.get("roi") ?? 10);
  const planType = searchParams.get("planType");
  return String(findPlanOptionIndex(roi, planType));
}

function applyPlanTypeToPayload(
  payload: SimulateInput,
  selectedPlan: AdminPlanOption,
): void {
  if ("planType" in selectedPlan && selectedPlan.planType) {
    payload.planType = selectedPlan.planType;
  } else if (selectedPlan.roiPercentage === 5) {
    payload.planType = "FIVE_PERCENT";
  } else if (selectedPlan.roiPercentage === 7) {
    payload.planType = "SEVEN_PERCENT";
  }
}

function buildPayload(
  principalAmount: string,
  selectedPlan: AdminPlanOption,
  startDate: string,
  cycleMode: CycleMode,
  daysBetweenCycles: string,
  autoPayMode: SimulateInput["autoPayMode"],
): SimulateInput | null {
  const principal = Number(principalAmount);
  const roi = selectedPlan.roiPercentage;
  if (!Number.isFinite(principal) || principal <= 0) return null;
  if (!Number.isFinite(roi)) return null;

  const payload: SimulateInput = {
    principalAmount: principal,
    roiPercentage: roi,
    startDate: new Date(`${startDate}T00:00:00.000Z`).toISOString(),
    cycleMode,
    autoPayMode,
  };

  applyPlanTypeToPayload(payload, selectedPlan);

  if (cycleMode === "FIXED_DAYS") {
    const days = Number(daysBetweenCycles);
    if (!Number.isFinite(days) || days < 1) return null;
    payload.daysBetweenCycles = days;
  }

  return payload;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminSimulator() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const previewUserName = searchParams.get("userName") ?? "";
  const fromAssign = searchParams.get("from") === "assign";
  const autoRanRef = useRef(false);
  const settingsAppliedRef = useRef(false);

  const [principalAmount, setPrincipalAmount] = useState(
    () => searchParams.get("principal") ?? "500000",
  );
  const [planKey, setPlanKey] = useState(() => planKeyFromSearchParams(searchParams));
  const selectedPlan = ADMIN_PLAN_OPTIONS[Number(planKey)] ?? ADMIN_PLAN_OPTIONS[0];
  const [startDate, setStartDate] = useState(todayIsoDate());
  const [cycleMode, setCycleMode] = useState<CycleMode>(DEFAULT_CYCLE_MODE);
  const [daysBetweenCycles, setDaysBetweenCycles] = useState(String(DEFAULT_DAYS_BETWEEN_CYCLES));
  const [autoPayMode, setAutoPayMode] = useState<SimulateInput["autoPayMode"]>(
    () => (searchParams.get("autoPay") as SimulateInput["autoPayMode"]) ?? "NONE",
  );
  const [result, setResult] = useState<SimulationResult | null>(null);

  const { data: settings = [] } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: adminApi.settings,
  });

  const settingsDays = settings.find((s) => s.key === "daysBetweenCycles")?.value
    ?? settings.find((s) => s.key === "roiCycleDays")?.value
    ?? String(DEFAULT_DAYS_BETWEEN_CYCLES);

  const settingsMode = parseCycleMode(settings.find((s) => s.key === "cycleMode")?.value);

  useEffect(() => {
    if (settings.length === 0 || settingsAppliedRef.current) return;
    settingsAppliedRef.current = true;
    setCycleMode(settingsMode);
    setDaysBetweenCycles(settingsDays);
  }, [settings.length, settingsMode, settingsDays]);

  const mutation = useMutation({
    mutationFn: (payload: SimulateInput) => adminApi.simulate(payload),
    onSuccess: (data) => setResult(data),
  });

  const runSimulation = useCallback(
    (payload: SimulateInput) => mutation.mutate(payload),
    [mutation.mutate],
  );

  const handleRun = useCallback(() => {
    const payload = buildPayload(
      principalAmount,
      selectedPlan,
      startDate,
      cycleMode,
      daysBetweenCycles,
      autoPayMode,
    );
    if (!payload) {
      toast({
        title: LANG.common.validationError,
        description: LANG.simulator.invalidPrincipal,
        variant: "destructive",
      });
      return;
    }
    runSimulation(payload);
  }, [
    principalAmount,
    selectedPlan,
    startDate,
    cycleMode,
    daysBetweenCycles,
    autoPayMode,
    runSimulation,
    toast,
  ]);

  useEffect(() => {
    if (!fromAssign || autoRanRef.current || settings.length === 0) return;
    const payload = buildPayload(
      principalAmount,
      selectedPlan,
      startDate,
      settingsMode,
      settingsDays,
      autoPayMode,
    );
    if (payload) {
      autoRanRef.current = true;
      runSimulation(payload);
    }
  }, [
    fromAssign,
    settings.length,
    settingsMode,
    settingsDays,
    principalAmount,
    selectedPlan,
    startDate,
    autoPayMode,
    runSimulation,
  ]);

  function applySettingsDefaults() {
    setCycleMode(settingsMode);
    setDaysBetweenCycles(settingsDays);
  }

  const isFixedDays = cycleMode === "FIXED_DAYS";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          icon={<FlaskConical className="h-5 w-5" />}
          title={LANG.simulator.title}
          subtitle={LANG.simulator.subtitle}
        />

        {previewUserName && (
          <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 space-y-1">
            <p className="text-sm font-medium">{LANG.simulator.previewForUser(previewUserName)}</p>
            <p className="text-xs text-muted-foreground">{LANG.simulator.previewHint}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{LANG.simulator.title}</CardTitle>
            <CardDescription>
              System defaults: {cycleModeLabel(settingsMode)}
              {settingsMode === "FIXED_DAYS" ? ` · ${settingsDays} days` : ""}
              {" · "}
              {cycleModeDescription(settingsMode, Number(settingsDays))}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sim-principal">{LANG.simulator.principalAmount}</Label>
                <Input
                  id="sim-principal"
                  type="number"
                  min={1}
                  value={principalAmount}
                  onChange={(e) => setPrincipalAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sim-plan">{LANG.plans.planTypeLabel}</Label>
                <Select value={planKey} onValueChange={setPlanKey}>
                  <SelectTrigger id="sim-plan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_PLAN_OPTIONS.map((opt, index) => (
                      <SelectItem key={`${opt.label}-${index}`} value={String(index)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sim-start">{LANG.simulator.startDate}</Label>
                <Input
                  id="sim-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sim-mode">{LANG.cycle.schedulingMode}</Label>
                <Select value={cycleMode} onValueChange={(v: CycleMode) => setCycleMode(v)}>
                  <SelectTrigger id="sim-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CALENDAR_MONTHLY">{LANG.cycle.calendarMonthly}</SelectItem>
                    <SelectItem value="FIXED_DAYS">{LANG.cycle.fixedDays}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isFixedDays && (
                <div className="space-y-2">
                  <Label htmlFor="sim-days">{LANG.cycle.daysBetweenCycles}</Label>
                  <Input
                    id="sim-days"
                    type="number"
                    min={1}
                    value={daysBetweenCycles}
                    onChange={(e) => setDaysBetweenCycles(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="sim-autopay">{LANG.simulator.autoPayMode}</Label>
                <Select value={autoPayMode} onValueChange={(v: SimulateInput["autoPayMode"]) => setAutoPayMode(v)}>
                  <SelectTrigger id="sim-autopay">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">NONE</SelectItem>
                    <SelectItem value="HALF">HALF</SelectItem>
                    <SelectItem value="FULL">FULL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleRun} disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FlaskConical className="h-4 w-4" />
                )}
                {mutation.isPending ? LANG.simulator.running : LANG.simulator.run}
              </Button>
              <Button type="button" variant="outline" onClick={applySettingsDefaults}>
                <RotateCcw className="h-4 w-4" />
                {LANG.simulator.useSettingsDefaults}
              </Button>
            </div>

            {mutation.isError && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : LANG.simulator.loadError}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {mutation.isPending ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !result ? (
          <EmptyState
            icon={FlaskConical}
            title={LANG.simulator.emptyTitle}
            description={LANG.simulator.emptyDescription}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <CycleModeBadge mode={result.summary.cycleMode} />
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20">
                {planLabel(result.inputs.roiPercentage, result.inputs.planType)}
              </span>
              {result.validation.passed ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {LANG.simulator.validationPassed}
                </span>
              ) : null}
              {result.summary.initialNextRoiDate && (
                <span className="text-xs text-muted-foreground">
                  {LANG.plans.nextCycleDate}: {formatCycleDate(result.summary.initialNextRoiDate)}
                </span>
              )}
            </div>

            {!result.validation.passed && result.validation.warnings.length > 0 && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  {LANG.simulator.validationWarnings}
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                  {result.validation.warnings.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatCard
                label={LANG.simulator.totalCycles}
                value={String(result.summary.totalCycles)}
                icon={CalendarDays}
              />
              <StatCard
                label={LANG.simulator.monthlyBenefit}
                value={formatCredits(result.summary.monthlyRoiAmount)}
                icon={Gift}
              />
              <StatCard
                label={LANG.simulator.maturityDate}
                value={formatCycleDate(result.summary.maturityDate)}
                icon={CalendarDays}
              />
              <StatCard
                label={LANG.simulator.totalRewards}
                value={formatCredits(result.summary.totalRoiPayout)}
                icon={Gift}
              />
              <StatCard
                label={LANG.simulator.totalAutoPay}
                value={formatCredits(result.summary.totalAutoPayProjected ?? 0)}
                icon={CreditCard}
              />
              <StatCard
                label={LANG.simulator.walletAfterAutoPay}
                value={formatCredits(result.summary.walletNetAfterAutoPay ?? 0)}
                icon={Wallet}
              />
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{LANG.simulator.month}</TableHead>
                        <TableHead>{LANG.cycle.cycleDate}</TableHead>
                        <TableHead className="text-right">{LANG.simulator.rewardCredit}</TableHead>
                        <TableHead className="text-right">{LANG.simulator.autoPayPayout}</TableHead>
                        <TableHead className="text-right">{LANG.simulator.walletNet}</TableHead>
                        <TableHead className="text-right">{LANG.simulator.balanceAdjustment}</TableHead>
                        <TableHead className="text-right">{LANG.simulator.remainingBalance}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.cycles.map((row) => (
                        <TableRow key={row.cycleNumber}>
                          <TableCell className="font-medium">{row.month}</TableCell>
                          <TableCell>{formatCycleDate(row.cycleDate ?? row.scheduledDate)}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCredits(row.reward ?? row.roiAmount)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCredits(row.autoPay?.payoutAmount ?? 0)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCredits(row.walletCreditNet ?? 0)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCredits(row.adjustment ?? row.principalDeduction)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCredits(row.remainingBalance ?? row.remainingPrincipal)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
