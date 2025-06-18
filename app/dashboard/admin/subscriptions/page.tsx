import { requireAdmin } from "@/lib/auth/permissions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { Metadata } from "next";
import { Suspense } from "react";
import { SubscriptionStatsCards } from "./_components/subscription-stats-cards";
import { SubscriptionManagementTable } from "./_components/subscription-management-table";

export const metadata: Metadata = {
  title: {
    default: "Subscription Management",
    template: "%s | Subscription Management",
  },
  description: "Monitor and manage all user subscriptions",
};

export default async function SubscriptionsPage() {
  await requireAdmin();

  return (
    <>
      <DashboardPageHeader
        title="Subscription Management"
        parentTitle="Admin Dashboard"
        parentUrl="/dashboard/admin"
        description="Monitor and manage all user subscriptions"
      />
      <section className="space-y-6 px-4 py-2">
        {/* Subscription Stats */}
        <Suspense fallback={<SubscriptionStatsCardsSkeleton />}>
          <SubscriptionStatsCards />
        </Suspense>

        {/* Subscription Management Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions</CardTitle>
            <CardDescription>
              View and manage user subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={<div className="bg-muted h-96 animate-pulse rounded" />}
            >
              <SubscriptionManagementTable />
            </Suspense>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function SubscriptionStatsCardsSkeleton() {
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
