import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { createPresignedUrl } from "@/lib/r2";
import { db } from "@/database";
import { uploads } from "@/database/schema";
import {
  isFileTypeAllowed,
  isFileSizeAllowed,
  UPLOAD_CONFIG,
  formatFileSize,
  presignedUrlRequestSchema, // 导入 Zod schema
} from "@/lib/config/upload";
import { rateLimiters } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting check
    const rateLimitResult = await rateLimiters.upload(request);
    if (!rateLimitResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many upload requests, please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // 2. 认证检查
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. 解析和验证请求体
    const body = await request.json();
    const validation = presignedUrlRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { fileName, contentType, size } = validation.data;

    // 4. 服务器端文件规则验证 (关键安全修复)
    if (!isFileTypeAllowed(contentType)) {
      return NextResponse.json(
        { error: `File type '${contentType}' is not allowed.` },
        { status: 400 },
      );
    }

    if (!isFileSizeAllowed(size)) {
      return NextResponse.json(
        {
          error: `File size of ${formatFileSize(size)} exceeds the limit of ${formatFileSize(UPLOAD_CONFIG.MAX_FILE_SIZE)}.`,
        },
        { status: 400 },
      );
    }

    // 5. 创建预签名 URL
    const result = await createPresignedUrl({
      userId: session.user.id,
      fileName,
      contentType,
      size,
    });

    if (!result.success) {
      // createPresignedUrl 内部已经包含了验证，但我们在这里再次捕获以防万一
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // 6. 在数据库中存储待上传记录 (pending status)
    // 注意：这里的状态是隐式的。上传成功后，客户端不需再通知服务端。
    // 如果需要更严格的上传状态管理（例如，确认上传完成），则需要额外的步骤。
    if (result.key && result.publicUrl) {
      await db.insert(uploads).values({
        userId: session.user.id,
        fileKey: result.key,
        url: result.publicUrl,
        fileName,
        fileSize: size,
        contentType,
        // status: 'pending' // 可以添加一个状态字段
      });
    }

    // 7. 返回预签名 URL 给客户端
    const response = NextResponse.json({
      presignedUrl: result.presignedUrl,
      publicUrl: result.publicUrl,
      key: result.key,
    });

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString());

    return response;
  } catch (error) {
    console.error("Error creating presigned URL:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." },
      { status: 500 },
    );
  }
}