import { auth } from "@/lib/auth/server";
import { getUserSubscription } from "@/lib/database/subscription";
import { billing } from "@/lib/billing";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const paymentStatusSchema = z.object({
  sessionId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    // Check user's current subscription status
    const subscription = await getUserSubscription(session.user.id);

    if (subscription) {
      // User has a subscription, check its status
      if (
        subscription.status === "active" ||
        subscription.status === "trialing"
      ) {
        return NextResponse.json({
          status: "success",
          subscription,
          message: "Payment successful and subscription is active",
        });
      } else if (
        subscription.status === "past_due" ||
        subscription.status === "unpaid"
      ) {
        return NextResponse.json({
          status: "failed",
          subscription,
          message: "Payment failed or subscription is past due",
        });
      } else if (subscription.status === "canceled") {
        return NextResponse.json({
          status: "cancelled",
          subscription,
          message: "Subscription has been cancelled",
        });
      }
    }

    // If no subscription found or status is unclear, check with payment provider
    if (sessionId) {
      try {
        // Note: This would require implementing a method to check session status
        // with the payment provider. For now, we'll return pending status.
        return NextResponse.json({
          status: "pending",
          message: "Payment is being processed",
          sessionId,
        });
      } catch (error) {
        console.error("Error checking payment provider status:", error);
        return NextResponse.json({
          status: "failed",
          message: "Unable to verify payment status",
        });
      }
    }

    // Default to pending if we can't determine status
    return NextResponse.json({
      status: "pending",
      message: "Payment status is being verified",
    });
  } catch (error) {
    console.error("[Payment Status API Error]", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 },
    );
  }
}
