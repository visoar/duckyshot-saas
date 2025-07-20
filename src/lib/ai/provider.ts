import env from "@/env";

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
  abstract generateImages(params: AIGenerationParams): Promise<AIGenerationResult>;
  abstract getStatus(jobId: string): Promise<AIGenerationResult>;
}

// Fal.ai Provider Implementation
export class FalAIProvider extends AIProvider {
  private apiKey: string;
  private baseUrl = "https://fal.run/fal-ai/flux/schnell";

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async generateImages(params: AIGenerationParams): Promise<AIGenerationResult> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Key ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: params.imageUrl,
          prompt: params.stylePrompt,
          num_images: params.numImages || 2,
          guidance_scale: params.guidance || 7.5,
          num_inference_steps: 50,
          strength: params.strength || 0.8,
          seed: params.seed,
        }),
      });

      if (!response.ok) {
        throw new Error(`Fal.ai API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        id: result.request_id || Date.now().toString(),
        status: "completed",
        images: result.images?.map((img: { url: string }) => img.url) || [],
      };
    } catch (error) {
      console.error("Fal.ai generation error:", error);
      return {
        id: Date.now().toString(),
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getStatus(jobId: string): Promise<AIGenerationResult> {
    // For synchronous API, return completed status
    return {
      id: jobId,
      status: "completed",
    };
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

  async generateImages(params: AIGenerationParams): Promise<AIGenerationResult> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Token ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
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
          "Authorization": `Token ${this.apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Replicate status check error: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        id: result.id,
        status: result.status === "succeeded" ? "completed" : 
                result.status === "failed" ? "failed" : "processing",
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
          throw new Error("REPLICATE_API_TOKEN is required for Replicate provider");
        }
        this.provider = new ReplicateProvider(env.REPLICATE_API_TOKEN);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${aiProvider}`);
    }
  }

  async generatePetArt(params: AIGenerationParams): Promise<AIGenerationResult> {
    return this.provider.generateImages(params);
  }

  async checkStatus(jobId: string): Promise<AIGenerationResult> {
    return this.provider.getStatus(jobId);
  }
}

// Default export for easy import
export const aiService = new AIService();