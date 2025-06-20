import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/database";
import { subscriptions, users } from "@/database/schema";
import { eq, desc, asc, count, and, or, ilike } from "drizzle-orm";
import { z } from "zod";
import {
  getProductTierByProductId,
  getProductTierById,
} from "@/lib/config/products";
import type { SubscriptionWithUser, SubscriptionStatus } from "@/types/billing";

const getSubscriptionsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z
    .enum([
      "active",
      "canceled",
      "past_due",
      "unpaid",
      "incomplete",
      "trialing",
    ])
    .optional(),
  sortBy: z
    .enum(["createdAt", "currentPeriodEnd", "status"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const params = getSubscriptionsSchema.parse(
      Object.fromEntries(searchParams),
    );

    const { page, limit, search, status, sortBy, sortOrder } = params;
    const offset = (page - 1) * limit;

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

    const orderByClause =
      sortOrder === "asc"
        ? asc(subscriptions[sortBy])
        : desc(subscriptions[sortBy]);

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
        customerId: subscriptions.customerId,
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

    const totalQuery = db
      .select({ total: count() })
      .from(subscriptions)
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .where(whereClause);

    const [rawSubscriptions, [{ total }]] = await Promise.all([
      subscriptionsQuery,
      totalQuery,
    ]);

    const subscriptionsList: SubscriptionWithUser[] = rawSubscriptions
      .filter(
        (sub): sub is typeof sub & { user: NonNullable<typeof sub.user> } =>
          sub.user !== null,
      )
      .map((sub) => {
        let productTier = getProductTierById(sub.productId);
        if (!productTier) {
          productTier = getProductTierByProductId(sub.productId);
        }

        return {
          ...sub,
          tierId: sub.productId,
          status: sub.status as SubscriptionStatus,
          planName: productTier?.name || "Unknown Plan",
        };
      });

    return NextResponse.json({
      subscriptions: subscriptionsList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 },
    );
  }
}
