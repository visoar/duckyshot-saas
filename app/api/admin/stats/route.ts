import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminStatsWithCharts } from "@/lib/admin/stats";

export async function GET() {
  try {
    // Require admin authentication
    await requireAdmin();

    // Get all stats including charts using the centralized function
    const stats = await getAdminStatsWithCharts();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 },
    );
  }
}
