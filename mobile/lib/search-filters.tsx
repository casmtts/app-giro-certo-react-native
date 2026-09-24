import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { SearchFilters } from "@/lib/types";

type SearchFiltersContextValue = {
  filters: SearchFilters;
  updateFilters: (patch: Partial<SearchFilters>) => void;
  clearFilters: () => void;
};

const SearchFiltersContext = createContext<SearchFiltersContextValue | null>(null);

export function SearchFiltersProvider({ children }: React.PropsWithChildren) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const updateFilters = useCallback((patch: Partial<SearchFilters>) => {
    setFilters((current) => {
      const next = { ...current, ...patch };
      Object.keys(next).forEach((key) => {
        if (next[key as keyof SearchFilters] === undefined || next[key as keyof SearchFilters] === "") {
          delete next[key as keyof SearchFilters];
        }
      });
      return next;
    });
  }, []);
  const clearFilters = useCallback(() => setFilters({}), []);
  const value = useMemo(() => ({ filters, updateFilters, clearFilters }), [filters, updateFilters, clearFilters]);
  return <SearchFiltersContext.Provider value={value}>{children}</SearchFiltersContext.Provider>;
}

export function useSearchFilters() {
  const value = useContext(SearchFiltersContext);
  if (!value) throw new Error("useSearchFilters deve ser usado dentro de SearchFiltersProvider.");
  return value;
}
