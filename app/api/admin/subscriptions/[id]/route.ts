import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/database";
import { subscriptions } from "@/database/schema";
import { eq } from "drizzle-orm";
import { Creem } from "creem";
import env from "@/env";

// Create a new Creem client instance specifically for this route
const creemClient = new Creem({
  serverIdx: env.CREEM_ENVIRONMENT === "live_mode" ? 0 : 1,
});

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: subscriptionId } = await params;
    await requireAdmin();

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 },
      );
    }

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.subscriptionId, subscriptionId))
      .limit(1);

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }

    // Call Creem API to cancel subscription
    await creemClient.cancelSubscription({
      xApiKey: env.CREEM_API_KEY,
      id: subscription.subscriptionId, // Corrected parameter name from subscriptionId to id
    });

    // The webhook will handle updating the database status.
    return NextResponse.json({
      message: "Subscription cancellation initiated successfully.",
    });
  } catch (error) {
    console.error("Failed to cancel subscription:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
