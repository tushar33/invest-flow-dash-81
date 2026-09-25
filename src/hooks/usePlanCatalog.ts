import { useQuery } from "@tanstack/react-query";
import { packages } from "@/lib/api";
import { setPlanCatalog, type AdminPlanOption } from "@/lib/plan-options";

export function usePlanCatalog() {
  return useQuery({
    queryKey: ["plan-catalog"],
    queryFn: async (): Promise<AdminPlanOption[]> => {
      const plans = await packages.listPlans();
      setPlanCatalog(plans);
      return plans;
    },
    staleTime: Infinity,
  });
}
