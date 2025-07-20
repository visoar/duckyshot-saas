import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { AIArtworkService } from "@/lib/database/ai";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const { page, limit, status } = querySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      status: searchParams.get("status"),
    });

    const offset = (page - 1) * limit;

    // Get user's artworks
    const artworks = await AIArtworkService.getUserArtworks(userId, limit, offset);
    const totalCount = await AIArtworkService.getUserArtworkCount(userId);

    // Filter by status if specified
    const filteredArtworks = status 
      ? artworks.filter(item => item.artwork.status === status)
      : artworks;

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      artworks: filteredArtworks.map(item => ({
        id: item.artwork.id,
        status: item.artwork.status,
        generatedImages: item.artwork.generatedImages,
        creditsUsed: item.artwork.creditsUsed,
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
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}