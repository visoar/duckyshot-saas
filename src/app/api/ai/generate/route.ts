import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { AIWorkflowService, UserCreditsService } from "@/lib/database/ai";
import { aiService } from "@/lib/ai/provider";
import {
  getStyleById,
  generateStylePrompt,
  generateNegativePrompt,
} from "@/lib/ai/styles";
import { db } from "@/database";
import { uploads } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Request validation schema
const generateRequestSchema = z.object({
  uploadId: z.string().uuid("Invalid upload ID"),
  styleId: z.string().min(1, "Style ID is required"),
  petDescription: z.string().optional(),
  numImages: z.number().min(1).max(4).default(2),
  isPrivate: z.boolean().optional().default(false), // Whether this is a private generation (paid feature)
  title: z.string().optional(), // Optional title for the artwork
  description: z.string().optional(), // Optional description for the artwork
});

export async function POST(request: NextRequest) {
  console.log("🚀 AI Generate API called");

  try {
    // Authenticate user
    console.log("🔍 Checking authentication...");
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      console.log("❌ Authentication failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log("✅ User authenticated:", userId);

    // Parse and validate request body
    console.log("📋 Parsing request body...");
    const body = await request.json();
    console.log("📋 Request body:", body);

    const {
      uploadId,
      styleId,
      petDescription,
      numImages,
      isPrivate,
      title,
      description,
    } = generateRequestSchema.parse(body);

    console.log(
      "✅ Request validated - uploadId:",
      uploadId,
      "styleId:",
      styleId,
      "numImages:",
      numImages,
    );

    // Check if user has enough credits
    console.log("💳 Checking user credits...");
    const hasCredits = await UserCreditsService.hasEnoughCredits(
      userId,
      numImages,
    );
    if (!hasCredits) {
      console.log("❌ Insufficient credits");
      return NextResponse.json(
        {
          error: "Insufficient credits",
          message:
            "You don't have enough credits to generate images. Please purchase more credits.",
        },
        { status: 400 },
      );
    }
    console.log("✅ Credits check passed");

    // Get style information
    const style = getStyleById(styleId);
    if (!style) {
      return NextResponse.json({ error: "Invalid style ID" }, { status: 400 });
    }

    // Get upload information and verify it belongs to the user
    const [upload] = await db
      .select()
      .from(uploads)
      .where(and(eq(uploads.id, uploadId), eq(uploads.userId, userId)));

    if (!upload) {
      return NextResponse.json(
        { error: "Upload not found or does not belong to user" },
        { status: 400 },
      );
    }

    // Use the actual upload URL for AI generation
    const imageUrl = upload.url;

    // Generate AI prompts
    const stylePrompt = generateStylePrompt(style, petDescription);
    const negativePrompt = generateNegativePrompt(style);

    // Prepare generation parameters
    const generationParams = {
      imageUrl,
      stylePrompt,
      negativePrompt,
      numImages,
      guidance: style.metadata.guidance,
      strength: style.metadata.strength,
    };

    // Start the AI generation workflow
    const artwork = await AIWorkflowService.startGeneration({
      userId,
      originalImageUploadId: uploadId,
      styleId,
      generationParams,
      creditsRequired: numImages,
      isPrivate,
      title,
      description,
    });

    // Start AI generation (async)
    // In a real implementation, this would be queued for background processing
    console.log("🎨 Starting AI generation with params:", generationParams);
    try {
      const result = await aiService.generatePetArt(generationParams);
      console.log("✅ AI generation completed:", result);

      // If generation was successful, upload images to R2
      let finalImages = result.images;
      if (
        result.status === "completed" &&
        result.images &&
        result.images.length > 0
      ) {
        const uploadResult = await aiService.uploadGeneratedImagesToR2(
          result.images,
          userId,
        );

        if (uploadResult.success && uploadResult.r2Urls) {
          // Use R2 URLs instead of fal URLs
          finalImages = uploadResult.r2Urls;
        } else {
          console.warn(
            "Failed to upload images to R2, using original URLs:",
            uploadResult.error,
          );
          // Continue with original URLs if R2 upload fails
        }
      }

      // Update artwork with results (using R2 URLs if upload was successful)
      const finalResult = {
        ...result,
        images: finalImages,
      };

      await AIWorkflowService.completeGeneration(artwork.id, finalResult);

      return NextResponse.json({
        success: true,
        artworkId: artwork.id,
        status: result.status,
        images: finalImages,
        creditsUsed: numImages,
      });
    } catch (aiError) {
      // If AI generation fails, we should handle it gracefully
      console.error("AI generation failed:", aiError);

      // Update artwork status to failed
      await AIWorkflowService.completeGeneration(artwork.id, {
        id: artwork.id,
        status: "failed",
        error:
          aiError instanceof Error ? aiError.message : "AI generation failed",
      });

      return NextResponse.json({
        success: false,
        artworkId: artwork.id,
        status: "failed",
        error: "AI generation failed. Your credits have been refunded.",
        creditsUsed: 0, // Credits should be refunded on failure
      });
    }
  } catch (error) {
    console.error("Generate API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
