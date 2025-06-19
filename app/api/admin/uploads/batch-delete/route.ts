import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { db } from "@/database";
import { uploads } from "@/database/tables";
import { inArray } from "drizzle-orm";
import { deleteFile } from "@/lib/r2";

export async function DELETE(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { uploadIds }: { uploadIds: string[] } = await request.json();

    if (!uploadIds || !Array.isArray(uploadIds) || uploadIds.length === 0) {
      return NextResponse.json(
        { error: "Upload IDs are required" },
        { status: 400 },
      );
    }

    // Fetch upload records to get file keys for R2 deletion
    const uploadRecords = await db
      .select({
        id: uploads.id,
        fileKey: uploads.fileKey,
        fileName: uploads.fileName,
      })
      .from(uploads)
      .where(inArray(uploads.id, uploadIds));

    if (uploadRecords.length === 0) {
      return NextResponse.json({ error: "No uploads found" }, { status: 404 });
    }

    // Delete files from R2 storage
    const deletePromises = uploadRecords.map(async (upload) => {
      const deleteResult = await deleteFile(upload.fileKey);
      if (deleteResult.success) {
        return {
          success: true,
          uploadId: upload.id,
          fileName: upload.fileName,
        };
      } else {
        console.error(
          `Failed to delete file ${upload.fileKey} from R2:`,
          deleteResult.error,
        );
        return {
          success: false,
          uploadId: upload.id,
          fileName: upload.fileName,
          error: deleteResult.error as unknown,
        };
      }
    });

    const deleteResults = await Promise.allSettled(deletePromises);

    // Track successful and failed deletions
    const successfulDeletions: string[] = [];
    const failedDeletions: {
      uploadId: string;
      fileName: string;
      error?: unknown;
    }[] = [];

    deleteResults.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.success) {
        successfulDeletions.push(result.value.uploadId);
      } else {
        const upload = uploadRecords[index];
        failedDeletions.push({
          uploadId: upload.id,
          fileName: upload.fileName,
          error:
            result.status === "rejected" ? result.reason : result.value.error,
        });
      }
    });

    // Delete records from database for successful R2 deletions
    let deletedCount = 0;
    if (successfulDeletions.length > 0) {
      await db.delete(uploads).where(inArray(uploads.id, successfulDeletions));
      deletedCount = successfulDeletions.length;
    }

    return NextResponse.json({
      message: `Successfully deleted ${deletedCount} uploads`,
      deletedCount,
      totalRequested: uploadIds.length,
      successfulDeletions: successfulDeletions.length,
      failedDeletions: failedDeletions.length,
      failures: failedDeletions.length > 0 ? failedDeletions : undefined,
    });
  } catch (error) {
    console.error("Batch delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
