import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { AIArtworkService } from "@/lib/database/ai";

export async function GET(
  request: Request,
  context: { params: Promise<{ artworkId: string }> },
) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { artworkId } = await context.params;

    // Get artwork information
    const artworkData = await AIArtworkService.getArtworkById(artworkId);

    if (!artworkData) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    // Check if artwork belongs to the user
    if (artworkData.artwork.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Return artwork status
    return NextResponse.json({
      id: artworkData.artwork.id,
      status: artworkData.artwork.status,
      generatedImages: artworkData.artwork.generatedImages,
      errorMessage: artworkData.artwork.errorMessage,
      creditsUsed: artworkData.artwork.creditsUsed,
      style: artworkData.style,
      originalImage: artworkData.originalUpload,
      createdAt: artworkData.artwork.createdAt,
      completedAt: artworkData.artwork.completedAt,
    });
  } catch (error) {
    console.error("Status API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
