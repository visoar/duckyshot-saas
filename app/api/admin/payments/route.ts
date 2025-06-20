import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/database";
import { payments, users } from "@/database/schema";
import { eq, desc, asc, count, and, or, gte, lte, ilike } from "drizzle-orm";
import { z } from "zod";
import type { PaymentWithUser } from "@/types/billing";
import {
  getProductTierById,
  getProductTierByProductId,
} from "@/lib/config/products";

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
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const params = getPaymentsSchema.parse(Object.fromEntries(searchParams));

    const { page, limit, search, status, sortBy, sortOrder, dateFrom, dateTo } =
      params;
    const offset = (page - 1) * limit;

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
    if (status) whereConditions.push(eq(payments.status, status));
    if (dateFrom)
      whereConditions.push(gte(payments.createdAt, new Date(dateFrom)));
    if (dateTo) whereConditions.push(lte(payments.createdAt, new Date(dateTo)));

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const orderByClause =
      sortOrder === "asc" ? asc(payments[sortBy]) : desc(payments[sortBy]);

    const paymentsQuery = db
      .select({
        id: payments.id,
        userId: payments.userId,
        paymentId: payments.paymentId,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        paymentType: payments.paymentType,
        productId: payments.productId,
        subscriptionId: payments.subscriptionId,
        createdAt: payments.createdAt,
        updatedAt: payments.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const totalQuery = db
      .select({ total: count() })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .where(whereClause);

    const [rawPayments, [{ total }]] = await Promise.all([
      paymentsQuery,
      totalQuery,
    ]);

    const paymentsList: PaymentWithUser[] = rawPayments
      .filter((p) => p.user) // Ensure user is not null
      .map((payment) => {
        const tier =
          getProductTierByProductId(payment.productId) ||
          getProductTierById(payment.productId);
        return {
          ...payment,
          user: payment.user!, // Assert non-null after filtering
          tierName: tier?.name || "Unknown Product",
        };
      });

    return NextResponse.json({
      payments: paymentsList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get payments error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}
