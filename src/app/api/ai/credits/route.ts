import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { UserCreditsService } from "@/lib/database/ai";

export async function GET(request: Request) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user credits
    let credits = await UserCreditsService.getUserCredits(userId);

    // Initialize credits for new users
    if (!credits) {
      credits = await UserCreditsService.initializeUserCredits(userId, 3); // 3 free credits for new users
    }

    if (!credits) {
      return NextResponse.json(
        { error: "Failed to initialize user credits" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      totalCredits: credits.totalCredits,
      usedCredits: credits.usedCredits,
      remainingCredits: credits.remainingCredits,
      lastResetAt: credits.lastResetAt,
    });
  } catch (error) {
    console.error("Credits API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
