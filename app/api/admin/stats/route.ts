import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/database";
import { users, subscriptions, payments, uploads } from "@/database/schema";
import { sql, count, sum, desc } from "drizzle-orm";

export async function GET() {
  try {
    // Require admin authentication
    await requireAdmin();

    // Get basic stats
    const [userStats] = await db
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
    const [subscriptionStats] = await db
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
        totalRevenue: sum(payments.amount).mapWith(Number),
        successful: count(
          sql`CASE WHEN ${payments.status} = 'succeeded' THEN 1 END`,
        ),
      })
      .from(payments);

    // Get upload stats
    const [uploadStatsData] = await db
      .select({
        total: count(),
        totalSize: sum(uploads.fileSize).mapWith(Number),
      })
      .from(uploads);

    // Get recent users (last 30 days)
    const recentUsers = await db
      .select({
        date: sql<string>`DATE(${users.createdAt})`,
        count: count(),
      })
      .from(users)
      .where(sql`${users.createdAt} >= NOW() - INTERVAL '30 days'`)
      .groupBy(sql`DATE(${users.createdAt})`)
      .orderBy(desc(sql`DATE(${users.createdAt})`));

    // Get revenue by month (last 12 months)
    const monthlyRevenueData = await db
      .select({
        month: sql<string>`TO_CHAR(${payments.createdAt}, 'YYYY-MM')`,
        revenue: sum(payments.amount).mapWith(Number),
        count: count(),
      })
      .from(payments)
      .where(sql`${payments.createdAt} >= NOW() - INTERVAL '12 month'`)
      .groupBy(sql`TO_CHAR(${payments.createdAt}, 'YYYY-MM')`)
      .orderBy(desc(sql`TO_CHAR(${payments.createdAt}, 'YYYY-MM')`));

    return NextResponse.json({
      users: userStats,
      subscriptions: subscriptionStats,
      payments: {
        total: paymentStatsData?.total || 0,
        totalRevenue: paymentStatsData?.totalRevenue || 0,
        successful: paymentStatsData?.successful || 0,
      },
      uploads: {
        total: uploadStatsData?.total || 0,
        totalSize: uploadStatsData?.totalSize || 0,
      },
      charts: {
        recentUsers,
        monthlyRevenue: monthlyRevenueData.map((item) => ({
          ...item,
          revenue: item.revenue || 0,
        })),
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 },
    );
  }
}
