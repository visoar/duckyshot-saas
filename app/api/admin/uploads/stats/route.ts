import { NextResponse } from "next/server";
import { db } from "@/database";
import { uploads } from "@/database/schema";
import { requireAdmin } from "@/lib/auth/permissions";
import { formatFileSize } from "@/lib/config/upload";
import { count, sum, desc, gte } from "drizzle-orm";

export async function GET() {
  try {
    // Require admin authentication
    await requireAdmin();

    // Get basic upload statistics
    const [basicStats] = await db
      .select({
        total: count(),
        totalSize: sum(uploads.fileSize),
      })
      .from(uploads);

    // Get recent uploads (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [recentStats] = await db
      .select({
        recentUploads: count(),
      })
      .from(uploads)
      .where(gte(uploads.createdAt, twentyFourHoursAgo));

    // Get file type distribution
    const fileTypeStats = await db
      .select({
        contentType: uploads.contentType,
        count: count(),
      })
      .from(uploads)
      .groupBy(uploads.contentType)
      .orderBy(desc(count()))
      .limit(10);

    // Process file types into categories
    const typeCategories: { [key: string]: number } = {};
    fileTypeStats.forEach((stat) => {
      let category = "Other";
      if (stat.contentType.startsWith("image/")) category = "Image";
      else if (stat.contentType.startsWith("video/")) category = "Video";
      else if (stat.contentType.startsWith("audio/")) category = "Audio";
      else if (stat.contentType.includes("pdf")) category = "PDF";
      else if (stat.contentType.startsWith("text/")) category = "Text";
      else if (
        stat.contentType.includes("zip") ||
        stat.contentType.includes("rar")
      )
        category = "Archive";

      typeCategories[category] = (typeCategories[category] || 0) + stat.count;
    });

    // Convert to array and sort
    const topFileTypes = Object.entries(typeCategories)
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / (basicStats.total || 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    const totalSize = Number(basicStats.totalSize) || 0;
    const averageSize = basicStats.total > 0 ? totalSize / basicStats.total : 0;

    const response = {
      total: basicStats.total || 0,
      totalSize,
      totalSizeFormatted: formatFileSize(totalSize),
      averageSize,
      averageSizeFormatted: formatFileSize(averageSize),
      topFileTypes,
      recentUploads: recentStats.recentUploads || 0,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching upload stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch upload statistics" },
      { status: 500 },
    );
  }
}
