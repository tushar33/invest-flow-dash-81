// Base URL for the backend API.
const DEFAULT_LOCAL_API_BASE = "http://localhost:3000";
const DEFAULT_PROD_API_BASE = "https://roi-backend-fiyp.onrender.com";
const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const API_BASE = import.meta.env.VITE_API_BASE ?? (isLocalHost ? DEFAULT_LOCAL_API_BASE : DEFAULT_PROD_API_BASE);

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearToken() {
  localStorage.removeItem("auth_token");
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

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    const msg = Array.isArray(body.message) ? body.message.join(", ") : body.message;
    throw new Error(msg || `Request failed (${res.status})`);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

// ── Auth ──
export interface AuthUser {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: "USER" | "ADMIN";
  autoPayMode: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export const auth = {
  register: (data: { fullName: string; email?: string; phone?: string; password: string }) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email?: string; phone?: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => request<AuthUser>("/auth/me"),
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
  maturityDate: string;
  principalWithdrawnAmount: string;
  status: "ACTIVE" | "MATURED" | "CLOSED";
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

export interface WalletFilters {
  type?: string;
  from?: string;
  to?: string;
  packageId?: string;
  page?: number;
  limit?: number;
}

export const wallet = {
  get: (filters?: WalletFilters) => request<WalletData>(`/user/wallet${buildQs(filters as any)}`),
};

// ── Bank Details ──
export interface BankDetails {
  id: string;
  userId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  createdAt: string;
  updatedAt: string;
}

export const bankDetails = {
  get: () => request<BankDetails | null>("/user/bank-details"),
  save: (data: { accountHolderName: string; bankName: string; accountNumber: string; ifscCode: string }) =>
    request<BankDetails>("/user/bank-details", { method: "POST", body: JSON.stringify(data) }),
};

// ── Payouts ──
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
  update: (data: { name: string; phone?: string }) =>
    request<AuthUser>("/user/profile", { method: "PATCH", body: JSON.stringify(data) }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<{ message: string }>("/user/change-password", { method: "PATCH", body: JSON.stringify(data) }),
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
  email: string | null;
  role: string;
  totalPackages: number;
  currentBalance: number;
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

export interface AdminWalletFilters {
  type?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
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
  roiLogs: (filters?: AdminRoiLogFilters) => {
    return request<any>(`/admin/roi-logs${buildQs(filters as any)}`);
  },
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
  updateAssignmentDate: (id: string, data: { assignedDate: string }) =>
    request<any>(`/admin/packages/${id}/assignment-date`, { method: "PATCH", body: JSON.stringify(data) }),
  cancelPackage: (id: string) =>
    request<any>(`/packages/${id}/cancel`, { method: "PATCH" }),
};
