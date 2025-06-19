import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/database";
import {
  users,
  subscriptions,
  payments,
  uploads,
  userRoleEnum,
} from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(userRoleEnum.enumValues).optional(),
  emailVerified: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    // Require admin authentication
    await requireAdmin();

    const userId = id;

    // Get user details
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's subscriptions
    const userSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt));

    // Get user's payments
    const userPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt))
      .limit(10);

    // Get user's uploads
    const userUploads = await db
      .select()
      .from(uploads)
      .where(eq(uploads.userId, userId))
      .orderBy(desc(uploads.createdAt))
      .limit(10);

    return NextResponse.json({
      user: {
        ...user,
        // Don't expose sensitive data
        paymentProviderCustomerId: undefined,
      },
      subscriptions: userSubscriptions,
      payments: userPayments,
      uploads: userUploads,
    });
  } catch (error) {
    console.error("Get user details error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    // Require admin authentication
    const currentUser = await requireAdmin();

    const userId = id;
    const body = await request.json();
    const updateData = updateUserSchema.parse(body);

    // Prevent non-super-admin from modifying super-admin users
    const [targetUser] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only super admin can modify super admin users or promote to super admin
    if (
      (targetUser.role === "super_admin" ||
        updateData.role === "super_admin") &&
      currentUser.role !== "super_admin"
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // Prevent users from modifying themselves (to avoid lockout)
    if (userId === currentUser.id && updateData.role) {
      return NextResponse.json(
        { error: "Cannot modify your own role" },
        { status: 400 },
      );
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({
      user: {
        ...updatedUser,
        // Don't expose sensitive data
        paymentProviderCustomerId: undefined,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    // Require super admin authentication for user deletion
    const currentUser = await requireAdmin();

    const userId = id;

    // Get target user
    const [targetUser] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only super admin can delete users
    if (currentUser.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admin can delete users" },
        { status: 403 },
      );
    }

    // Prevent users from deleting themselves
    if (userId === currentUser.id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 },
      );
    }

    // Delete user (cascade will handle related records)
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
