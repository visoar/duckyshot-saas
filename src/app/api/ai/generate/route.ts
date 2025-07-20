import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { AIWorkflowService, UserCreditsService } from "@/lib/database/ai";
import { aiService } from "@/lib/ai/provider";
import { getStyleById, generateStylePrompt, generateNegativePrompt } from "@/lib/ai/styles";
import { z } from "zod";

// Request validation schema
const generateRequestSchema = z.object({
  uploadId: z.string().uuid("Invalid upload ID"),
  styleId: z.string().min(1, "Style ID is required"),
  petDescription: z.string().optional(),
  numImages: z.number().min(1).max(4).default(2),
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse and validate request body
    const body = await request.json();
    const { uploadId, styleId, petDescription, numImages } = generateRequestSchema.parse(body);

    // Check if user has enough credits
    const hasCredits = await UserCreditsService.hasEnoughCredits(userId, numImages);
    if (!hasCredits) {
      return NextResponse.json(
        { 
          error: "Insufficient credits",
          message: "You don't have enough credits to generate images. Please purchase more credits."
        },
        { status: 400 }
      );
    }

    // Get style information
    const style = getStyleById(styleId);
    if (!style) {
      return NextResponse.json(
        { error: "Invalid style ID" },
        { status: 400 }
      );
    }

    // Get upload information (would need to check if upload exists and belongs to user)
    // For now, we'll create a placeholder image URL
    const imageUrl = `https://your-r2-domain.com/uploads/${uploadId}`;

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
    });

    // Start AI generation (async)
    // In a real implementation, this would be queued for background processing
    try {
      const result = await aiService.generatePetArt(generationParams);
      
      // Update artwork with results
      await AIWorkflowService.completeGeneration(artwork.id, result);

      return NextResponse.json({
        success: true,
        artworkId: artwork.id,
        status: result.status,
        images: result.images,
        creditsUsed: numImages,
      });
    } catch (aiError) {
      // If AI generation fails, we should handle it gracefully
      console.error("AI generation failed:", aiError);
      
      // Update artwork status to failed
      await AIWorkflowService.completeGeneration(artwork.id, {
        id: artwork.id,
        status: "failed",
        error: aiError instanceof Error ? aiError.message : "AI generation failed",
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
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}