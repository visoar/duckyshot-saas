import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/permissions";
import { DashboardPageWrapper } from "../../_components/dashboard-page-wrapper";
import { Metadata } from "next";
import { UploadManagementTable } from "./_components/upload-management-table";
import { UploadStatsCards } from "./_components/upload-stats-cards";

export const metadata: Metadata = {
  title: {
    default: "Upload Management",
    template: "%s | Upload Management",
  },
  description: "Manage user uploads, file storage, and content moderation",
};

function UploadStatsCardsSkeleton() {
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
            <div className="bg-muted h-3 w-24 animate-pulse rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function UploadManagementPage() {
  // Require admin authentication
  await requireAdmin();

  return (
    <DashboardPageWrapper
      title="Upload Management"
      parentTitle="Admin Dashboard"
      parentUrl="/dashboard/admin"
    >
      {/* Upload Stats */}
      <Suspense fallback={<UploadStatsCardsSkeleton />}>
        <UploadStatsCards />
      </Suspense>

      {/* Upload Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Uploads</CardTitle>
          <CardDescription>
            Manage user uploads, monitor storage usage, and moderate content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={<div className="bg-muted h-96 animate-pulse rounded" />}
          >
            <UploadManagementTable />
          </Suspense>
        </CardContent>
      </Card>
    </DashboardPageWrapper>
  );
}
