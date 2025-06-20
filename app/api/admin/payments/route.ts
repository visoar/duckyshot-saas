import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/database";
import { payments, users } from "@/database/schema";
import {
  eq,
  desc,
  asc,
  sql,
  count,
  and,
  or,
  gte,
  lte,
  ilike,
} from "drizzle-orm";
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
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(payments.paymentId, `%${search}%`),
        ),
      );
    }

    if (status) {
      whereConditions.push(eq(payments.status, status));
    }

    if (dateFrom) {
      whereConditions.push(gte(payments.createdAt, new Date(dateFrom)));
    }

    if (dateTo) {
      whereConditions.push(lte(payments.createdAt, new Date(dateTo)));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

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
        status: sql<string>`case 
          when ${payments.status} = 'succeeded' then 'completed'
          when ${payments.status} = 'canceled' then 'cancelled'
          else ${payments.status}
        end`,
        paymentType: payments.paymentType,
        paymentMethod: sql<string>`case 
          when ${payments.paymentType} = 'subscription' then 'Subscription'
          when ${payments.paymentType} = 'one_time' then 'One-time Payment'
          when ${payments.paymentType} = 'card' then 'Credit Card'
          when ${payments.paymentType} = 'bank_transfer' then 'Bank Transfer'
          when ${payments.paymentType} = 'paypal' then 'PayPal'
          else coalesce(${payments.paymentType}, 'Unknown')
        end`,
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
        totalAmount: sql<number>`coalesce(sum(${payments.amount}), 0)`,
        successfulPayments: count(
          sql`case when ${payments.status} = 'succeeded' then 1 end`,
        ),
        failedPayments: count(
          sql`case when ${payments.status} = 'failed' then 1 end`,
        ),
        pendingPayments: count(
          sql`case when ${payments.status} = 'pending' then 1 end`,
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
