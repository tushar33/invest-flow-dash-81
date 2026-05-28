import type { AuthUser } from "@/lib/api";

export type OnboardingStatus = AuthUser["onboardingStatus"];

export function isOnboardingComplete(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return user.onboardingStatus === "APPROVED";
}

export function getPostAuthPath(user: AuthUser): string {
  if (user.role === "ADMIN") return "/admin";
  switch (user.onboardingStatus) {
    case "BANK_PENDING":
    case "VERIFICATION_PENDING":
      return "/bank-details";
    default:
      return "/dashboard";
  }
}
