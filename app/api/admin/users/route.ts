import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/database";
import { users, subscriptions, userRoleEnum } from "@/database/schema";
import { eq, desc, asc, count, and, or, ilike } from "drizzle-orm";
import { z } from "zod";
import type { UserWithSubscription } from "@/types/billing";

const getUsersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  role: z.enum(userRoleEnum.enumValues).optional(),
  sortBy: z.enum(["createdAt", "name", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const params = getUsersSchema.parse(Object.fromEntries(searchParams));

    const { page, limit, search, role, sortBy, sortOrder } = params;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    if (search) {
      whereConditions.push(
        or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)),
      );
    }

    if (role) {
      whereConditions.push(eq(users.role, role));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Build order by
    const orderByClause =
      sortOrder === "asc" ? asc(users[sortBy]) : desc(users[sortBy]);

    // Get users with subscription info
    const usersQuery = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        subscriptionStatus: subscriptions.status,
        subscriptionId: subscriptions.subscriptionId,
      })
      .from(users)
      .leftJoin(subscriptions, eq(users.id, subscriptions.userId))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const rawUsers = await usersQuery;

    // Group users and collect all their subscriptions
    const usersMap = new Map<string, UserWithSubscription>();
    
    rawUsers.forEach((user) => {
      const existingUser = usersMap.get(user.id);
      
      if (!existingUser) {
        // First occurrence of this user
        const subscriptions = [];
        if (user.subscriptionId && user.subscriptionStatus) {
          subscriptions.push({
            subscriptionId: user.subscriptionId,
            status: user.subscriptionStatus,
          });
        }
        
        usersMap.set(user.id, {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          subscriptions,
        });
      } else if (user.subscriptionId && user.subscriptionStatus) {
        // Add subscription to existing user if not already present
        const subscriptionExists = existingUser.subscriptions.some(
          sub => sub.subscriptionId === user.subscriptionId
        );
        if (!subscriptionExists) {
          existingUser.subscriptions.push({
            subscriptionId: user.subscriptionId,
            status: user.subscriptionStatus,
          });
        }
      }
    });

    // Convert map back to array
    const usersList: UserWithSubscription[] = Array.from(usersMap.values());

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(users)
      .where(whereClause);

    return NextResponse.json({
      users: usersList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
