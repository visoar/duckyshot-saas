import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { AIArtworkService } from "@/lib/database/ai";
import { db } from "@/database";
import { aiArtworks } from "@/database/schema";
import { eq, and, inArray, isNull } from "drizzle-orm";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  status: z
    .enum(["pending", "processing", "completed", "failed"])
    .optional()
    .nullable(),
  privacy: z.enum(["public", "private"]).optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const { page, limit, status, privacy } = querySchema.parse({
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      status: searchParams.get("status") || undefined,
      privacy: searchParams.get("privacy") || undefined,
    });

    const offset = (page - 1) * limit;

    // Get user's artworks
    const artworks = await AIArtworkService.getUserArtworks(
      userId,
      limit,
      offset,
    );
    const totalCount = await AIArtworkService.getUserArtworkCount(userId);

    // Filter by status and privacy if specified
    let filteredArtworks = artworks;

    if (status && status !== null) {
      filteredArtworks = filteredArtworks.filter(
        (item) => item.artwork.status === status,
      );
    }

    if (privacy && privacy !== null) {
      if (privacy === "public") {
        filteredArtworks = filteredArtworks.filter(
          (item) => item.artwork.isPublic === true,
        );
      } else if (privacy === "private") {
        filteredArtworks = filteredArtworks.filter(
          (item) => item.artwork.isPublic === false,
        );
      }
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      artworks: filteredArtworks.map((item) => ({
        id: item.artwork.id,
        title: item.artwork.title,
        description: item.artwork.description,
        status: item.artwork.status,
        generatedImages: item.artwork.generatedImages,
        creditsUsed: item.artwork.creditsUsed,
        isPublic: item.artwork.isPublic,
        isPrivate: item.artwork.isPrivate,
        sharedAt: item.artwork.sharedAt,
        createdAt: item.artwork.createdAt,
        completedAt: item.artwork.completedAt,
        style: item.style,
        originalImage: item.originalUpload,
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Artworks API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

const deleteSchema = z.object({
  artworkIds: z
    .array(z.string().uuid())
    .min(1, "At least one artwork ID is required"),
});

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { artworkIds } = deleteSchema.parse(body);

    // Soft delete artworks that belong to the user
    const deletedArtworks = await db
      .update(aiArtworks)
      .set({ 
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(aiArtworks.userId, userId), 
          inArray(aiArtworks.id, artworkIds),
          isNull(aiArtworks.deletedAt) // Only delete non-deleted artworks
        ),
      )
      .returning({ id: aiArtworks.id });

    // Get which artworks were actually deleted
    const deletedIds = deletedArtworks.map((a) => a.id);
    const notFoundIds = artworkIds.filter((id) => !deletedIds.includes(id));

    return NextResponse.json({
      success: true,
      deletedIds,
      notFoundIds: notFoundIds.length > 0 ? notFoundIds : undefined,
      message: `Successfully deleted ${deletedIds.length} artwork(s)`,
    });
  } catch (error) {
    console.error("Delete artworks API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
