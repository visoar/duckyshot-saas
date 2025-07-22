import env from "@/env";
import { uploadFromUrl } from "@/lib/r2";
import { randomUUID } from "crypto";
import { getFileExtension } from "@/lib/config/upload";

// AI Generation Parameters
export interface AIGenerationParams {
  imageUrl: string;
  stylePrompt: string;
  negativePrompt?: string;
  numImages?: number;
  strength?: number;
  guidance?: number;
  seed?: number;
}

// AI Generation Result
export interface AIGenerationResult {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  images?: string[];
  error?: string;
  progress?: number;
}

// Abstract AI Provider Interface
export abstract class AIProvider {
  abstract generateImages(
    params: AIGenerationParams,
  ): Promise<AIGenerationResult>;
  abstract getStatus(jobId: string): Promise<AIGenerationResult>;
}

// Fal.ai Provider Implementation using FLUX Pro Kontext for image editing
export class FalAIProvider extends AIProvider {
  private apiKey: string;
  private modelEndpoint = "fal-ai/flux-pro/kontext";

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  /**
   * Upload images from URLs to R2 storage
   */
  private async uploadImagesToR2(
    imageUrls: string[],
    userId: string,
  ): Promise<{ success: boolean; r2Urls?: string[]; error?: string }> {
    try {
      const uploadPromises = imageUrls.map(async (imageUrl, index) => {
        // Generate unique key for each image
        const timestamp = Date.now();
        const uuid = randomUUID();
        const fileExtension = getFileExtension("image/jpeg"); // Default to jpeg for AI generated images
        const key = `ai-generated/${userId}/${timestamp}-${uuid}-${index}.${fileExtension}`;

        const result = await uploadFromUrl(imageUrl, key, "image/jpeg");

        if (!result.success) {
          throw new Error(`Failed to upload image ${index}: ${result.error}`);
        }

        return result.url!;
      });

      const r2Urls = await Promise.all(uploadPromises);

      return {
        success: true,
        r2Urls,
      };
    } catch (error) {
      console.error("Error uploading images to R2:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload images to R2",
      };
    }
  }

  async generateImages(
    params: AIGenerationParams,
  ): Promise<AIGenerationResult> {
    try {
      // Dynamically import fal client to avoid SSR issues
      const { fal } = await import("@fal-ai/client");

      // Configure the client with API key
      fal.config({
        credentials: this.apiKey,
      });

      // Use FLUX Pro Kontext for image editing with style prompts
      const result = await fal.subscribe(this.modelEndpoint, {
        input: {
          prompt: params.stylePrompt,
          image_url: params.imageUrl,
          guidance_scale: params.guidance || 3.5,
          num_images: params.numImages || 2,
          safety_tolerance: "2",
          seed: params.seed,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log(
              "Generation in progress:",
              update.logs?.map((log) => log.message).join(", "),
            );
          }
        },
      });

      if (!result.data?.images || result.data.images.length === 0) {
        throw new Error("No images generated from Fal.ai API");
      }

      // Extract fal image URLs
      const falImageUrls = result.data.images.map(
        (img: { url: string }) => img.url,
      );

      // Upload images to R2 storage (we need userId from context)
      // For now, we'll return fal URLs and handle R2 upload in the service layer
      // This allows us to access userId from the API context

      return {
        id: result.requestId || Date.now().toString(),
        status: "completed",
        images: falImageUrls,
      };
    } catch (error) {
      console.error("Fal.ai generation error:", error);
      return {
        id: Date.now().toString(),
        status: "failed",
        error: error instanceof Error ? error.message : "AI generation failed",
      };
    }
  }

  /**
   * Upload fal.ai images to R2 (to be called from service layer with userId)
   */
  async uploadGeneratedImagesToR2(
    falImageUrls: string[],
    userId: string,
  ): Promise<{ success: boolean; r2Urls?: string[]; error?: string }> {
    return this.uploadImagesToR2(falImageUrls, userId);
  }

  async getStatus(jobId: string): Promise<AIGenerationResult> {
    try {
      const { fal } = await import("@fal-ai/client");

      fal.config({
        credentials: this.apiKey,
      });

      const status = await fal.queue.status(this.modelEndpoint, {
        requestId: jobId,
        logs: true,
      });

      if (status.status === "COMPLETED") {
        const result = await fal.queue.result(this.modelEndpoint, {
          requestId: jobId,
        });

        return {
          id: jobId,
          status: "completed",
          images:
            result.data?.images?.map((img: { url: string }) => img.url) || [],
        };
      } else if (
        status.status &&
        ["TIMEOUT", "FAILED", "CANCELLED"].includes(status.status as string)
      ) {
        return {
          id: jobId,
          status: "failed",
          error: "Generation failed",
        };
      } else {
        return {
          id: jobId,
          status: "processing",
          progress: 0.5,
        };
      }
    } catch (error) {
      return {
        id: jobId,
        status: "failed",
        error: error instanceof Error ? error.message : "Status check failed",
      };
    }
  }
}

