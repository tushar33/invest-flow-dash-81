import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
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
import { FlaskConical, Loader2, AlertTriangle } from "lucide-react";
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
  cycleModeLabel,
  formatCycleDate,
  parseCycleMode,
  type CycleMode,
} from "@/lib/cycle-schedule";
import { formatCredits } from "@/lib/format";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminSimulator() {
  const [principalAmount, setPrincipalAmount] = useState("500000");
  const [roiPercentage, setRoiPercentage] = useState("10");
  const [startDate, setStartDate] = useState(todayIsoDate());
  const [cycleMode, setCycleMode] = useState<CycleMode>(DEFAULT_CYCLE_MODE);
  const [daysBetweenCycles, setDaysBetweenCycles] = useState(String(DEFAULT_DAYS_BETWEEN_CYCLES));
  const [autoPayMode, setAutoPayMode] = useState<SimulateInput["autoPayMode"]>("NONE");
  const [result, setResult] = useState<SimulationResult | null>(null);

  const { data: settings = [] } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: adminApi.settings,
  });

  const settingsDays = settings.find((s) => s.key === "daysBetweenCycles")?.value
    ?? settings.find((s) => s.key === "roiCycleDays")?.value
    ?? String(DEFAULT_DAYS_BETWEEN_CYCLES);

  const settingsMode = parseCycleMode(settings.find((s) => s.key === "cycleMode")?.value);

  const mutation = useMutation({
    mutationFn: (payload: SimulateInput) => adminApi.simulate(payload),
    onSuccess: (data) => setResult(data),
  });

  function handleRun() {
    const principal = Number(principalAmount);
    const roi = Number(roiPercentage);
    if (!Number.isFinite(principal) || principal <= 0) return;
    if (!Number.isFinite(roi)) return;

    const payload: SimulateInput = {
      principalAmount: principal,
      roiPercentage: roi,
      startDate: new Date(`${startDate}T00:00:00.000Z`).toISOString(),
      cycleMode,
      autoPayMode,
    };

    if (cycleMode === "FIXED_DAYS") {
      const days = Number(daysBetweenCycles);
      if (!Number.isFinite(days) || days < 1) return;
      payload.daysBetweenCycles = days;
    }

    mutation.mutate(payload);
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{LANG.simulator.title}</CardTitle>
            <CardDescription>
              Defaults from settings: {cycleModeLabel(settingsMode)}
              {settingsMode === "FIXED_DAYS" ? ` · ${settingsDays} days` : ""}
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
                <Label htmlFor="sim-roi">{LANG.simulator.rewardPercent}</Label>
                <Select value={roiPercentage} onValueChange={setRoiPercentage}>
                  <SelectTrigger id="sim-roi">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="7">7%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
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

            <Button onClick={handleRun} disabled={mutation.isPending} className="w-full sm:w-auto">
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FlaskConical className="h-4 w-4" />
              )}
              {mutation.isPending ? LANG.simulator.running : LANG.simulator.run}
            </Button>

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

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{LANG.simulator.month}</TableHead>
                        <TableHead>{LANG.cycle.cycleDate}</TableHead>
                        <TableHead className="text-right">{LANG.simulator.rewardCredit}</TableHead>
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
