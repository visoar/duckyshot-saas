import { requireAdmin } from "@/lib/auth/permissions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardPageWrapper } from "../../_components/dashboard-page-wrapper";
import { createMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import { PaymentStatsCards } from "./_components/payment-stats-cards";
import { PaymentManagementTable } from "./_components/payment-management-table";

export const metadata = createMetadata({
  title: "Payment Management",
  description: "Monitor and manage all payment transactions",
});

export default async function PaymentsPage() {
  await requireAdmin();

  return (
    <DashboardPageWrapper
      title="Payment Management"
      parentTitle="Admin Dashboard"
      parentUrl="/dashboard/admin"
    >
      {/* Payment Stats */}
      <Suspense fallback={<PaymentStatsCardsSkeleton />}>
        <PaymentStatsCards />
      </Suspense>

      {/* Payment Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
          <CardDescription>
            View and manage payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={<div className="bg-muted h-96 animate-pulse rounded" />}
          >
            <PaymentManagementTable />
          </Suspense>
        </CardContent>
      </Card>
    </DashboardPageWrapper>
  );
}

function PaymentStatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            <div className="bg-muted h-4 w-4 animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="bg-muted mb-1 h-8 w-16 animate-pulse rounded" />
            <div className="bg-muted h-3 w-32 animate-pulse rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