// Replicate Provider Implementation
export class ReplicateProvider extends AIProvider {
  private apiToken: string;
  private baseUrl = "https://api.replicate.com/v1/predictions";

  constructor(apiToken: string) {
    super();
    this.apiToken = apiToken;
  }

  async generateImages(
    params: AIGenerationParams,
  ): Promise<AIGenerationResult> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Token ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version:
            "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
          input: {
            image: params.imageUrl,
            prompt: params.stylePrompt,
            negative_prompt: params.negativePrompt || "",
            num_outputs: params.numImages || 2,
            guidance_scale: params.guidance || 7.5,
            num_inference_steps: 50,
            strength: params.strength || 0.8,
            seed: params.seed,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        id: result.id,
        status: result.status === "succeeded" ? "completed" : "processing",
        images: result.output || [],
      };
    } catch (error) {
      console.error("Replicate generation error:", error);
      return {
        id: Date.now().toString(),
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getStatus(jobId: string): Promise<AIGenerationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/${jobId}`, {
        headers: {
          Authorization: `Token ${this.apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Replicate status check error: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        id: result.id,
        status:
          result.status === "succeeded"
            ? "completed"
            : result.status === "failed"
              ? "failed"
              : "processing",
        images: result.output || [],
        error: result.error,
        progress: result.logs ? 0.5 : 0, // Simple progress estimation
      };
    } catch (error) {
      return {
        id: jobId,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// AI Service Factory
export class AIService {
  private provider: AIProvider;

  constructor() {
    const aiProvider = env.AI_PROVIDER;

    switch (aiProvider) {
      case "fal":
        if (!env.FAL_AI_API_KEY) {
          throw new Error("FAL_AI_API_KEY is required for Fal.ai provider");
        }
        this.provider = new FalAIProvider(env.FAL_AI_API_KEY);
        break;
      case "replicate":
        if (!env.REPLICATE_API_TOKEN) {
          throw new Error(
            "REPLICATE_API_TOKEN is required for Replicate provider",
          );
        }
        this.provider = new ReplicateProvider(env.REPLICATE_API_TOKEN);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${aiProvider}`);
    }
  }

  async generatePetArt(
    params: AIGenerationParams,
  ): Promise<AIGenerationResult> {
    return this.provider.generateImages(params);
  }

  async checkStatus(jobId: string): Promise<AIGenerationResult> {
    return this.provider.getStatus(jobId);
  }

  /**
   * Upload generated images to R2 storage
   * This should be called after successful generation to store images in our own storage
   */
  async uploadGeneratedImagesToR2(
    falImageUrls: string[],
    userId: string,
  ): Promise<{ success: boolean; r2Urls?: string[]; error?: string }> {
    if (this.provider instanceof FalAIProvider) {
      return this.provider.uploadGeneratedImagesToR2(falImageUrls, userId);
    }

    // For other providers, we can implement similar logic
    // For now, just return the original URLs
    return {
      success: false,
      error: "Image upload to R2 not supported for this provider",
    };
  }
}

// Default export for easy import
export const aiService = new AIService();
