import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/database";
import { subscriptions, users } from "@/database/schema";
import { eq, desc, asc, sql, count } from "drizzle-orm";
import { z } from "zod";
import { getProductTierByProductId, getProductTierById } from "@/lib/config/products";

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
        userId: subscriptions.userId,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(subscriptions)
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const rawSubscriptions = await subscriptionsQuery;

    // Transform subscriptions to include plan info
    const subscriptionsList = rawSubscriptions.map((sub) => {
      // Try to get product tier by internal ID first, then by Creem product ID
      let productTier = getProductTierById(sub.productId);
      if (!productTier) {
        productTier = getProductTierByProductId(sub.productId);
      }
      
      return {
        id: sub.id,
        userId: sub.userId,
        userName: sub.user?.name || 'Unknown User',
        userEmail: sub.user?.email || 'Unknown Email',
        userImage: sub.user?.image,
        status: sub.status as "active" | "cancelled" | "past_due" | "trialing" | "incomplete",
        planName: productTier?.name || 'Unknown Plan',
        planPrice: productTier ? getSubscriptionPrice(productTier, sub.productId) : undefined,
        currency: productTier?.currency || 'USD',
        currentPeriodStart: sub.currentPeriodStart?.toISOString() || '',
        currentPeriodEnd: sub.currentPeriodEnd?.toISOString() || '',
        cancelAtPeriodEnd: !!sub.canceledAt,
        // Use Creem subscription ID instead of Stripe
        creemSubscriptionId: sub.subscriptionId,
        createdAt: sub.createdAt.toISOString(),
        updatedAt: sub.updatedAt.toISOString(),
      };
    });

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


// Helper function to determine subscription price based on product ID
function getSubscriptionPrice(productTier: any, productId: string): number {
  const { pricing, prices } = productTier;
  
  // If productId is the internal tier ID, default to monthly price
  if (productId === productTier.id) {
    return Math.round(prices.monthly * 100); // Convert to cents
  }
  
  // Check which billing cycle this product ID corresponds to
  if (pricing.creem.monthly === productId) {
    return Math.round(prices.monthly * 100); // Convert to cents
  } else if (pricing.creem.yearly === productId) {
    return Math.round(prices.yearly * 100); // Convert to cents
  } else if (pricing.creem.oneTime === productId) {
    return Math.round(prices.oneTime * 100); // Convert to cents
  }
  
  // Default to monthly price if no match
  return Math.round(prices.monthly * 100);
}
  } catch (error) {
    console.error("Get subscriptions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 },
    );
  }
}
