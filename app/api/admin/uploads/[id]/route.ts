import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { uploads } from "@/database/schema";
import { requireAdmin } from "@/lib/auth/permissions";
import { eq } from "drizzle-orm";
import { deleteFile } from "@/lib/r2";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    // Require admin authentication
    await requireAdmin();

    const uploadId = id;

    // Get upload record
    const [upload] = await db
      .select()
      .from(uploads)
      .where(eq(uploads.id, uploadId))
      .limit(1);

    if (!upload) {
      return NextResponse.json({ error: "Upload not found" }, { status: 404 });
    }

    // Delete file from R2 storage
    const deleteResult = await deleteFile(upload.fileKey);
    if (!deleteResult.success) {
      console.error("Error deleting file from storage:", deleteResult.error);
      // Continue with database deletion even if storage deletion fails
      // This prevents orphaned database records
    }

    // Delete upload record from database
    await db.delete(uploads).where(eq(uploads.id, uploadId));

    return NextResponse.json({
      message: "Upload deleted successfully",
      deletedUpload: {
        id: upload.id,
        fileName: upload.fileName,
        fileKey: upload.fileKey,
      },
    });
  } catch (error) {
    console.error("Error deleting upload:", error);
    return NextResponse.json(
      { error: "Failed to delete upload" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    // Require admin authentication
    await requireAdmin();

    const uploadId = id;

    // Get upload record with user information
    const [upload] = await db
      .select({
        id: uploads.id,
        userId: uploads.userId,
        fileKey: uploads.fileKey,
        url: uploads.url,
        fileName: uploads.fileName,
        fileSize: uploads.fileSize,
        contentType: uploads.contentType,
        createdAt: uploads.createdAt,
      })
      .from(uploads)
      .where(eq(uploads.id, uploadId))
      .limit(1);

    if (!upload) {
      return NextResponse.json({ error: "Upload not found" }, { status: 404 });
    }

    return NextResponse.json({ upload });
  } catch (error) {
    console.error("Error fetching upload:", error);
    return NextResponse.json(
      { error: "Failed to fetch upload" },
      { status: 500 },
    );
  }
}
