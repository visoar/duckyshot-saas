// lib/admin/stats.ts
import { AdminStats } from "@/app/dashboard/admin/_components/admin-stats-cards";
import { db } from "@/database";
import { users, subscriptions, payments, uploads } from "@/database/schema";
import { count, sum } from "drizzle-orm"; // Removed unused imports: and, eq, or, gte, lte, desc

import { sql } from "drizzle-orm"; // Added sql import

export async function getAdminStats(): Promise<AdminStats> {
  try {
    // Get basic stats
    const [userStatsData] = await db
      .select({
        total: count(),
        verified: count(
          sql`CASE WHEN ${users.emailVerified} = true THEN 1 END`,
        ),
        admins: count(
          sql`CASE WHEN ${users.role} IN ('admin', 'super_admin') THEN 1 END`,
        ),
      })
      .from(users);

    // Get subscription stats
    const [subscriptionStatsData] = await db
      .select({
        total: count(),
        active: count(
          sql`CASE WHEN ${subscriptions.status} = 'active' THEN 1 END`,
        ),
        canceled: count(
          sql`CASE WHEN ${subscriptions.status} = 'canceled' THEN 1 END`,
        ),
      })
      .from(subscriptions);

    // Get payment stats
    const [paymentStatsData] = await db
      .select({
        total: count(),
        totalRevenue: sum(payments.amount).mapWith(Number), // Ensure amount is number
        successful: count(
          sql`CASE WHEN ${payments.status} = 'succeeded' THEN 1 END`, // API uses 'succeeded'
        ),
      })
      .from(payments);

    // Get upload stats
    const [uploadStatsData] = await db
      .select({
        total: count(),
        totalSize: sum(uploads.fileSize).mapWith(Number), // Ensure fileSize is number and matches schema
      })
      .from(uploads);

    return {
      users: {
        total: userStatsData?.total || 0,
        verified: userStatsData?.verified || 0,
        admins: userStatsData?.admins || 0,
      },
      subscriptions: {
        total: subscriptionStatsData?.total || 0,
        active: subscriptionStatsData?.active || 0,
        canceled: subscriptionStatsData?.canceled || 0,
      },
      payments: {
        total: paymentStatsData?.total || 0,
        totalRevenue: paymentStatsData?.totalRevenue || 0,
        successful: paymentStatsData?.successful || 0,
      },
      uploads: {
        total: uploadStatsData?.total || 0,
        totalSize: uploadStatsData?.totalSize || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching admin stats in lib/admin/stats.ts:", error);
    // Return a default or empty state in case of error to prevent breaking the page
    // Or rethrow the error if the page should show a global error boundary
    return {
      users: { total: 0, verified: 0, admins: 0 },
      subscriptions: { total: 0, active: 0, canceled: 0 },
      payments: { total: 0, totalRevenue: 0, successful: 0 },
      uploads: { total: 0, totalSize: 0 },
    };
  }
}

// Note: The AdminStats type in admin-stats-cards.tsx might need to be adjusted
// if the structure returned by this function differs from its current definition.
// Specifically, the API route also returns 'charts' data which is not included here
// as AdminStatsCards doesn't seem to use it. If other components need chart data,
// this function or another server-side function would need to provide it.
