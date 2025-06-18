import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/permissions";
import { DashboardPageHeader } from "../_components/dashboard-page-header";
import { Metadata } from "next";

import { AdminStatsCards } from "./_components/admin-stats-cards";
import { RecentUsersChart } from "./_components/recent-users-chart";
import { RevenueChart } from "./_components/revenue-chart";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin Dashboard",
  },
  description:
    "Administrative dashboard for managing users, payments, and system overview",
};

export default async function AdminDashboardPage() {
  // Require admin authentication
  await requireAdmin();

  return (
    <>
      <DashboardPageHeader
        title="Admin Dashboard"
      />
      <section className="space-y-6 px-4 py-2">
        {/* Stats Cards */}
        <AdminStatsCards />

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                New user registrations over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Suspense
                fallback={
                  <div className="bg-muted h-[300px] animate-pulse rounded" />
                }
              >
                <RecentUsersChart />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue and payment trends
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense
              fallback={
                <div className="bg-muted h-[400px] animate-pulse rounded" />
              }
            >
              <RevenueChart />
            </Suspense>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
