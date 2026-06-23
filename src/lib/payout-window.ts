/**
 * Payout/redemption window in IST (UTC+5:30).
 * Times come from GET /payouts/config (admin settings).
 */
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
export const DEFAULT_WINDOW_START = "09:00";
export const DEFAULT_WINDOW_END = "12:00";
const WINDOW_START_MINUTES = 9 * 60;
const WINDOW_END_MINUTES = 12 * 60;

function parseTimeToMinutes(timeStr: string): number | null {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

function getCurrentIstMinutes(): number {
  const now = new Date();
  const istMs = now.getTime() + IST_OFFSET_MS;
  const istDate = new Date(istMs);
  return istDate.getUTCHours() * 60 + istDate.getUTCMinutes();
}

export function isWithinPayoutWindowWithTimes(windowStart: string, windowEnd: string): boolean {
  const startMin = parseTimeToMinutes(windowStart) ?? WINDOW_START_MINUTES;
  const endMin = parseTimeToMinutes(windowEnd) ?? WINDOW_END_MINUTES;
  const current = getCurrentIstMinutes();
  return current >= startMin && current < endMin;
}

export function formatTimeLabel(timeStr: string): string {
  const minutes = parseTimeToMinutes(timeStr);
  if (minutes === null) return timeStr;
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${mins.toString().padStart(2, "0")} ${period}`;
}

export function formatPayoutWindowTimeRange(
  windowStart: string = DEFAULT_WINDOW_START,
  windowEnd: string = DEFAULT_WINDOW_END,
): string {
  return `${formatTimeLabel(windowStart)} – ${formatTimeLabel(windowEnd)}`;
}
