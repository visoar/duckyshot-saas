import { useState, useEffect, useCallback, useRef } from "react";
import { useDebounce } from "use-debounce";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseAdminTableProps<T> {
  apiEndpoint: string;
  dataKey: string;
  filterKey?: string;
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
  initialFilter?: string;
  initialData?: T[];
  initialPagination?: Pagination;
}

interface UseAdminTableReturn<T> {
  data: T[];
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filter: string;
  setSearchTerm: (term: string) => void;
  setFilter: (filter: string) => void;
  setCurrentPage: (page: number) => void;
  refresh: () => void;
}

export function useAdminTable<T>({
  apiEndpoint,
  dataKey,
  filterKey = "status",
  initialPage = 1,
  initialLimit = 20,
  initialSearch = "",
  initialFilter = "all",
  initialData,
  initialPagination,
}: UseAdminTableProps<T>): UseAdminTableReturn<T> {
  const [data, setData] = useState<T[]>(initialData || []);
  const [pagination, setPagination] = useState<Pagination>(
    initialPagination || {
      page: initialPage,
      limit: initialLimit,
      total: 0,
      totalPages: 1,
    },
  );
  const [loading, setLoading] = useState(!initialData); // Only load initially if no initialData
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filter, setFilter] = useState(initialFilter);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const isInitialMount = useRef(true);

  const fetchData = useCallback(
    async (isRefetch = false) => {
      // Don't fetch on initial mount if initialData is provided
      if (isInitialMount.current && initialData && !isRefetch) {
        isInitialMount.current = false;
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: initialLimit.toString(),
        });
        if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
        if (filter !== "all") params.set(filterKey, filter);

        const response = await fetch(`${apiEndpoint}?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${apiEndpoint}`);
        }
        const result = await response.json();
        setData(result[dataKey] || []);
        setPagination(result.pagination);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    },
    [
      apiEndpoint,
      dataKey,
      currentPage,
      initialLimit,
      debouncedSearchTerm,
      filter,
      filterKey,
      initialData, // Add initialData to dependency array
    ],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page to 1 when search or filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, filter]);

  return {
    data,
    pagination,
    loading,
    error,
    searchTerm,
    filter,
    setSearchTerm,
    setFilter,
    setCurrentPage,
    refresh: () => fetchData(true), // Pass true to force a refetch
  };
}
