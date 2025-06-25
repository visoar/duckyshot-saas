import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { billing } from "@/lib/billing";
import { getUserSubscription } from "@/lib/database/subscription";
import { rateLimiters } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitResult = await rateLimiters.billing(request);
    if (!rateLimitResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many billing requests, please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getUserSubscription(session.user.id);
    if (!subscription?.customerId) {
      return NextResponse.json(
        { error: "No active subscription found for this user." },
        { status: 404 },
      );
    }

    const { portalUrl } = await billing.createCustomerPortalUrl(
      subscription.customerId,
    );

    const response = NextResponse.json({ portalUrl });

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());

    return response;
  } catch (error) {
    console.error("[Portal API Error]", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
