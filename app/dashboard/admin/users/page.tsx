import { requireAdmin } from "@/lib/auth/permissions";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardPageHeader } from "../../_components/dashboard-page-header";
import { Metadata } from "next";
import { UserManagementTable } from "./_components/user-management-table";
import { UserStatsCards } from "./_components/user-stats-cards";

export const metadata: Metadata = {
  title: {
    default: "User Management",
    template: "%s | User Management",
  },
  description: "Manage user accounts, roles, and permissions",
};

export default async function UserManagementPage() {
  // Require admin authentication
  await requireAdmin();

  return (
    <>
      <DashboardPageHeader
        title="User Management"
        parentTitle="Admin Dashboard"
        parentUrl="/dashboard/admin"
        description="Manage user accounts, roles, and permissions"
      />
      <section className="space-y-6 px-4 py-2">
        {/* User Stats */}
        <Suspense fallback={<UserStatsCardsSkeleton />}>
          <UserStatsCards />
        </Suspense>

        {/* User Management Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Manage user accounts, roles, and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={<div className="bg-muted h-96 animate-pulse rounded" />}
            >
              <UserManagementTable />
            </Suspense>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function UserStatsCardsSkeleton() {
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
