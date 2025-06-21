import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { billing } from "@/lib/billing";
import { Session } from "@/types/auth";
import { z } from "zod";

const checkoutSchema = z.object({
    tierId: z.string(),
    paymentMode: z.enum(["subscription", "one_time"]),
    billingCycle: z.enum(["monthly", "yearly"]).optional(),
});

export async function POST(request: NextRequest) {
    let session: Session | null = null;
    try {
        session = await auth.api.getSession({ headers: request.headers });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const parsedBody = checkoutSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json({ error: "Invalid request body", details: parsedBody.error.flatten() }, { status: 400 });
        }

        const { tierId, paymentMode, billingCycle } = parsedBody.data;

        // 1. 使用 URL 对象构建 successUrl，更安全健壮
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        if (!appUrl) {
            throw new Error("NEXT_PUBLIC_APP_URL is not set in environment variables.");
        }

        const successUrl = new URL("/dashboard/settings", appUrl);
        successUrl.searchParams.set("page", "billing");
        successUrl.searchParams.set("status", "success");

        // 2. 构建传递给 billing provider 的选项
        const checkoutOptions = {
            userId: session.user.id,
            userEmail: session.user.email,
            userName: session.user.name,
            tierId,
            paymentMode,
            billingCycle,
            successUrl: successUrl.toString(),
            // 移除了 cancelUrl，因为它不被 CreemProvider 使用
        };

        const { checkoutUrl } = await billing.createCheckoutSession(checkoutOptions);

        return NextResponse.json({ checkoutUrl });

    } catch (error) {
        // Log detailed error information for debugging (server-side only)
        console.error("[Checkout API Error]", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
            userId: session?.user?.id,
        });
        
        // Return generic error message to client to prevent information leakage
        return NextResponse.json(
            { error: "Failed to create checkout session. Please try again later." },
            { status: 500 }
        );
    }
}