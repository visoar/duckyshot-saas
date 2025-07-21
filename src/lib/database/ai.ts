import { db } from "@/database";
import { 
  aiArtworks, 
  aiStyles, 
  userCredits, 
  uploads,
  aiGenerationStatusEnum 
} from "@/database/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import type { AIGenerationParams, AIGenerationResult } from "@/lib/ai/provider";

// Types
export type AIArtworkStatus = typeof aiGenerationStatusEnum.enumValues[number];

export interface CreateArtworkParams {
  userId: string;
  originalImageUploadId: string;
  styleId: string;
  generationParams: AIGenerationParams;
  creditsUsed?: number;
}

export interface UpdateArtworkParams {
  id: string;
  status: AIArtworkStatus;
  generatedImages?: string[];
  errorMessage?: string;
  processingStartedAt?: Date;
  completedAt?: Date;
}

// AI Artworks Database Operations
export class AIArtworkService {
  // Create new artwork generation request
  static async createArtwork(params: CreateArtworkParams) {
    const [artwork] = await db
      .insert(aiArtworks)
      .values({
        userId: params.userId,
        originalImageUploadId: params.originalImageUploadId,
        styleId: params.styleId,
        status: "pending",
        generationParams: params.generationParams,
        creditsUsed: params.creditsUsed || 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return artwork;
  }

  // Update artwork with generation results
  static async updateArtwork(params: UpdateArtworkParams) {
    const [artwork] = await db
      .update(aiArtworks)
      .set({
        status: params.status,
        generatedImages: params.generatedImages,
        errorMessage: params.errorMessage,
        processingStartedAt: params.processingStartedAt,
        completedAt: params.completedAt,
        updatedAt: new Date(),
      })
      .where(eq(aiArtworks.id, params.id))
      .returning();

    return artwork;
  }

  // Get artwork by ID with upload info
  static async getArtworkById(id: string) {
    const [artwork] = await db
      .select({
        artwork: aiArtworks,
        originalUpload: uploads,
        style: aiStyles,
      })
      .from(aiArtworks)
      .leftJoin(uploads, eq(aiArtworks.originalImageUploadId, uploads.id))
      .leftJoin(aiStyles, eq(aiArtworks.styleId, aiStyles.id))
      .where(eq(aiArtworks.id, id));

    return artwork;
  }

  // Get user's artworks with pagination
  static async getUserArtworks(userId: string, limit = 20, offset = 0) {
    const artworks = await db
      .select({
        artwork: aiArtworks,
        originalUpload: uploads,
        style: aiStyles,
      })
      .from(aiArtworks)
      .leftJoin(uploads, eq(aiArtworks.originalImageUploadId, uploads.id))
      .leftJoin(aiStyles, eq(aiArtworks.styleId, aiStyles.id))
      .where(eq(aiArtworks.userId, userId))
      .orderBy(desc(aiArtworks.createdAt))
      .limit(limit)
      .offset(offset);

    return artworks;
  }

  // Get artwork count by user
  static async getUserArtworkCount(userId: string) {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiArtworks)
      .where(eq(aiArtworks.userId, userId));

    return result.count;
  }

  // Get pending artworks for processing
  static async getPendingArtworks(limit = 10) {
    const artworks = await db
      .select({
        artwork: aiArtworks,
        originalUpload: uploads,
        style: aiStyles,
      })
      .from(aiArtworks)
      .leftJoin(uploads, eq(aiArtworks.originalImageUploadId, uploads.id))
      .leftJoin(aiStyles, eq(aiArtworks.styleId, aiStyles.id))
      .where(eq(aiArtworks.status, "pending"))
      .orderBy(aiArtworks.createdAt)
      .limit(limit);

    return artworks;
  }
}

// AI Styles Database Operations
export class AIStyleService {
  // Get all active styles
  static async getActiveStyles() {
    return db
      .select()
      .from(aiStyles)
      .where(eq(aiStyles.isActive, true))
      .orderBy(aiStyles.sortOrder, aiStyles.name);
  }

  // Get styles by category
  static async getStylesByCategory(category: string) {
    return db
      .select()
      .from(aiStyles)
      .where(and(eq(aiStyles.category, category), eq(aiStyles.isActive, true)))
      .orderBy(aiStyles.sortOrder, aiStyles.name);
  }

