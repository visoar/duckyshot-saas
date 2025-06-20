import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/database";
import { subscriptions, users } from "@/database/schema";
import { eq, desc, asc, count, and, or, ilike, between } from "drizzle-orm";
import { z } from "zod";
import {
  getProductTierByProductId,
  getProductTierById,
} from "@/lib/config/products";

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
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(subscriptions.subscriptionId, `%${search}%`),
        ),
      );
    }

    if (status) {
      whereConditions.push(eq(subscriptions.status, status));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

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
        userName: sub.user?.name || "Unknown User",
        userEmail: sub.user?.email || "Unknown Email",
        userImage: sub.user?.image,
        status: sub.status as
          | "active"
          | "cancelled"
          | "past_due"
          | "trialing"
          | "incomplete",
        planName: productTier?.name || "Unknown Plan",
        planPrice: productTier
          ? getSubscriptionPrice(productTier, sub.productId)
          : undefined,
        currency: productTier?.currency || "USD",
        currentPeriodStart: sub.currentPeriodStart?.toISOString() || "",
        currentPeriodEnd: sub.currentPeriodEnd?.toISOString() || "",
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
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const summaryQueries = {
      activeSubscriptions: db
        .select({ value: count() })
        .from(subscriptions)
        .leftJoin(users, eq(subscriptions.userId, users.id))
        .where(and(eq(subscriptions.status, "active"), whereClause)),
      canceledSubscriptions: db
        .select({ value: count() })
        .from(subscriptions)
        .leftJoin(users, eq(subscriptions.userId, users.id))
        .where(and(eq(subscriptions.status, "canceled"), whereClause)),
      pastDueSubscriptions: db
        .select({ value: count() })
        .from(subscriptions)
        .leftJoin(users, eq(subscriptions.userId, users.id))
        .where(and(eq(subscriptions.status, "past_due"), whereClause)),
      unpaidSubscriptions: db
        .select({ value: count() })
        .from(subscriptions)
        .leftJoin(users, eq(subscriptions.userId, users.id))
        .where(and(eq(subscriptions.status, "unpaid"), whereClause)),
      expiringThisMonth: db
        .select({ value: count() })
        .from(subscriptions)
        .leftJoin(users, eq(subscriptions.userId, users.id))
        .where(
          and(
            eq(subscriptions.status, "active"),
            between(
              subscriptions.currentPeriodEnd,
              new Date(),
              thirtyDaysFromNow,
            ),
            whereClause,
          ),
        ),
    };

    const [
      activeResult,
      canceledResult,
      pastDueResult,
      unpaidResult,
      expiringResult,
    ] = await Promise.all([
      summaryQueries.activeSubscriptions.execute(),
      summaryQueries.canceledSubscriptions.execute(),
      summaryQueries.pastDueSubscriptions.execute(),
      summaryQueries.unpaidSubscriptions.execute(),
      summaryQueries.expiringThisMonth.execute(),
    ]);

    const summaryStats = {
      activeSubscriptions: activeResult[0].value,
      canceledSubscriptions: canceledResult[0].value,
      pastDueSubscriptions: pastDueResult[0].value,
      unpaidSubscriptions: unpaidResult[0].value,
      expiringThisMonth: expiringResult[0].value,
    };

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
    // Define a more specific type for productTier if possible, or use a known one
    // For now, using a basic structure based on usage
    interface ProductTier {
      id: string;
      pricing: {
        creem: {
          monthly: string;
          yearly: string;
          oneTime?: string; // Added optional oneTime property
        };
      };
      prices: {
        monthly: number;
        yearly: number;
        oneTime?: number; // Added optional oneTime property
      };
    }

    function getSubscriptionPrice(
      productTier: ProductTier,
      productId: string,
    ): number {
      const { pricing, prices } = productTier;

      // If productId is the internal tier ID, default to monthly price
      if (productId === productTier.id) {
        return Math.round(prices.monthly * 100); // Convert to cents
      }

      // Check which billing cycle this product ID corresponds to
      if (pricing.creem.monthly === productId) {
        return Math.round(prices.monthly * 100); // Convert to cents
      } else if (pricing.creem.yearly === productId) {
        return Math.round(prices.yearly * 100); // Convert to cents  } else if (pricing.creem.oneTime === productId) {
        // Ensure prices.oneTime is a number, defaulting to 0 if falsy
        const oneTimePrice = Number(prices.oneTime || 0);
        return Math.round(oneTimePrice * 100); // Convert to cents
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
