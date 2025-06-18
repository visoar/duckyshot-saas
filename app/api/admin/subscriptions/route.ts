import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/database";
import { subscriptions, users } from "@/database/schema";
import { eq, desc, asc, sql, count } from "drizzle-orm";
import { z } from "zod";

const getSubscriptionsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z
    .enum(["active", "canceled", "past_due", "unpaid", "incomplete"])
    .optional(),
  sortBy: z
    .enum(["createdAt", "currentPeriodEnd", "status"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const params = getSubscriptionsSchema.parse(
      Object.fromEntries(searchParams),
    );

    const { page, limit, search, status, sortBy, sortOrder } = params;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    if (search) {
      whereConditions.push(
        sql`(${users.name} ILIKE ${`%${search}%`} OR ${users.email} ILIKE ${`%${search}%`} OR ${subscriptions.subscriptionId} ILIKE ${`%${search}%`})`,
      );
    }

    if (status) {
      whereConditions.push(eq(subscriptions.status, status));
    }

    const whereClause =
      whereConditions.length > 0
        ? sql`${whereConditions.reduce((acc, condition) => sql`${acc} AND ${condition}`)}`
        : undefined;

    // Build order by
    const orderByClause =
      sortOrder === "asc"
        ? asc(subscriptions[sortBy])
        : desc(subscriptions[sortBy]);

    // Get subscriptions with user info
    const subscriptionsQuery = db
      .select({
        id: subscriptions.id,
        subscriptionId: subscriptions.subscriptionId,
        productId: subscriptions.productId,
        status: subscriptions.status,
        currentPeriodStart: subscriptions.currentPeriodStart,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
        canceledAt: subscriptions.canceledAt,
        createdAt: subscriptions.createdAt,
        updatedAt: subscriptions.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(subscriptions)
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const subscriptionsList = await subscriptionsQuery;

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(subscriptions)
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .where(whereClause);

    // Get summary stats
    const [summaryStats] = await db
      .select({
        activeSubscriptions: count(
          sql`CASE WHEN ${subscriptions.status} = 'active' THEN 1 END`,
        ),
        canceledSubscriptions: count(
          sql`CASE WHEN ${subscriptions.status} = 'canceled' THEN 1 END`,
        ),
        pastDueSubscriptions: count(
          sql`CASE WHEN ${subscriptions.status} = 'past_due' THEN 1 END`,
        ),
        unpaidSubscriptions: count(
          sql`CASE WHEN ${subscriptions.status} = 'unpaid' THEN 1 END`,
        ),
        expiringThisMonth: count(
          sql`CASE WHEN ${subscriptions.currentPeriodEnd} BETWEEN NOW() AND NOW() + INTERVAL '30 days' AND ${subscriptions.status} = 'active' THEN 1 END`,
        ),
      })
      .from(subscriptions)
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .where(whereClause);

    return NextResponse.json({
      subscriptions: subscriptionsList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: summaryStats,
    });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 },
    );
  }
}
