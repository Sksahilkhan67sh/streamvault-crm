import { useState, useCallback } from "react";

const DEFAULTS = { search: "", status: "all", source: "all", sort: "newest", page: 1 };

export function useLeadFilters() {
  const [filters, setFilters] = useState(DEFAULTS);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === "page" ? value : 1 }));
  }, []);

  const reset = useCallback(() => setFilters(DEFAULTS), []);

  // Build query params for API
  const toParams = () => {
    const p = { sort: filters.sort, page: filters.page, limit: 12 };
    if (filters.status !== "all") p.status = filters.status;
    if (filters.source !== "all") p.source = filters.source;
    if (filters.search) p.search = filters.search;
    return p;
  };

  return { filters, setFilter, reset, toParams };
}
