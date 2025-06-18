"use client";

import { useEffect, useState, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { AdminTableBase } from "@/components/admin/admin-table-base";
import { UserAvatarCell } from "@/components/admin/user-avatar-cell";

interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  paymentMethod?: string;
  stripePaymentIntentId?: string;
  subscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentsResponse {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function PaymentManagementTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);

  const fetchPayments = async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
        ...(status !== "all" && { status }),
      });

      const response = await fetch(`/api/admin/payments?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data: PaymentsResponse = await response.json();
      setPayments(data.payments);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setTotalPayments(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPayments(page, searchTerm, statusFilter);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "secondary";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "cancelled":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Assuming amounts are in cents
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openStripePayment = (paymentIntentId: string) => {
    // This would open the Stripe dashboard for the specific payment
    // In a real implementation, you'd construct the proper Stripe dashboard URL
    window.open(
      `https://www.creem.io/dashboard/payments/${paymentIntentId}`,
      "_blank",
    );
  };

  const columns: Array<{
    key: keyof Payment | string;
    label: string;
    render?: (item: Payment) => ReactNode;
  }> = [
    {
      key: "user",
      label: "User",
      render: (payment: Payment) => (
        <UserAvatarCell name={payment.userName} email={payment.userEmail} />
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (payment: Payment) => (
        <div className="font-medium">
          {formatCurrency(payment.amount, payment.currency)}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (payment: Payment) => (
        <Badge
          variant={getStatusBadgeVariant(payment.status)}
          className="capitalize"
        >
          {payment.status}
        </Badge>
      ),
    },
    {
      key: "method",
      label: "Method",
      render: (payment: Payment) => (
        <div className="text-sm">{payment.paymentMethod || "N/A"}</div>
      ),
    },
    {
      key: "created",
      label: "Created",
      render: (payment: Payment) => formatDate(payment.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (payment: Payment) =>
        payment.stripePaymentIntentId && (
          <button
            onClick={() => openStripePayment(payment.stripePaymentIntentId!)}
            className="text-blue-600 hover:text-blue-800"
            title="View in Stripe Dashboard"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        ),
    },
  ];

  const statusFilterOptions = [
    { value: "all", label: "All Statuses" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-4">
      <AdminTableBase<Payment>
        data={payments}
        columns={columns}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search by user name, email, or payment ID..."
        filterValue={statusFilter}
        onFilterChange={handleStatusFilter}
        filterOptions={statusFilterOptions}
        filterPlaceholder="Filter by status"
        pagination={{
          page: currentPage,
          limit: 20, // Assuming a default limit, adjust if necessary
          total: totalPayments,
          totalPages: totalPages,
        }}
        onPageChange={handlePageChange}
        emptyMessage="No payments found"
      />
    </div>
  );
}
