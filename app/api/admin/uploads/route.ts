import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { uploads, users } from "@/database/schema";
import { requireAdmin } from "@/lib/auth/permissions";
import { eq, desc, ilike, or, and, sql, like, not } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const fileType = searchParams.get("fileType") || "all";

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    // Search condition
    if (search) {
      conditions.push(
        or(
          ilike(uploads.fileName, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.name, `%${search}%`),
        ),
      );
    }

    // File type filter
    if (fileType !== "all") {
      switch (fileType) {
        case "image":
          conditions.push(like(uploads.contentType, "image/%"));
          break;
        case "video":
          conditions.push(like(uploads.contentType, "video/%"));
          break;
        case "audio":
          conditions.push(like(uploads.contentType, "audio/%"));
          break;
        case "pdf":
          conditions.push(like(uploads.contentType, "%pdf%"));
          break;
        case "text":
          conditions.push(like(uploads.contentType, "text/%"));
          break;
        case "archive":
          conditions.push(
            or(
              like(uploads.contentType, "%zip%"),
              like(uploads.contentType, "%rar%"),
              like(uploads.contentType, "%tar%"),
              like(uploads.contentType, "%7z%"),
            ),
          );
          break;
        case "other":
          conditions.push(
            and(
              not(like(uploads.contentType, "image/%")),
              not(like(uploads.contentType, "video/%")),
              not(like(uploads.contentType, "audio/%")),
              not(like(uploads.contentType, "%pdf%")),
              not(like(uploads.contentType, "text/%")),
              not(like(uploads.contentType, "%zip%")),
              not(like(uploads.contentType, "%rar%")),
              not(like(uploads.contentType, "%tar%")),
              not(like(uploads.contentType, "%7z%")),
            ),
          );
          break;
      }
    }

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    // Get uploads with user information
    const uploadsData = await db
      .select({
        id: uploads.id,
        userId: uploads.userId,
        fileKey: uploads.fileKey,
        url: uploads.url,
        fileName: uploads.fileName,
        fileSize: uploads.fileSize,
        contentType: uploads.contentType,
        createdAt: uploads.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(uploads)
      .innerJoin(users, eq(uploads.userId, users.id))
      .where(whereCondition)
      .orderBy(desc(uploads.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count: totalCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(uploads)
      .innerJoin(users, eq(uploads.userId, users.id))
      .where(whereCondition);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      uploads: uploadsData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    return NextResponse.json(
      { error: "Failed to fetch uploads" },
      { status: 500 },
    );
  }
}
