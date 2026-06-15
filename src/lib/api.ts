import { LANG } from "@/lib/language";
import { toWalletApiParams, type WalletUiFilters } from "@/lib/wallet-api-params";
import type { LedgerPackageSummary } from "@/lib/wallet-transactions";

// Base URL for the backend API.
const DEFAULT_LOCAL_API_BASE = "http://localhost:3000";
const DEFAULT_PROD_API_BASE = "https://api.trinityarrows.com";
const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const API_BASE = import.meta.env.VITE_API_BASE ?? (isLocalHost ? DEFAULT_LOCAL_API_BASE : DEFAULT_PROD_API_BASE);

/** Turn a backend upload path (e.g. /uploads/kyc-docs/…) into a full URL. */
export function resolveUploadUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearToken() {
  localStorage.removeItem("auth_token");
}

/** Clears auth and notifies AuthContext (see auth:session-expired listener). */
export function handleSessionExpired() {
  clearToken();
  window.dispatchEvent(new Event("auth:session-expired"));
}

function isAuthEndpoint(path: string): boolean {
  return (
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/register") ||
    path.startsWith("/auth/forgot-password") ||
    path.startsWith("/auth/reset-password")
  );
}

/** Build query string from params object, skipping undefined/null/empty values */
function buildQs(params?: Record<string, string | number | undefined | null>): string {
  if (!params) return "";
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

type RequestOptions = RequestInit & { nullOn404?: boolean };

async function parseJsonBody<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text.trim()) return null as T;
  return JSON.parse(text) as T;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { nullOn404, ...fetchOptions } = options;
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });

  if (res.status === 401 && !isAuthEndpoint(path)) {
    handleSessionExpired();
    throw new Error(LANG.auth.sessionExpired);
  }

  if (!res.ok) {
    if (nullOn404 && res.status === 404) return null as T;
    const body = await res.json().catch(() => ({ message: res.statusText }));
    const msg = Array.isArray(body.message) ? body.message.join(", ") : body.message;
    throw new Error(msg || LANG.auth.requestFailed(res.status));
  }

  if (res.status === 204) return null as T;
  return parseJsonBody<T>(res);
}

async function uploadRequest<T>(path: string, formData: FormData, method = "POST"): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { method, body: formData, headers });

  if (res.status === 401 && !isAuthEndpoint(path)) {
    handleSessionExpired();
    throw new Error(LANG.auth.sessionExpired);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    const msg = Array.isArray(body.message) ? body.message.join(", ") : body.message;
    throw new Error(msg || LANG.auth.requestFailed(res.status));
  }

  if (res.status === 204) return null as T;
  return parseJsonBody<T>(res);
}

// ── Auth ──
export interface AuthUser {
  id: string;
  fullName: string;
  username?: string | null;
  email: string | null;
  phone: string | null;
  city?: string | null;
  role: "USER" | "ADMIN";
  autoPayMode: string;
  status: string;
  onboardingStatus: "BANK_PENDING" | "VERIFICATION_PENDING" | "APPROVED";
  createdAt?: string;
  updatedAt?: string;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export type LoginPayload = {
  username: string;
  password: string;
};

/** Map User ID input to stored username format. */
export function normalizeUserId(userId: string): string {
  const t = userId.trim();
  if (!t) {
    throw new Error(LANG.auth.enterIdentifier);
  }
  const taMatch = t.match(/^ta-?(\d+)$/i);
  if (taMatch) {
    const digits = taMatch[1];
    return digits.length === 7 ? `TA-${digits}` : `ta${digits}`;
  }
  return t.toLowerCase();
}

/** Map User ID input to the API login body. */
export function buildLoginPayload(userId: string, password: string): LoginPayload {
  return { username: normalizeUserId(userId), password };
}

export const auth = {
  register: (data: { fullName: string; email: string; phone: string; city: string; password: string }) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: LoginPayload) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  forgotPassword: (userId: string, email: string) =>
    request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        username: normalizeUserId(userId),
        email: email.trim(),
      }),
    }),
  resetPassword: (data: { token: string; newPassword: string }) =>
    request<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  me: () => request<AuthUser>("/auth/me"),
};

