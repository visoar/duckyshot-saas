import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { aiArtworks, aiStyles, users } from "@/database/schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { z } from "zod";

const querySchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("20").transform(Number),
  style: z.string().optional(),
  sort: z
    .enum(["newest", "oldest", "popular", "trending"])
    .optional()
    .default("newest"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, style, sort } = querySchema.parse({
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      style: searchParams.get("style") || undefined,
      sort: searchParams.get("sort") || undefined,
    });

    // Validate pagination limits
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const offset = (page - 1) * limit;

    // Build base condition
    const baseCondition = and(
      eq(aiArtworks.isPublic, true),
      eq(aiArtworks.status, "completed"),
      ...(style && style !== "all" ? [eq(aiStyles.category, style)] : []),
    );

    // Build the query with proper order
    let orderBy;
    switch (sort) {
      case "oldest":
        orderBy = asc(aiArtworks.createdAt);
        break;
      case "popular":
        // For now, sort by shared date (when made public)
        orderBy = desc(aiArtworks.sharedAt);
        break;
      case "trending":
        // For now, sort by recent shared date
        orderBy = desc(aiArtworks.sharedAt);
        break;
      case "newest":
      default:
        orderBy = desc(aiArtworks.createdAt);
        break;
    }

    // Execute query
    const artworks = await db
      .select({
        id: aiArtworks.id,
        title: aiArtworks.title,
        description: aiArtworks.description,
        generatedImages: aiArtworks.generatedImages,
        status: aiArtworks.status,
        creditsUsed: aiArtworks.creditsUsed,
        isPublic: aiArtworks.isPublic,
        isPrivate: aiArtworks.isPrivate,
        sharedAt: aiArtworks.sharedAt,
        createdAt: aiArtworks.createdAt,
        completedAt: aiArtworks.completedAt,
        style: {
          id: aiStyles.id,
          name: aiStyles.name,
          category: aiStyles.category,
        },
        user: {
          id: users.id,
          name: users.name,
          image: users.image,
        },
      })
      .from(aiArtworks)
      .leftJoin(aiStyles, eq(aiArtworks.styleId, aiStyles.id))
      .leftJoin(users, eq(aiArtworks.userId, users.id))
      .where(baseCondition)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiArtworks)
      .leftJoin(aiStyles, eq(aiArtworks.styleId, aiStyles.id))
      .where(baseCondition);

    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      artworks,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Public gallery fetch error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch public artworks" },
      { status: 500 },
    );
  }
}
