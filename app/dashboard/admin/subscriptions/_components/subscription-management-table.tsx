"use client";

import { useEffect, useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, X } from "lucide-react";
import { toast } from "sonner";
import { AdminTableBase } from "@/components/admin/admin-table-base";
import { UserAvatarCell } from "@/components/admin/user-avatar-cell";

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  status: "active" | "cancelled" | "past_due" | "trialing" | "incomplete";
  planName?: string;
  planPrice?: number;
  currency: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  creemSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionsResponse {
  subscriptions: Subscription[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function SubscriptionManagementTable() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [cancellingSubscription, setCancellingSubscription] =
    useState<Subscription | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const fetchSubscriptions = async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
        ...(status !== "all" && { status }),
      });

      const response = await fetch(`/api/admin/subscriptions?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }

      const data: SubscriptionsResponse = await response.json();
      setSubscriptions(data.subscriptions);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setTotalSubscriptions(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions(currentPage, searchTerm, statusFilter);
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
    fetchSubscriptions(page, searchTerm, statusFilter);
  };

  const handleCancelSubscription = (subscription: Subscription) => {
    setCancellingSubscription(subscription);
    setIsCancelDialogOpen(true);
  };

  const confirmCancelSubscription = async () => {
    if (!cancellingSubscription) return;

    try {
      // In a real implementation, you would call your subscription cancellation API
      // For now, we'll just show a toast
      toast.success(
        `Subscription for ${cancellingSubscription.userName} has been cancelled`,
      );
      setIsCancelDialogOpen(false);
      setCancellingSubscription(null);
      fetchSubscriptions(currentPage, searchTerm, statusFilter);
    } catch {
      toast.error("Failed to cancel subscription");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "trialing":
        return "secondary";
      case "cancelled":
        return "outline";
      case "past_due":
        return "destructive";
      case "incomplete":
        return "destructive";
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
    });
  };

  const columns: Array<{
    key: keyof Subscription | string;
    label: string;
    render?: (item: Subscription) => ReactNode;
  }> = [
    {
      key: "user",
      label: "User",
      render: (subscription: Subscription) => (
        <UserAvatarCell
          name={subscription.userName}
          email={subscription.userEmail}
          image={subscription.userImage}
        />
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (subscription: Subscription) => (
        <div>
          <div className="font-medium">{subscription.planName}</div>
          <div className="text-muted-foreground text-sm">
            {subscription.planPrice
              ? formatCurrency(subscription.planPrice, subscription.currency)
              : "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (subscription: Subscription) => (
        <Badge
          variant={getStatusBadgeVariant(subscription.status)}
          className="capitalize"
        >
          {subscription.status}
        </Badge>
      ),
    },
    {
      key: "period",
      label: "Period",
      render: (subscription: Subscription) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(subscription.currentPeriodStart)}
          </div>
          <div className="text-muted-foreground">
            to {formatDate(subscription.currentPeriodEnd)}
          </div>
        </div>
      ),
    },
    {
      key: "created",
      label: "Created",
      render: (subscription: Subscription) =>
        formatDate(subscription.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (subscription: Subscription) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCancelSubscription(subscription)}
          disabled={subscription.status === "cancelled"}
        >
          <X className="mr-1 h-4 w-4" />
          Cancel
        </Button>
      ),
    },
  ];

  const statusFilterOptions = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "trialing", label: "Trialing" },
    { value: "cancelled", label: "Cancelled" },
    { value: "past_due", label: "Past Due" },
    { value: "incomplete", label: "Incomplete" },
  ];

  return (
    <div className="space-y-4">
      <AdminTableBase<Subscription>
        data={subscriptions}
        columns={columns}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search by user name, email, or subscription ID..."
        filterValue={statusFilter}
        onFilterChange={handleStatusFilter}
        filterOptions={statusFilterOptions}
        filterPlaceholder="Filter by status"
        pagination={{
          page: currentPage,
          limit: 20, // Assuming a default limit, adjust if necessary
          total: totalSubscriptions,
          totalPages: totalPages,
        }}
        onPageChange={handlePageChange}
        emptyMessage="No subscriptions found"
      />

      {/* Cancel Subscription Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the subscription for{" "}
              {cancellingSubscription?.userName}? This action cannot be undone
              and the user will lose access at the end of their current billing
              period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmCancelSubscription}>
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
