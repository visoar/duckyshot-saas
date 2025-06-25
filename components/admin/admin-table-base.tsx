"use client";

import { useState, useEffect, ReactNode, memo, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface TableColumn<T> {
  key: string;
  label: string | ReactNode;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface FilterOption {
  value: string;
  label: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AdminTableBaseProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

// Simple skeleton component
const TableSkeleton = memo(({ columnCount }: { columnCount: number }) => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        {Array.from({ length: columnCount }).map((_, j) => (
          <TableCell key={`skeleton-cell-${j}`}>
            <div className="bg-muted h-4 w-full animate-pulse rounded" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
));

TableSkeleton.displayName = 'TableSkeleton';

// Simple empty state component
const EmptyState = memo(({ 
  columnCount, 
  message 
}: { 
  columnCount: number; 
  message: string; 
}) => (
  <TableRow>
    <TableCell colSpan={columnCount} className="h-24 text-center">
      {message}
    </TableCell>
  </TableRow>
));

EmptyState.displayName = 'EmptyState';

// Pagination button component
const PaginationButton = memo(({ 
  pageNumber, 
  currentPage, 
  loading, 
  onClick 
}: {
  pageNumber: number;
  currentPage: number;
  loading: boolean;
  onClick: (page: number) => void;
}) => {
  const handleClick = useCallback(() => {
    onClick(pageNumber);
  }, [onClick, pageNumber]);

  return (
    <Button
      variant={currentPage === pageNumber ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={loading}
    >
      {pageNumber}
    </Button>
  );
});

PaginationButton.displayName = 'PaginationButton';

function AdminTableBaseComponent<T extends { id: string | number }>({
  columns,
  data,
  loading,
  error,
  searchTerm,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  filterPlaceholder = "Filter...",
  pagination,
  onPageChange,
  searchPlaceholder = "Search...",
  emptyMessage = "No data found",
}: AdminTableBaseProps<T>) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearchTerm !== searchTerm) {
        onSearchChange(debouncedSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, onSearchChange, searchTerm]);

  // Update internal state when external searchTerm changes
  useEffect(() => {
    setDebouncedSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearch = useCallback((value: string) => {
    setDebouncedSearchTerm(value);
  }, []);

  // Memoize pagination calculations
  const paginationInfo = useMemo(() => {
    const startItem = (pagination.page - 1) * pagination.limit + 1;
    const endItem = Math.min(pagination.page * pagination.limit, pagination.total);
    const showPagination = pagination.totalPages > 1;
    
    return {
      startItem,
      endItem,
      showPagination,
      total: pagination.total,
    };
  }, [pagination.page, pagination.limit, pagination.total, pagination.totalPages]);

  // Memoize pagination buttons
  const paginationButtons = useMemo(() => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;
    
    // Calculate visible page range
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if end page is at the limit
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
    
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [pagination.totalPages, pagination.page]);

  // Memoize navigation handlers
  const handlePreviousPage = useCallback(() => {
    if (pagination.page > 1) {
      onPageChange(pagination.page - 1);
    }
  }, [pagination.page, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      onPageChange(pagination.page + 1);
    }
  }, [pagination.page, pagination.totalPages, onPageChange]);

  // Memoize table rows to avoid re-rendering on every change
  const tableRows = useMemo(() => {
    return data.map((item) => (
      <TableRow key={item.id}>
        {columns.map((column) => (
          <TableCell key={column.key}>
            {column.render
              ? column.render(item)
              : column.key in item
                ? String(item[column.key as keyof T])
                : ""}
          </TableCell>
        ))}
      </TableRow>
    ));
  }, [data, columns]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder={searchPlaceholder}
            value={debouncedSearchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {filterOptions && onFilterChange && (
          <Select value={filterValue} onValueChange={onFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={filterPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>
                  {typeof column.label === "string"
                    ? column.label
                    : column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton columnCount={columns.length} />
            ) : data.length === 0 ? (
              <EmptyState columnCount={columns.length} message={emptyMessage} />
            ) : (
              <>{tableRows}</>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {paginationInfo.showPagination && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Showing {paginationInfo.startItem} to {paginationInfo.endItem} of{" "}
            {paginationInfo.total} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={pagination.page <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {paginationButtons.map((pageNumber) => (
                <PaginationButton
                  key={pageNumber}
                  pageNumber={pageNumber}
                  currentPage={pagination.page}
                  loading={loading}
                  onClick={onPageChange}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={pagination.page >= pagination.totalPages || loading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export memoized version with proper generic typing
export const AdminTableBase = memo(AdminTableBaseComponent) as <T extends { id: string | number }>(
  props: AdminTableBaseProps<T>
) => ReactNode;