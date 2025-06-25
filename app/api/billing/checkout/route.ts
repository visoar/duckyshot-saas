import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { billing } from "@/lib/billing";
import { Session } from "@/types/auth";
import { z } from "zod";
import { getUserSubscription } from "@/lib/database/subscription";
import { rateLimiters } from "@/lib/rate-limit";

const checkoutSchema = z.object({
  tierId: z.string(),
  paymentMode: z.enum(["subscription", "one_time"]),
  billingCycle: z.enum(["monthly", "yearly"]).optional(),
});

export async function POST(request: NextRequest) {
  let session: Session | null = null;
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

    session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsedBody = checkoutSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsedBody.error.flatten() },
        { status: 400 },
      );
    }

    const { tierId, paymentMode, billingCycle } = parsedBody.data;

    // 仅在用户尝试购买新订阅时检查
    if (paymentMode === "subscription") {
      const existingSubscription = await getUserSubscription(session.user.id);

      // --- 修正点: 移除了 `&& existingSubscription.tierId !== tierId` ---
      // 只要存在任何有效的订阅，就阻止创建新的订阅。
      if (
        existingSubscription &&
        (existingSubscription.status === "active" ||
          existingSubscription.status === "trialing")
      ) {
        // 创建客户门户URL，以便前端可以引导用户去管理订阅
        const { portalUrl } = await billing.createCustomerPortalUrl(
          existingSubscription.customerId,
        );

        // 返回 409 Conflict 状态码，并附带管理链接
        return NextResponse.json(
          {
            error:
              "You already have an active subscription. Please manage your plan from the billing portal.",
            managementUrl: portalUrl,
          },
          { status: 409 },
        );
      }
    }

    // 使用 URL 对象构建各种状态的 URL，更安全健壮
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      throw new Error(
        "NEXT_PUBLIC_APP_URL is not set in environment variables.",
      );
    }

    const successUrl = new URL("/payment-status", appUrl);
    successUrl.searchParams.set("status", "success");

    const cancelUrl = new URL("/payment-status", appUrl);
    cancelUrl.searchParams.set("status", "cancelled");

    const failureUrl = new URL("/payment-status", appUrl);
    failureUrl.searchParams.set("status", "failed");

    // 构建传递给 billing provider 的选项
    const checkoutOptions = {
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      tierId,
      paymentMode,
      billingCycle,
      successUrl: successUrl.toString(),
      cancelUrl: cancelUrl.toString(),
      failureUrl: failureUrl.toString(),
    };

    const { checkoutUrl } =
      await billing.createCheckoutSession(checkoutOptions);

    const response = NextResponse.json({ checkoutUrl });

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());

    return response;
  } catch (error) {
    console.error("[Checkout API Error]", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userId: session?.user?.id,
    });

    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again later." },
      { status: 500 },
    );
  }
}
