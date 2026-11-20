export const BUSINESS_CONTRIBUTORS = [
  { id: "ATUL", label: "Atul" },
  { id: "GOPAL", label: "Gopal" },
  { id: "TUSHAR", label: "Tushar" },
  { id: "PRAVIN", label: "Pravin" },
] as const;

export const LEGACY_CONTRIBUTOR = "LEGACY";
export const LEGACY_CONTRIBUTOR_LABEL = "Legacy / Unknown";

export function businessContributorLabel(id?: string | null): string {
  return BUSINESS_CONTRIBUTORS.find((contributor) => contributor.id === id)?.label
    ?? LEGACY_CONTRIBUTOR_LABEL;
}
