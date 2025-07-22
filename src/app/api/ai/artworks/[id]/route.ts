import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/database";
import { aiArtworks, uploads, aiStyles } from "@/database/tables";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: artworkId } = await params;

    // Fetch the artwork
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
        isPrivate: aiArtworks.isPrivate,
        sharedAt: aiArtworks.sharedAt,
        createdAt: aiArtworks.createdAt,
        completedAt: aiArtworks.completedAt,
        userId: aiArtworks.userId,
      })
      .from(aiArtworks)
      .leftJoin(uploads, eq(aiArtworks.originalImageUploadId, uploads.id))
      .leftJoin(aiStyles, eq(aiArtworks.styleId, aiStyles.id))
      .where(
        and(
          eq(aiArtworks.id, artworkId),
          eq(aiArtworks.userId, session.user.id),
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
    console.error("Get artwork error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
