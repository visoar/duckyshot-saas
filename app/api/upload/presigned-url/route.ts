import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { createPresignedUrl } from '@/lib/r2';
import { z } from 'zod';
import { db } from '@/database';
import { uploads } from '@/database/schema';

// Request body schema
const presignedUrlSchema = z.object({
  fileName: z.string().min(1).max(255),
  contentType: z.string().min(1),
  size: z.number().positive(),
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
    const validation = presignedUrlSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validation.data;

    // Create presigned URL
    const result = await createPresignedUrl({
      userId: session.user.id,
      fileName,
      contentType,
      size,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Store upload record in database (pending status)
    if (result.key && result.publicUrl) {
      await db.insert(uploads).values({
        userId: session.user.id,
        fileKey: result.key,
        url: result.publicUrl,
        fileName,
        fileSize: size,
        contentType,
      });
    }

    return NextResponse.json({
      presignedUrl: result.presignedUrl,
      publicUrl: result.publicUrl,
      key: result.key,
    });
  } catch (error) {
    console.error('Error creating presigned URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}