import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { aiArtworks, users, uploads, aiStyles } from "@/database/tables";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: artworkId } = await params;

    // Fetch the public artwork with user info
    const artwork = await db
      .select({
        id: aiArtworks.id,
        title: aiArtworks.title,
        description: aiArtworks.description,
        originalImage: {
          url: uploads.url,
          fileName: uploads.fileName,
        },
        generatedImages: aiArtworks.generatedImages,
        style: {
          id: aiStyles.id,
          name: aiStyles.name,
          category: aiStyles.category,
        },
        status: aiArtworks.status,
        creditsUsed: aiArtworks.creditsUsed,
        isPublic: aiArtworks.isPublic,
        sharedAt: aiArtworks.sharedAt,
        createdAt: aiArtworks.createdAt,
        completedAt: aiArtworks.completedAt,
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(aiArtworks)
      .leftJoin(users, eq(aiArtworks.userId, users.id))
      .leftJoin(uploads, eq(aiArtworks.originalImageUploadId, uploads.id))
      .leftJoin(aiStyles, eq(aiArtworks.styleId, aiStyles.id))
      .where(
        and(
          eq(aiArtworks.id, artworkId),
          eq(aiArtworks.isPublic, true),
          eq(aiArtworks.status, "completed"),
        ),
      )
      .limit(1);

    if (!artwork.length) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      artwork: artwork[0],
    });
  } catch (error) {
    console.error("Get public artwork error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
