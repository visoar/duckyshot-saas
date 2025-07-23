import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 },
      );
    }

    // Fetch the image from the external URL
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Content-Length": imageBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Download proxy error:", error);
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 },
    );
  }
}