export const contact = {
  submitInquiry: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) =>
    request<{ message: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Packages ──
export interface RoiCycle {
  id: string;
  packageId: string;
  cycleNumber: number;
  scheduledDate: string;
  processedDate: string | null;
  roiAmount: string;
  status: "SCHEDULED" | "PROCESSED" | "FAILED";
}

export interface Package {
  id: string;
  userId: string;
  principalAmount: string;
  /** 10% plans: original principal for ROI math */
  originalAmount?: string;
  /** 10% plans: remaining principal after amortization ledger */
  currentPrincipal?: string;
  roiPercentage: string;
  roiCycleAmount: string;
  /** Canonical plan length in months (= ROI cycle count). */
  durationMonths: number;
  /** May be omitted on older API payloads; use `durationMonths`. */
  totalCycles?: number;
  cyclesCompleted: number;
  startDate: string;
  nextRoiDate: string;
  nextCycleDate?: string;
  lastCycleDate?: string | null;
  cycleMode?: string;
  maturityDate: string;
  principalWithdrawnAmount: string;
  status: "ACTIVE" | "MATURED" | "CLOSED";
  /** Legacy migration: original userCode for this package row (packages are never merged). */
  legacyUserCode?: string | null;
  legacyPkgCnt?: number | null;
  roiCycles?: RoiCycle[];
  user?: { id: string; fullName: string; email: string | null; phone: string | null };
}

export interface PackageFilters {
  status?: string;
  roiPercentage?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export const packages = {
  list: (filters?: PackageFilters) =>
    request<PaginatedResponse<Package[]>>(`/packages${buildQs(filters as any)}`).then((res) => res.data),
  getById: (id: string) => request<Package>(`/packages/${id}`),
  maturity: (id: string) => request<any>(`/packages/${id}/maturity`),
  roiCycles: (id: string) => request<RoiCycle[]>(`/packages/${id}/roi-cycles`),
};

// ── Wallet ──
export interface WalletTransaction {
  id: string;
  userId: string;
  /** Physical ledger type: ROI (10% plans), ROI_CREDIT, PAYOUT_DEBIT, PRINCIPAL */
  type: "ROI_CREDIT" | "PAYOUT_DEBIT" | "ROI" | "PRINCIPAL" | string;
  amount: string;
  direction: "CREDIT" | "DEBIT";
  packageId?: string | null;
  payoutRequestId?: string | null;
  /** API compatibility: packageId ?? payoutRequestId */
  referenceId?: string | null;
  /** Linked plan for ROI credits (from backend enrichment). */
  package?: LedgerPackageSummary | null;
  description: string | null;
  createdAt: string;
  autoPayoutRequestCreated?: boolean;
  roiCycleNumber?: number | null;
}

export interface WalletData {
  availableBalance: number;
  totalRoiCredited?: number;
  transactions: WalletTransaction[];
  total?: number;
  page?: number;
  limit?: number;
}

export type WalletFilters = WalletUiFilters;

export interface WalletLedgerResponse {
  total: number;
  page: number;
  limit: number;
  data: WalletTransaction[];
}

async function fetchWalletData(path: string, filters?: WalletFilters): Promise<WalletData> {
  const qs = buildQs(toWalletApiParams(filters));
  const res = await request<WalletData | WalletLedgerResponse>(`${path}${qs}`);
  if ("data" in res && Array.isArray(res.data)) {
    return {
      availableBalance: 0,
      transactions: res.data,
      total: res.total,
      page: res.page,
      limit: res.limit,
    };
  }
  return res as WalletData;
}

export const wallet = {
  get: (filters?: WalletFilters) =>
    request<WalletData>(`/user/wallet${buildQs(toWalletApiParams(filters))}`),
  /** Admin can pass userId; supports server-side activity type + date filters. */
  getLedger: async (filters?: WalletFilters): Promise<WalletData> =>
    fetchWalletData("/wallet/ledger", { limit: 200, ...filters }),
};

// ── Bank Details ──
export interface BankDetails {
  id: string;
  userId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType?: "saving" | "current";
  aadharNumber?: string;
  panNumber?: string;
  aadharDocumentUrl?: string;
  panDocumentUrl?: string;
  verificationStatus?: "pending" | "verified" | "rejected";
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BankVerificationStatus = "pending" | "verified" | "rejected";

export function normalizeBankVerificationStatus(
  status?: string | null,
): BankVerificationStatus {
  const value = (status ?? "pending").toLowerCase();
  if (value === "verified" || value === "rejected") return value;
  return "pending";
}

export { bankVerificationStatusLabel } from "@/lib/language";

export interface BankDetailsSavePayload {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: "saving" | "current";
  panNumber: string;
  panDocument?: File;
}

export const bankDetails = {
  get: () => request<BankDetails | null>("/user/bank-details", { nullOn404: true }),
  save: (data: BankDetailsSavePayload) => {
    const formData = new FormData();
    formData.append("accountHolderName", data.accountHolderName);
    formData.append("bankName", data.bankName);
    formData.append("accountNumber", data.accountNumber);
    formData.append("ifscCode", data.ifscCode);
    formData.append("accountType", data.accountType);
    formData.append("panNumber", data.panNumber);
    if (data.panDocument) formData.append("panDocument", data.panDocument);
    return uploadRequest<BankDetails>("/user/bank-details", formData);
  },
};

/** Shared React Query options — one fetch per user, cached for 60s. */
export function bankDetailsQueryOptions(userId: string | undefined) {
  return {
    queryKey: ["bank-details", userId] as const,
    queryFn: () => bankDetails.get(),
    enabled: Boolean(userId),
    staleTime: 60_000,
  };
}

// ── Payouts ──
export interface PayoutBankAccount {
  holderName: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  accountType?: "SAVING" | "CURRENT" | string;
}

export interface PayoutRequest {
  id: string;
  userId: string;
  packageId: string | null;
  requestType: "ROI" | "PRINCIPAL";
  amount: string;
  status: "PENDING" | "PROCESSED" | "REJECTED";
  sourceType?: "MANUAL" | "AUTO_PAY";
  requestedAt: string;
  processedAt: string | null;
  processedBy: string | null;
  rejectionReason: string | null;
  package?: any;
  user?: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    bankAccounts?: PayoutBankAccount[];
  };
}

interface PaginatedResponse<T> {
  data: T;
  page: number;
  limit: number;
  total: number;
}

export interface PayoutFilters {
  status?: string;
  type?: string;
  sourceType?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const payouts = {
  create: (data: { requestType: string; amount: number; packageId?: string }) =>
    request<PayoutRequest>("/payouts", { method: "POST", body: JSON.stringify(data) }),
  list: (params?: PayoutFilters) => {
    return request<PaginatedResponse<PayoutRequest[]>>(`/payouts${buildQs(params as any)}`).then((res) => res.data);
  },
  getById: (id: string) => request<PayoutRequest>(`/payouts/${id}`),
};

// ── Profile ──
export const profile = {
  get: () => request<AuthUser>("/user/profile"),
  update: (data: { name: string; email?: string; phone?: string; city?: string }) =>
    request<AuthUser>("/user/profile", { method: "PATCH", body: JSON.stringify(data) }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>("/user/change-password", { method: "PATCH", body: JSON.stringify(data) }),
};

// ── KYC (address, nominee, date of birth) ──
export interface KycDetails {
  id?: string;
  userId?: string;
  nomineeName?: string | null;
  nomineeRelation?: string | null;
  address?: string | null;
  state?: string | null;
  district?: string | null;
  pincode?: string | null;
  dateOfBirth?: string | null;
}

export interface KycAddressUpdatePayload {
  dateOfBirth?: string;
  address?: string;
  state?: string;
  district?: string;
  pincode?: string;
  nomineeName?: string;
  nomineeRelation?: string;
}

export const kyc = {
  get: () => request<KycDetails>("/kyc"),
  update: (data: KycAddressUpdatePayload) =>
    request<KycDetails>("/kyc", { method: "PUT", body: JSON.stringify(data) }),
};

// ── Admin ──
export interface AdminSummary {
  totalUsers: number;
  totalActivePackages: number;
  totalPendingPayouts: number;
  totalRoiLiability: number;
}

export interface AdminFinancialSummary {
  totalInvestment: number;
  totalRoiGenerated: number;
  totalPayouts: number;
  currentLiability: number;
}

export interface AdminUser {
  id: string;
  name: string;
  username?: string | null;
  email: string | null;
  role: string;
  totalPackages: number;
  currentBalance: number;
  totalRewardsCredited: number;
  autoPayMode?: string;
}

export interface AdminUserFilters {
  search?: string;
  role?: string;
  autoPayMode?: string;
  page?: number;
  limit?: number;
}

export interface AdminPackage {
  packageId: string;
  userName: string;
  userEmail: string | null;
  userId: string;
  principalAmount: number;
  roiPercentage: number;
  assignedDate: string;
  nextRoiDate: string;
  nextCycleDate?: string;
  lastCycleDate?: string | null;
  cycleMode?: string;
  maturityDate: string;
  cyclesCompleted: number;
  totalCycles: number;
  durationMonths?: number;
  status: string;
}

export interface AdminPackageFilters {
  userId?: string;
  status?: string;
  roiPercentage?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface AdminPayoutFilters {
  status?: string;
  type?: string;
  sourceType?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface AdminRoiLogFilters {
  runType?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export type RoiRunType = "MANUAL" | "CRON";
export type RoiProcessingStatus = "PROCESSING" | "SUCCESS" | "FAILED";

export interface RoiProcessingLog {
  id: string;
  runType: RoiRunType;
  startedAt: string;
  completedAt: string | null;
  packagesProcessed: number;
  roiCreditsCreated: number;
  autoPayoutsCreated: number;
  errorsCount: number;
  status: RoiProcessingStatus;
}

export interface RoiLogCreditedPackage {
  packageId: string;
  userId: string;
  userName: string;
  userEmail: string | null;
  username?: string | null;
  principalAmount: string;
  roiPercentage: string;
  cycleNumber: number | null;
  roiAmount: string | null;
  creditedAt: string;
}

export type AdminWalletFilters = WalletUiFilters;

export type SystemSettingType = "STRING" | "BOOLEAN" | "NUMBER" | "JSON";

export interface SystemSetting {
  key: string;
  value: string;
  type: SystemSettingType;
  category: string | null;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CycleModeValue = "FIXED_DAYS" | "CALENDAR_MONTHLY";

export interface SimulateInput {
  principalAmount: number;
  roiPercentage: number;
  durationMonths?: number;
  startDate?: string;
  cycleMode?: CycleModeValue;
  daysBetweenCycles?: number;
  autoPayMode: "NONE" | "HALF" | "FULL";
}

export interface SimulatedCycleRow {
  cycleNumber: number;
  month: number;
  cycleDate: string | null;
  scheduledDate: string | null;
  isLastCycle: boolean;
  roiAmount: number;
  reward: number;
  principalDeduction: number;
  adjustment: number;
  principalBeforeCycle: number;
  remainingPrincipal: number;
  remainingBalance: number;
  autoPay: {
    mode: "NONE" | "HALF" | "FULL";
    payoutAmount: number;
  };
  walletCreditNet: number;
}

export interface SimulationResult {
  inputs: SimulateInput;
  summary: {
    isTenPercentPlan: boolean;
    durationMonths: number;
    totalCycles: number;
    cycleMode: CycleModeValue;
    daysBetweenCycles: number;
    monthlyRoiAmount: number;
    monthlyPrincipalDeduction: number;
    totalRoiPayout: number;
    totalPrincipalReturn: number;
    totalAutoPayProjected: number;
    walletNetAfterAutoPay: number;
    maturityDate: string | null;
    initialNextRoiDate: string | null;
  };
  cycles: SimulatedCycleRow[];
  validation: {
    passed: boolean;
    warnings: string[];
  };
}

export const admin = {
  summary: () => request<AdminSummary>("/admin/summary"),
  financialSummary: () => request<AdminFinancialSummary>("/admin/financial-summary"),
  users: (filters?: AdminUserFilters) =>
    request<PaginatedResponse<AdminUser[]>>(`/admin/users${buildQs(filters as any)}`).then((res) => res.data),
  packages: async (filters?: AdminPackageFilters) => {
    const res = await request<AdminPackage[] | PaginatedResponse<AdminPackage[]>>(`/admin/packages${buildQs(filters as any)}`);
    return Array.isArray(res) ? res : res.data;
  },
  payoutsAll: (params?: AdminPayoutFilters) => {
    return request<PaginatedResponse<PayoutRequest[]>>(`/payouts/admin/all${buildQs(params as any)}`).then(
      (res) => res.data,
    );
  },
  roiLogs: (filters?: AdminRoiLogFilters) =>
    request<PaginatedResponse<RoiProcessingLog[]>>(`/admin/roi-logs${buildQs(filters as any)}`),
  roiLogPackages: (logId: string) =>
    request<{ data: RoiLogCreditedPackage[] }>(`/admin/roi-logs/${logId}/packages`),
  processPayout: (id: string, data: { status: string; rejectionReason?: string }) =>
    request<PayoutRequest>(`/payouts/${id}/process`, { method: "PATCH", body: JSON.stringify(data) }),
  assignPackage: (data: { userId: string; principalAmount: number; roiPercentage: number }) =>
    request<Package>("/packages/assign", { method: "POST", body: JSON.stringify(data) }),
  updatePackage: (id: string, data: { status: string }) =>
    request<Package>(`/packages/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  triggerRoi: () => request<{ processed: number; message: string }>("/roi-engine/process", { method: "POST" }),
  userWallet: (userId: string, filters?: AdminWalletFilters) =>
    request<WalletData>(`/admin/users/${userId}/wallet${buildQs(filters as any)}`),
  configureAutopay: (userId: string, data: { autoPayMode: string }) =>
    request<AuthUser>(`/admin/users/${userId}/autopay`, { method: "PATCH", body: JSON.stringify(data) }),
  userBankDetails: (userId: string) =>
    request<BankDetails | null>(`/admin/users/${userId}/bank-details`),
  verifyUserBankDetails: (
    userId: string,
    data: { status: "VERIFIED" | "REJECTED"; rejectionReason?: string },
  ) =>
    request<BankDetails>(`/admin/users/${userId}/bank-details/verify`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  updateAssignmentDate: (id: string, data: { assignedDate: string }) =>
    request<any>(`/admin/packages/${id}/assignment-date`, { method: "PATCH", body: JSON.stringify(data) }),
  cancelPackage: (id: string) =>
    request<any>(`/packages/${id}/cancel`, { method: "PATCH" }),
  settings: () => request<SystemSetting[]>("/admin/settings"),
  updateSetting: (key: string, value: string) =>
    request<SystemSetting>(`/admin/settings/${encodeURIComponent(key)}`, {
      method: "PATCH",
      body: JSON.stringify({ value }),
    }),
  simulate: (data: SimulateInput) =>
    request<SimulationResult>("/admin/simulate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
