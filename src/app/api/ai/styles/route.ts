import { NextRequest, NextResponse } from "next/server";
import { AIStyleService } from "@/lib/database/ai";
import { STYLE_CATEGORIES } from "@/lib/ai/styles";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let styles;

    if (category) {
      // Get styles by category
      styles = await AIStyleService.getStylesByCategory(category);
    } else {
      // Get all active styles
      styles = await AIStyleService.getActiveStyles();
    }

    // Group styles by category for better organization
    const stylesByCategory = styles.reduce(
      (acc, style) => {
        if (!acc[style.category]) {
          acc[style.category] = [];
        }
        acc[style.category].push(style);
        return acc;
      },
      {} as Record<string, typeof styles>,
    );

    return NextResponse.json({
      styles,
      stylesByCategory,
      categories: STYLE_CATEGORIES,
    });
  } catch (error) {
    console.error("Styles API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
