// lib/admin/stats.ts
import { AdminStats } from "@/app/dashboard/admin/_components/admin-stats-cards";
import { db } from "@/database";
import {
  users,
  subscriptions,
  payments,
  uploads,
  userRoleEnum,
} from "@/database/schema";
import { count, sum, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Extended interface for chart data
export interface ChartData {
  recentUsers: Array<{
    date: string;
    count: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    count: number;
  }>;
}

export interface AdminStatsWithCharts extends AdminStats {
  charts: ChartData;
}

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
          sql`CASE WHEN ${users.role} IN (${userRoleEnum.enumValues
            .filter((role) => role !== "user")
            .map((role) => `'${role}'`)
            .join(", ")}) THEN 1 END`,
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

// New function to get all admin data including charts
export async function getAdminStatsWithCharts(): Promise<AdminStatsWithCharts> {
  try {
    // Use Promise.all to fetch all data in parallel
    const [basicStats, recentUsersData, monthlyRevenueData] = await Promise.all(
      [
        getAdminStats(),
        // Get recent users (last 30 days)
        db
          .select({
            date: sql<string>`DATE(${users.createdAt})`,
            count: count(),
          })
          .from(users)
          .where(sql`${users.createdAt} >= NOW() - INTERVAL '30 days'`)
          .groupBy(sql`DATE(${users.createdAt})`)
          .orderBy(desc(sql`DATE(${users.createdAt})`)),
        // Get revenue by month (last 12 months)
        db
          .select({
            month: sql<string>`TO_CHAR(${payments.createdAt}, 'YYYY-MM')`,
            revenue: sum(payments.amount).mapWith(Number),
            count: count(),
          })
          .from(payments)
          .where(sql`${payments.createdAt} >= NOW() - INTERVAL '12 month'`)
          .groupBy(sql`TO_CHAR(${payments.createdAt}, 'YYYY-MM')`)
          .orderBy(desc(sql`TO_CHAR(${payments.createdAt}, 'YYYY-MM')`)),
      ],
    );

    return {
      ...basicStats,
      charts: {
        recentUsers: recentUsersData.map((item) => ({
          date: item.date,
          count: item.count,
        })),
        monthlyRevenue: monthlyRevenueData.map((item) => ({
          month: item.month,
          revenue: item.revenue || 0,
          count: item.count,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching admin stats with charts:", error);
    // Return default data structure
    const defaultStats = await getAdminStats();
    return {
      ...defaultStats,
      charts: {
        recentUsers: [],
        monthlyRevenue: [],
      },
    };
  }
}

// Chart data types are already exported above with the interface declarations
