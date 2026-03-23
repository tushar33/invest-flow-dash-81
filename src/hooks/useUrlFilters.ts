import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

/**
 * Syncs filter state with URL query params.
 * Returns current params as a plain object and a setter.
 */
export function useUrlFilters<T extends Record<string, string>>(defaults: T) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: T = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const val = searchParams.get(key);
    if (val !== null) (filters as any)[key] = val;
  }

  const setFilters = useCallback(
    (updates: Partial<T>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([k, v]) => {
          if (v === undefined || v === null || v === "" || v === defaults[k]) {
            next.delete(k);
          } else {
            next.set(k, v as string);
          }
        });
        return next;
      }, { replace: true });
    },
    [setSearchParams, defaults]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters = Object.keys(defaults).some(
    (k) => searchParams.has(k) && searchParams.get(k) !== defaults[k]
  );

  return { filters, setFilters, resetFilters, hasActiveFilters };
}
