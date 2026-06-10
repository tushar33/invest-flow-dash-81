import type { AuthUser } from "@/lib/api";

export type OnboardingStatus = AuthUser["onboardingStatus"];

/**
 * Onboarding and bank verification bypass helpers.
 *
 * Flags are temporary — see doc/VERIFICATION_BYPASS.md in the repo root.
 * Backend mirrors the same flags in backend/src/common/constants/verification-bypass.ts
 */
const BYPASS_ONBOARDING_VERIFICATION = true;

/** Must match backend BYPASS_BANK_VERIFICATION. See doc/VERIFICATION_BYPASS.md */
export const BYPASS_BANK_VERIFICATION = true;

export function isBankVerifiedForUser(
  bank: { verificationStatus?: string | null } | null | undefined,
): boolean {
  if (!bank) return false;
  if (BYPASS_BANK_VERIFICATION) return true;
  return bank.verificationStatus?.toLowerCase() === "verified";
}

export function isOnboardingComplete(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  if (BYPASS_ONBOARDING_VERIFICATION) return true;
  if (user.role === "ADMIN") return true;
  return user.onboardingStatus === "APPROVED";
}

export function getPostAuthPath(user: AuthUser): string {
  if (user.role === "ADMIN") return "/admin";
  if (BYPASS_ONBOARDING_VERIFICATION) return "/dashboard";
  switch (user.onboardingStatus) {
    case "BANK_PENDING":
    case "VERIFICATION_PENDING":
      return "/bank-details";
    default:
      return "/dashboard";
  }
}
