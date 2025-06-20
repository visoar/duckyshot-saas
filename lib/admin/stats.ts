// lib/admin/stats.ts
import { AdminStats } from "@/app/dashboard/admin/_components/admin-stats-cards";
import { db } from "@/database";
import { users, subscriptions, payments, uploads } from "@/database/schema";
import { count, sum, desc, eq, inArray, gte } from "drizzle-orm";

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
    const userStatsQueries = {
      total: db.select({ value: count() }).from(users),
      verified: db
        .select({ value: count() })
        .from(users)
        .where(eq(users.emailVerified, true)),
      admins: db
        .select({ value: count() })
        .from(users)
        .where(inArray(users.role, ["admin", "super_admin"])),
    };

    const subscriptionStatsQueries = {
      total: db.select({ value: count() }).from(subscriptions),
      active: db
        .select({ value: count() })
        .from(subscriptions)
        .where(eq(subscriptions.status, "active")),
      canceled: db
        .select({ value: count() })
        .from(subscriptions)
        .where(eq(subscriptions.status, "canceled")),
    };

    const paymentStatsQueries = {
      total: db.select({ value: count() }).from(payments),
      totalRevenue: db.select({ value: sum(payments.amount) }).from(payments),
      successful: db
        .select({ value: count() })
        .from(payments)
        .where(eq(payments.status, "succeeded")),
    };

    const uploadStatsQueries = {
      total: db.select({ value: count() }).from(uploads),
      totalSize: db.select({ value: sum(uploads.fileSize) }).from(uploads),
    };

    const [
      userTotal,
      userVerified,
      userAdmins,
      subTotal,
      subActive,
      subCanceled,
      payTotal,
      payTotalRevenue,
      paySuccessful,
      uploadTotal,
      uploadTotalSize,
    ] = await Promise.all([
      userStatsQueries.total.execute(),
      userStatsQueries.verified.execute(),
      userStatsQueries.admins.execute(),
      subscriptionStatsQueries.total.execute(),
      subscriptionStatsQueries.active.execute(),
      subscriptionStatsQueries.canceled.execute(),
      paymentStatsQueries.total.execute(),
      paymentStatsQueries.totalRevenue.execute(),
      paymentStatsQueries.successful.execute(),
      uploadStatsQueries.total.execute(),
      uploadStatsQueries.totalSize.execute(),
    ]);

    return {
      users: {
        total: userTotal[0].value,
        verified: userVerified[0].value,
        admins: userAdmins[0].value,
      },
      subscriptions: {
        total: subTotal[0].value,
        active: subActive[0].value,
        canceled: subCanceled[0].value,
      },
      payments: {
        total: payTotal[0].value,
        totalRevenue: Number(payTotalRevenue[0].value) || 0,
        successful: paySuccessful[0].value,
      },
      uploads: {
        total: uploadTotal[0].value,
        totalSize: Number(uploadTotalSize[0].value) || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching admin stats in lib/admin/stats.ts:", error);
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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const [basicStats, recentUsersRaw, monthlyRevenueRaw] = await Promise.all([
      getAdminStats(),
      db
        .select({ createdAt: users.createdAt })
        .from(users)
        .where(gte(users.createdAt, thirtyDaysAgo))
        .orderBy(desc(users.createdAt)),
      db
        .select({ createdAt: payments.createdAt, amount: payments.amount })
        .from(payments)
        .where(gte(payments.createdAt, twelveMonthsAgo))
        .orderBy(desc(payments.createdAt)),
    ]);

    const userCountsByDate = recentUsersRaw.reduce(
      (acc, user) => {
        const date = user.createdAt.toISOString().split("T")[0]; // 'YYYY-MM-DD'
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const recentUsersData = Object.entries(userCountsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date.localeCompare(a.date));

    const revenueByMonth = monthlyRevenueRaw.reduce(
      (acc, payment) => {
        const month = payment.createdAt.toISOString().substring(0, 7); // 'YYYY-MM'
        if (!acc[month]) {
          acc[month] = { revenue: 0, count: 0 };
        }
        acc[month].revenue += Number(payment.amount);
        acc[month].count += 1;
        return acc;
      },
      {} as Record<string, { revenue: number; count: number }>,
    );

    const monthlyRevenueData = Object.entries(revenueByMonth)
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        count: data.count,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));

    return {
      ...basicStats,
      charts: {
        recentUsers: recentUsersData,
        monthlyRevenue: monthlyRevenueData,
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
