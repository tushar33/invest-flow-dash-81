import type { AuthUser } from "@/lib/api";

export type OnboardingStatus = AuthUser["onboardingStatus"];

/**
 * Temporary: skip KYC/bank verification gates (menus, routes, login redirect).
 * Set to false when verification should be enforced again.
 */
const BYPASS_ONBOARDING_VERIFICATION = true;

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
