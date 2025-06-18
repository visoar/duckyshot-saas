import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/database";
import { payments, users } from "@/database/schema";
import { eq, desc, asc, sql, count } from "drizzle-orm";
import { z } from "zod";

const getPaymentsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(["succeeded", "failed", "pending", "canceled"]).optional(),
  sortBy: z.enum(["createdAt", "amount", "status"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const params = getPaymentsSchema.parse(Object.fromEntries(searchParams));

    const { page, limit, search, status, sortBy, sortOrder, dateFrom, dateTo } =
      params;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    if (search) {
      whereConditions.push(
        sql`(${users.name} ILIKE ${`%${search}%`} OR ${users.email} ILIKE ${`%${search}%`} OR ${payments.paymentId} ILIKE ${`%${search}%`})`,
      );
    }

    if (status) {
      whereConditions.push(eq(payments.status, status));
    }

    if (dateFrom) {
      whereConditions.push(sql`${payments.createdAt} >= ${new Date(dateFrom)}`);
    }

    if (dateTo) {
      whereConditions.push(sql`${payments.createdAt} <= ${new Date(dateTo)}`);
    }

    const whereClause =
      whereConditions.length > 0
        ? sql`${whereConditions.reduce((acc, condition) => sql`${acc} AND ${condition}`)}`
        : undefined;

    // Build order by
    const orderByClause =
      sortOrder === "asc" ? asc(payments[sortBy]) : desc(payments[sortBy]);

    // Get payments with user info
    const paymentsQuery = db
      .select({
        id: payments.id,
        userId: payments.userId,
        userName: users.name,
        userEmail: users.email,
        paymentId: payments.paymentId,
        amount: payments.amount,
        currency: payments.currency,
        status: sql<string>`CASE 
          WHEN ${payments.status} = 'succeeded' THEN 'completed'
          WHEN ${payments.status} = 'canceled' THEN 'cancelled'
          ELSE ${payments.status}
        END`,
        paymentType: payments.paymentType,
        paymentMethod: sql<string>`CASE 
          WHEN ${payments.paymentType} = 'subscription' THEN 'Subscription'
          WHEN ${payments.paymentType} = 'one_time' THEN 'One-time Payment'
          WHEN ${payments.paymentType} = 'card' THEN 'Credit Card'
          WHEN ${payments.paymentType} = 'bank_transfer' THEN 'Bank Transfer'
          WHEN ${payments.paymentType} = 'paypal' THEN 'PayPal'
          ELSE COALESCE(${payments.paymentType}, 'Unknown')
        END`,
        productId: payments.productId,
        stripePaymentIntentId: payments.paymentId,
        subscriptionId: payments.subscriptionId,
        createdAt: payments.createdAt,
        updatedAt: payments.updatedAt,
      })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const paymentsList = await paymentsQuery;

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .where(whereClause);

    // Get summary stats
    const [summaryStats] = await db
      .select({
        totalAmount: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
        successfulPayments: count(
          sql`CASE WHEN ${payments.status} = 'succeeded' THEN 1 END`,
        ),
        failedPayments: count(
          sql`CASE WHEN ${payments.status} = 'failed' THEN 1 END`,
        ),
        pendingPayments: count(
          sql`CASE WHEN ${payments.status} = 'pending' THEN 1 END`,
        ),
      })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .where(whereClause);

    return NextResponse.json({
      payments: paymentsList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: summaryStats,
    });
  } catch (error) {
    console.error("Get payments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}
