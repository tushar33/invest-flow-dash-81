import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Clock, Zap, Cpu, Bell, Save, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);

  // Payout Window
  const [payoutValidation, setPayoutValidation] = useState(true);
  const [payoutStart, setPayoutStart] = useState("09:00");
  const [payoutEnd, setPayoutEnd] = useState("12:00");

  // Auto Pay
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [defaultAutoPayMode, setDefaultAutoPayMode] = useState("NONE");

  // System Config
  const [maxRoiCycles, setMaxRoiCycles] = useState("12");
  const [multiplePackages, setMultiplePackages] = useState(false);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleSave = async () => {
    if (payoutValidation && payoutStart >= payoutEnd) {
      toast({ title: "Validation Error", description: "Start time must be before end time.", variant: "destructive" });
      return;
    }
    if (!maxRoiCycles || Number(maxRoiCycles) < 1) {
      toast({ title: "Validation Error", description: "Max ROI cycles must be at least 1.", variant: "destructive" });
      return;
    }

    setSaving(true);
    // Simulate save — backend settings API not yet available
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast({ title: "Settings saved", description: "Your configuration has been updated successfully." });
  };

  return (
    <AdminLayout>
      <div className="space-y-1 mb-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground text-sm">Configure system-level rules for payouts and platform operations.</p>
      </div>

      <div className="grid gap-5">
        {/* Section 1: Payout Window */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              <CardTitle className="text-lg">Payout Window Settings</CardTitle>
            </div>
            <CardDescription>Control when users are allowed to request payouts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="payout-validation">Enable Payout Time Validation</Label>
                <p className="text-xs text-muted-foreground">Restrict payouts to the configured time window.</p>
              </div>
              <Switch id="payout-validation" checked={payoutValidation} onCheckedChange={setPayoutValidation} />
            </div>

            {payoutValidation && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="payout-start">Payout Window Start</Label>
                  <Input id="payout-start" type="time" value={payoutStart} onChange={(e) => setPayoutStart(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="payout-end">Payout Window End</Label>
                  <Input id="payout-end" type="time" value={payoutEnd} onChange={(e) => setPayoutEnd(e.target.value)} />
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground border-l-2 border-accent/40 pl-3">
              Users can only request payouts during this time window.
            </p>
          </CardContent>
        </Card>

        {/* Section 2: Auto Pay Configuration */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <CardTitle className="text-lg">Auto Pay Configuration</CardTitle>
            </div>
            <CardDescription>Manage automatic payout behavior when ROI is credited.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autopay-toggle">Enable Auto Pay System</Label>
                <p className="text-xs text-muted-foreground">Automatically generate payout requests on ROI credit.</p>
              </div>
              <Switch id="autopay-toggle" checked={autoPayEnabled} onCheckedChange={setAutoPayEnabled} />
            </div>

            {autoPayEnabled && (
              <div className="space-y-1.5 max-w-xs">
                <Label>Default Auto Pay Mode</Label>
                <Select value={defaultAutoPayMode} onValueChange={setDefaultAutoPayMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">None</SelectItem>
                    <SelectItem value="HALF">Half Auto Pay</SelectItem>
                    <SelectItem value="FULL">Full Auto Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <p className="text-xs text-muted-foreground border-l-2 border-accent/40 pl-3">
              If enabled, ROI payouts can be automatically generated based on user configuration.
            </p>
          </CardContent>
        </Card>

        {/* Section 3: System Configuration */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-accent" />
              <CardTitle className="text-lg">System Configuration</CardTitle>
            </div>
            <CardDescription>General platform configuration settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5 max-w-xs">
              <Label htmlFor="max-cycles">Maximum ROI Cycles Per Package</Label>
              <Input
                id="max-cycles"
                type="number"
                min={1}
                value={maxRoiCycles}
                onChange={(e) => setMaxRoiCycles(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="multi-pkg">Allow Multiple Active Packages</Label>
                <p className="text-xs text-muted-foreground">Users can have multiple packages active at the same time.</p>
              </div>
              <Switch id="multi-pkg" checked={multiplePackages} onCheckedChange={setMultiplePackages} />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Notifications */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>Configure email and SMS alert preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notif">Enable Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Send email alerts for payout events.</p>
              </div>
              <Switch id="email-notif" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notif">Enable SMS Notifications</Label>
                <p className="text-xs text-muted-foreground">Send SMS alerts for payout events.</p>
              </div>
              <Switch id="sms-notif" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
            </div>

            <p className="text-xs text-muted-foreground border-l-2 border-accent/40 pl-3">
              Send alerts to admin and users when payouts are requested or processed.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-20 md:bottom-0 pt-4 pb-2 bg-background/80 backdrop-blur-sm mt-6">
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </div>
    </AdminLayout>
  );
}