  // Get style by ID
  static async getStyleById(id: string) {
    const [style] = await db
      .select()
      .from(aiStyles)
      .where(eq(aiStyles.id, id));

    return style;
  }

  // Create or update style
  static async upsertStyle(styleData: typeof aiStyles.$inferInsert) {
    const [style] = await db
      .insert(aiStyles)
      .values({
        ...styleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: aiStyles.id,
        set: {
          ...styleData,
          updatedAt: new Date(),
        },
      })
      .returning();

    return style;
  }
}

// User Credits Database Operations
export class UserCreditsService {
  // Get user credits
  static async getUserCredits(userId: string) {
    const [credits] = await db
      .select()
      .from(userCredits)
      .where(eq(userCredits.userId, userId));

    return credits;
  }

  // Initialize user credits (for new users)
  static async initializeUserCredits(userId: string, initialCredits = 3) {
    const [credits] = await db
      .insert(userCredits)
      .values({
        userId,
        totalCredits: initialCredits,
        usedCredits: 0,
        remainingCredits: initialCredits,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing()
      .returning();

    return credits;
  }

  // Add credits to user account
  static async addCredits(userId: string, creditsToAdd: number) {
    const [credits] = await db
      .update(userCredits)
      .set({
        totalCredits: sql`${userCredits.totalCredits} + ${creditsToAdd}`,
        remainingCredits: sql`${userCredits.remainingCredits} + ${creditsToAdd}`,
        updatedAt: new Date(),
      })
      .where(eq(userCredits.userId, userId))
      .returning();

    return credits;
  }

  // Deduct credits for generation
  static async deductCredits(userId: string, creditsToUse: number) {
    // Check if user has enough credits
    const userCreditsRecord = await this.getUserCredits(userId);
    
    if (!userCreditsRecord || userCreditsRecord.remainingCredits < creditsToUse) {
      throw new Error("Insufficient credits");
    }

    // Deduct credits
    const [credits] = await db
      .update(userCredits)
      .set({
        usedCredits: sql`${userCredits.usedCredits} + ${creditsToUse}`,
        remainingCredits: sql`${userCredits.remainingCredits} - ${creditsToUse}`,
        updatedAt: new Date(),
      })
      .where(eq(userCredits.userId, userId))
      .returning();

    return credits;
  }

  // Check if user has enough credits
  static async hasEnoughCredits(userId: string, requiredCredits: number) {
    const credits = await this.getUserCredits(userId);
    return credits ? credits.remainingCredits >= requiredCredits : false;
  }
}

// Combined AI Service for artwork generation workflow
export class AIWorkflowService {
  // Start artwork generation process
  static async startGeneration(params: {
    userId: string;
    originalImageUploadId: string;
    styleId: string;
    generationParams: AIGenerationParams;
    creditsRequired?: number;
  }) {
    const creditsRequired = params.creditsRequired || 1;

    // Check if user has enough credits
    const hasCredits = await UserCreditsService.hasEnoughCredits(
      params.userId, 
      creditsRequired
    );

    if (!hasCredits) {
      throw new Error("Insufficient credits");
    }

    // Create artwork record
    const artwork = await AIArtworkService.createArtwork({
      userId: params.userId,
      originalImageUploadId: params.originalImageUploadId,
      styleId: params.styleId,
      generationParams: params.generationParams,
      creditsUsed: creditsRequired,
    });

    // Deduct credits
    await UserCreditsService.deductCredits(params.userId, creditsRequired);

    return artwork;
  }

  // Complete artwork generation
  static async completeGeneration(
    artworkId: string, 
    result: AIGenerationResult
  ) {
    const status: AIArtworkStatus = result.status === "completed" ? "completed" : 
                                   result.status === "failed" ? "failed" : "processing";

    // If generation failed, refund the credits
    if (status === "failed") {
      // First get the artwork to see how many credits were used
      const artwork = await AIArtworkService.getArtworkById(artworkId);
      if (artwork && artwork.artwork.creditsUsed > 0) {
        // Refund the credits back to the user
        await UserCreditsService.addCredits(
          artwork.artwork.userId, 
          artwork.artwork.creditsUsed
        );
      }
    }

    return AIArtworkService.updateArtwork({
      id: artworkId,
      status,
      generatedImages: result.images,
      errorMessage: result.error,
      completedAt: status === "completed" || status === "failed" ? new Date() : undefined,
    });
  }
}