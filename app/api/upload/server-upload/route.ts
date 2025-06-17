import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { createPresignedUrl } from '@/lib/r2';
import { z } from 'zod';
import { db } from '@/database';
import { uploads } from '@/database/schema';

// Request body schema for server upload
const serverUploadSchema = z.object({
  files: z.array(z.object({
    fileName: z.string().min(1).max(255),
    contentType: z.string().min(1),
    size: z.number().positive(),
    base64Data: z.string().min(1), // Base64 encoded file data
  })),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = serverUploadSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { files } = validation.data;
    const uploadResults = [];

    // Process each file
    for (const file of files) {
      try {
        // Create presigned URL for the file
        const result = await createPresignedUrl({
          userId: session.user.id,
          fileName: file.fileName,
          contentType: file.contentType,
          size: file.size,
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to create presigned URL');
        }

        // Convert base64 to buffer
        const base64Data = file.base64Data.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Upload file to R2 using presigned URL
        const uploadResponse = await fetch(result.presignedUrl!, {
          method: 'PUT',
          body: buffer,
          headers: {
            'Content-Type': file.contentType,
            'Content-Length': buffer.length.toString(),
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        // Store upload record in database
        if (result.key && result.publicUrl) {
          await db.insert(uploads).values({
            userId: session.user.id,
            fileKey: result.key,
            url: result.publicUrl,
            fileName: file.fileName,
            fileSize: file.size,
            contentType: file.contentType,
          });
        }

        uploadResults.push({
          fileName: file.fileName,
          url: result.publicUrl,
          key: result.key,
          size: file.size,
          contentType: file.contentType,
          success: true,
        });
      } catch (error) {
        console.error(`Error uploading file ${file.fileName}:`, error);
        uploadResults.push({
          fileName: file.fileName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = uploadResults.filter(r => r.success).length;
    const failureCount = uploadResults.length - successCount;

    return NextResponse.json({
      message: `Uploaded ${successCount} file(s) successfully${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
      results: uploadResults,
      summary: {
        total: uploadResults.length,
        success: successCount,
        failed: failureCount,
      },
    });
  } catch (error) {
    console.error('Error in server upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}