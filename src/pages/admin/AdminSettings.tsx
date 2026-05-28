import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Clock, Cpu, Save, Loader2, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { admin as adminApi, type SystemSetting } from "@/lib/api";
import { LANG } from "@/lib/language";
import {
  DEFAULT_CYCLE_MODE,
  DEFAULT_DAYS_BETWEEN_CYCLES,
  parseCycleMode,
  type CycleMode,
} from "@/lib/cycle-schedule";

const PAYOUT_KEYS = new Set([
  "payoutWindowStart",
  "payoutWindowEnd",
  "payoutTimeValidationEnabled",
]);

const REWARD_ENGINE_KEYS = new Set(["cycleMode", "daysBetweenCycles", "roiCycleDays"]);

function toTimeInputValue(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function valuesFromSettings(settings: SystemSetting[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const s of settings) {
    if (s.type === "BOOLEAN") {
      map[s.key] = s.value.toLowerCase() === "true" ? "true" : "false";
    } else {
      map[s.key] = s.value ?? "";
    }
  }
  if (!map.cycleMode) {
    map.cycleMode = DEFAULT_CYCLE_MODE;
  }
  if (!map.daysBetweenCycles) {
    map.daysBetweenCycles = map.roiCycleDays || String(DEFAULT_DAYS_BETWEEN_CYCLES);
  }
  return map;
}

export default function AdminSettings() {
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const {
    data: settings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: adminApi.settings,
  });

  useEffect(() => {
    if (settings.length > 0) {
      setValues(valuesFromSettings(settings));
    }
  }, [settings]);

  const payoutSettings = settings.filter((s) => PAYOUT_KEYS.has(s.key));
  const cycleMode = parseCycleMode(values.cycleMode);
  const isFixedDays = cycleMode === "FIXED_DAYS";

  const payoutValidation = values.payoutTimeValidationEnabled === "true";
  const payoutStart = values.payoutWindowStart ?? "09:00";
  const payoutEnd = values.payoutWindowEnd ?? "12:00";

  const settingsToSave = useMemo(
    () =>
      settings.filter(
        (s) => PAYOUT_KEYS.has(s.key) || REWARD_ENGINE_KEYS.has(s.key),
      ),
    [settings],
  );

  const handleSave = async () => {
    if (payoutValidation && payoutStart >= payoutEnd) {
      toast({
        title: LANG.common.validationError,
        description: LANG.settings.startBeforeEnd,
        variant: "destructive",
      });
      return;
    }

    if (isFixedDays) {
      const days = Number(values.daysBetweenCycles);
      if (!values.daysBetweenCycles || !Number.isFinite(days) || days < 1) {
        toast({
          title: LANG.common.validationError,
          description: LANG.cycle.fixedDaysRequired,
          variant: "destructive",
        });
        return;
      }
    }

    setSaving(true);
    try {
      const updates: Promise<SystemSetting>[] = [];

      for (const s of settingsToSave) {
        if (s.key === "roiCycleDays") continue;
        if (s.key === "daysBetweenCycles" && !isFixedDays) continue;

        if (s.key === "cycleMode") {
          updates.push(adminApi.updateSetting("cycleMode", cycleMode));
          continue;
        }

        updates.push(
          adminApi.updateSetting(s.key, values[s.key] ?? s.value),
        );
      }

      if (isFixedDays) {
        updates.push(
          adminApi.updateSetting(
            "daysBetweenCycles",
            values.daysBetweenCycles ?? String(DEFAULT_DAYS_BETWEEN_CYCLES),
          ),
        );
      }

      await Promise.all(updates);
      await refetch();
      toast({
        title: LANG.settings.saved,
        description: LANG.settings.savedDescription,
      });
    } catch (err) {
      toast({
        title: LANG.common.error,
        description: err instanceof Error ? err.message : LANG.settings.saveFailed,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : LANG.settings.loadFailed}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            {LANG.common.retry}
          </Button>
        </div>
      </AdminLayout>
    );
  }

  if (settings.length === 0) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{LANG.settings.title}</h1>
          <p className="text-sm text-muted-foreground">{LANG.settings.empty}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="sticky top-0 z-30 -mx-4 px-4 py-3 mb-6 bg-background/85 backdrop-blur-xl border-b border-border/60 space-y-1">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold text-foreground">{LANG.settings.title}</h1>
        </div>
        <p className="text-muted-foreground text-sm">{LANG.settings.subtitle}</p>
      </div>

      <div className="grid gap-5">
        {payoutSettings.length > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">{LANG.redemption.windowSettings}</CardTitle>
              </div>
              <CardDescription>{LANG.settings.windowDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="payout-validation">{LANG.redemption.enableTimeValidation}</Label>
                  <p className="text-xs text-muted-foreground">{LANG.settings.restrictWindow}</p>
                </div>
                <Switch
                  id="payout-validation"
                  checked={payoutValidation}
                  onCheckedChange={(checked) =>
                    setValues((prev) => ({
                      ...prev,
                      payoutTimeValidationEnabled: checked ? "true" : "false",
                    }))
                  }
                />
              </div>

              {payoutValidation && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="payout-start">{LANG.redemption.windowStart}</Label>
                    <Input
                      id="payout-start"
                      type="time"
                      value={toTimeInputValue(payoutStart)}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, payoutWindowStart: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="payout-end">{LANG.redemption.windowEnd}</Label>
                    <Input
                      id="payout-end"
                      type="time"
                      value={toTimeInputValue(payoutEnd)}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, payoutWindowEnd: e.target.value }))
                      }
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground border-l-2 border-accent/40 pl-3">
                {LANG.settings.windowHint}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-accent" />
              <CardTitle className="text-lg">{LANG.reward.engine}</CardTitle>
            </div>
            <CardDescription>{LANG.reward.engineDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 max-w-md">
              <Label htmlFor="cycle-mode">{LANG.cycle.schedulingMode}</Label>
              <Select
                value={cycleMode}
                onValueChange={(value: CycleMode) =>
                  setValues((prev) => ({ ...prev, cycleMode: value }))
                }
              >
                <SelectTrigger id="cycle-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CALENDAR_MONTHLY">{LANG.cycle.calendarMonthly}</SelectItem>
                  <SelectItem value="FIXED_DAYS">{LANG.cycle.fixedDays}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {isFixedDays ? LANG.cycle.fixedDaysHelp : LANG.cycle.calendarMonthlyHelp}
              </p>
            </div>

            {isFixedDays ? (
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="days-between-cycles">{LANG.cycle.daysBetweenCycles}</Label>
                <Input
                  id="days-between-cycles"
                  type="number"
                  min={1}
                  value={values.daysBetweenCycles ?? String(DEFAULT_DAYS_BETWEEN_CYCLES)}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, daysBetweenCycles: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">{LANG.cycle.fixedDaysHelp}</p>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 max-w-xl">
                <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{LANG.cycle.calendarMonthlyNotice}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-20 md:bottom-0 pt-4 pb-2 bg-background/80 backdrop-blur-sm mt-6">
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? LANG.common.saving : LANG.settings.save}
        </Button>
      </div>
    </AdminLayout>
  );
}
