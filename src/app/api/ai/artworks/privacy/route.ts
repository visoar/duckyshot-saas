import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/database";
import { aiArtworks } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const updatePrivacySchema = z.object({
  artworkId: z.string().uuid(),
  isPublic: z.boolean(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { artworkId, isPublic } = updatePrivacySchema.parse(body);

    // Check if artwork exists and belongs to the user
    const [artwork] = await db
      .select()
      .from(aiArtworks)
      .where(
        and(
          eq(aiArtworks.id, artworkId),
          eq(aiArtworks.userId, session.user.id),
          eq(aiArtworks.status, "completed"),
        ),
      )
      .limit(1);

    if (!artwork) {
      return NextResponse.json(
        { error: "Artwork not found or not accessible" },
        { status: 404 },
      );
    }

    // Update privacy settings
    const updateData = {
      isPublic,
      updatedAt: new Date(),
      ...(isPublic && !artwork.sharedAt ? { sharedAt: new Date() } : {}),
    };

    await db
      .update(aiArtworks)
      .set(updateData)
      .where(eq(aiArtworks.id, artworkId));

    return NextResponse.json({
      success: true,
      message: isPublic
        ? "Artwork shared to public gallery"
        : "Artwork made private",
    });
  } catch (error) {
    console.error("Privacy update error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update privacy settings" },
      { status: 500 },
    );
  }
}
