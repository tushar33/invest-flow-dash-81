import { useQuery } from "@tanstack/react-query";
import { type Package, packages } from "@/lib/api";
import { formatPackageFilterLabel } from "@/lib/package-label";

export function formatPlanFilterLabel(pkg: Package): string {
  return formatPackageFilterLabel(pkg);
}

export function usePlanFilterOptions(userId?: string, enabled = true) {
  return useQuery({
    queryKey: ["plan-filter-options", userId ?? "self"],
    queryFn: () =>
      packages.list({
        userId: userId || undefined,
        limit: 100,
      }),
    enabled,
    select: (rows) =>
      [...rows]
        .sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        )
        .map((pkg) => ({
          value: pkg.id,
          label: formatPlanFilterLabel(pkg),
        })),
  });
}
