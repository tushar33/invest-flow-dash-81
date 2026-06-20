import { Wallet, PieChart, Zap, type LucideIcon } from "lucide-react";

export type AutoPayMode = "NONE" | "HALF" | "FULL";

export interface AutoPayOption {
  value: AutoPayMode;
  label: string;
  /** Short caption used in compact UIs. */
  caption: string;
  /** Full description shown so users understand the choice before applying. */
  description: string;
  icon: LucideIcon;
}

export const AUTO_PAY_OPTIONS: AutoPayOption[] = [
  {
    value: "NONE",
    label: "Manual",
    caption: "Keep in wallet",
    description: "Your ROI stays in your wallet each cycle. You request payouts yourself, whenever you want.",
    icon: Wallet,
  },
  {
    value: "HALF",
    label: "50%",
    caption: "Auto-pay half",
    description: "Half of each ROI is automatically requested as a payout; the other half stays in your wallet.",
    icon: PieChart,
  },
  {
    value: "FULL",
    label: "100%",
    caption: "Auto-pay all",
    description: "Your full ROI is automatically requested as a payout every cycle. Requires verified bank details.",
    icon: Zap,
  },
];

export function normalizeAutoPayMode(mode?: string | null): AutoPayMode {
  const upper = (mode?.toUpperCase() as AutoPayMode) || "NONE";
  return upper === "HALF" || upper === "FULL" ? upper : "NONE";
}
