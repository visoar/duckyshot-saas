import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { uploads, users } from "@/database/schema";
import { requireAdmin } from "@/lib/auth/permissions";
import { eq, desc, ilike, or, and, like, not, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const fileType = searchParams.get("fileType") || "all";

    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(uploads.fileName, `%${search}%`),
          ilike(users.email, `%${search}%`),
          ilike(users.name, `%${search}%`),
        ),
      );
    }

    if (fileType !== "all") {
      const typeConditions = {
        image: like(uploads.contentType, "image/%"),
        video: like(uploads.contentType, "video/%"),
        audio: like(uploads.contentType, "audio/%"),
        pdf: eq(uploads.contentType, "application/pdf"),
        text: like(uploads.contentType, "text/%"),
        archive: or(
          like(uploads.contentType, "%zip%"),
          like(uploads.contentType, "%rar%"),
          like(uploads.contentType, "%tar%"),
          like(uploads.contentType, "%7z%"),
        ),
      };

      if (fileType in typeConditions) {
        conditions.push(
          typeConditions[fileType as keyof typeof typeConditions],
        );
      } else if (fileType === "other") {
        conditions.push(
          and(
            not(like(uploads.contentType, "image/%")),
            not(like(uploads.contentType, "video/%")),
            not(like(uploads.contentType, "audio/%")),
            not(eq(uploads.contentType, "application/pdf")),
            not(like(uploads.contentType, "text/%")),
            not(like(uploads.contentType, "%zip%")),
            not(like(uploads.contentType, "%rar%")),
            not(like(uploads.contentType, "%tar%")),
            not(like(uploads.contentType, "%7z%")),
          ),
        );
      }
    }

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

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

    const [{ total: totalCount }] = await db
      .select({ total: count() })
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
