const API_BASE = "https://web-wheat-nine-77.vercel.app/api";

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function setToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export function clearToken() {
  localStorage.removeItem("auth_token");
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
  roiPercentage: string;
  roiCycleAmount: string;
  totalCycles: number;
  cyclesCompleted: number;
  startDate: string;
  nextRoiDate: string;
  maturityDate: string;
  principalWithdrawnAmount: string;
  status: "ACTIVE" | "MATURED" | "CLOSED";
  roiCycles?: RoiCycle[];
  user?: { id: string; fullName: string; email: string | null; phone: string | null };
}

export const packages = {
  list: () => request<Package[]>("/packages"),
  getById: (id: string) => request<Package>(`/packages/${id}`),
  maturity: (id: string) => request<any>(`/packages/${id}/maturity`),
  roiCycles: (id: string) => request<RoiCycle[]>(`/packages/${id}/roi-cycles`),
};

// ── Wallet ──
export interface WalletTransaction {
  id: string;
  userId: string;
  type: "ROI_CREDIT" | "PAYOUT_DEBIT" | "PRINCIPAL_DEBIT";
  amount: string;
  direction: "CREDIT" | "DEBIT";
  referenceId: string | null;
  description: string | null;
  createdAt: string;
}

export interface WalletData {
  availableBalance: number;
  transactions: WalletTransaction[];
}

export const wallet = {
  get: () => request<WalletData>("/user/wallet"),
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

export const payouts = {
  create: (data: { requestType: string; amount: number; packageId?: string }) =>
    request<PayoutRequest>("/payouts", { method: "POST", body: JSON.stringify(data) }),
  list: (params?: { type?: string; sourceType?: string }) => {
    const qs = new URLSearchParams();
    if (params?.type) qs.set("type", params.type);
    if (params?.sourceType) qs.set("sourceType", params.sourceType);
    const q = qs.toString();
    return request<PayoutRequest[]>(`/payouts${q ? `?${q}` : ""}`);
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
  status: string;
}

export const admin = {
  summary: () => request<AdminSummary>("/admin/summary"),
  financialSummary: () => request<AdminFinancialSummary>("/admin/financial-summary"),
  users: () => request<AdminUser[]>("/admin/users"),
  packages: () => request<AdminPackage[]>("/admin/packages"),
  payoutsAll: (params?: { status?: string; type?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.type) qs.set("type", params.type);
    const q = qs.toString();
    return request<PayoutRequest[]>(`/payouts/admin/all${q ? `?${q}` : ""}`);
  },
  processPayout: (id: string, data: { status: string; rejectionReason?: string }) =>
    request<PayoutRequest>(`/payouts/${id}/process`, { method: "PATCH", body: JSON.stringify(data) }),
  assignPackage: (data: { userId: string; principalAmount: number; roiPercentage: number }) =>
    request<Package>("/packages/assign", { method: "POST", body: JSON.stringify(data) }),
  updatePackage: (id: string, data: { status: string }) =>
    request<Package>(`/packages/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  triggerRoi: () => request<{ processed: number; message: string }>("/roi-engine/process", { method: "POST" }),
  userWallet: (userId: string) => request<WalletData>(`/admin/users/${userId}/wallet`),
  configureAutopay: (userId: string, data: { autoPayMode: string }) =>
    request<AuthUser>(`/admin/users/${userId}/autopay`, { method: "PATCH", body: JSON.stringify(data) }),
  updateAssignmentDate: (id: string, data: { assignedDate: string }) =>
    request<any>(`/admin/packages/${id}/assignment-date`, { method: "PATCH", body: JSON.stringify(data) }),
};
