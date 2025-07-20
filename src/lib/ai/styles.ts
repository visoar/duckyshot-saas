// AI Art Style Definitions and Management

export interface AIStyleMetadata {
  prompt: string;
  negativePrompt?: string;
  guidance?: number;
  strength?: number;
  description?: string;
}

export interface AIStyle {
  id: string;
  name: string;
  description: string;
  category: string;
  previewImageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  metadata: AIStyleMetadata;
}

// Predefined AI Art Styles for Pet Images
export const DEFAULT_AI_STYLES: Omit<AIStyle, "createdAt" | "updatedAt">[] = [
  // Classic Art Styles
  {
    id: "oil-painting",
    name: "Oil Painting",
    description: "Transform your pet into a classical oil painting masterpiece",
    category: "classic",
    isActive: true,
    sortOrder: 1,
    metadata: {
      prompt: "oil painting, classical art style, rich textures, masterpiece, detailed brushstrokes",
      negativePrompt: "cartoon, anime, digital art, photograph",
      guidance: 7.5,
      strength: 0.8,
    },
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft, flowing watercolor painting style",
    category: "classic",
    isActive: true,
    sortOrder: 2,
    metadata: {
      prompt: "watercolor painting, soft colors, flowing paint, artistic, delicate brushwork",
      negativePrompt: "sharp edges, digital art, photograph, realistic",
      guidance: 7.0,
      strength: 0.75,
    },
  },
  {
    id: "pencil-sketch",
    name: "Pencil Sketch",
    description: "Detailed pencil drawing with shading",
    category: "classic",
    isActive: true,
    sortOrder: 3,
    metadata: {
      prompt: "pencil sketch, detailed drawing, graphite, shading, artistic sketch",
      negativePrompt: "color, photograph, digital art, painting",
      guidance: 6.5,
      strength: 0.7,
    },
  },

  // Modern Styles
  {
    id: "cartoon",
    name: "Cartoon",
    description: "Fun and playful cartoon style",
    category: "modern",
    isActive: true,
    sortOrder: 4,
    metadata: {
      prompt: "cartoon style, animated, cute, colorful, Disney-like, adorable",
      negativePrompt: "realistic, photograph, dark, scary",
      guidance: 8.0,
      strength: 0.85,
    },
  },
  {
    id: "anime",
    name: "Anime",
    description: "Japanese anime and manga style",
    category: "modern",
    isActive: true,
    sortOrder: 5,
    metadata: {
      prompt: "anime style, manga, kawaii, big eyes, Japanese animation style",
      negativePrompt: "realistic, photograph, western cartoon",
      guidance: 8.5,
      strength: 0.8,
    },
  },
  {
    id: "pop-art",
    name: "Pop Art",
    description: "Vibrant pop art with bold colors",
    category: "modern",
    isActive: true,
    sortOrder: 6,
    metadata: {
      prompt: "pop art style, Andy Warhol, bright colors, high contrast, retro",
      negativePrompt: "realistic, muted colors, photograph",
      guidance: 7.5,
      strength: 0.8,
    },
  },

  // Special Styles
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic cyberpunk aesthetic",
    category: "special",
    isActive: true,
    sortOrder: 7,
    metadata: {
      prompt: "cyberpunk style, neon lights, futuristic, sci-fi, glowing effects, digital",
      negativePrompt: "natural, organic, vintage, classical",
      guidance: 8.0,
      strength: 0.85,
    },
  },
  {
    id: "pixel-art",
    name: "Pixel Art",
    description: "Retro 8-bit pixel art style",
    category: "special",
    isActive: true,
    sortOrder: 8,
    metadata: {
      prompt: "pixel art, 8-bit, retro gaming, pixelated, arcade style",
      negativePrompt: "smooth, high resolution, realistic, photograph",
      guidance: 7.0,
      strength: 0.9,
    },
  },
  {
    id: "van-gogh",
    name: "Van Gogh Style",
    description: "Swirling brushstrokes like Van Gogh",
    category: "special",
    isActive: true,
    sortOrder: 9,
    metadata: {
      prompt: "Van Gogh style, swirling brushstrokes, post-impressionist, textured paint, expressive",
      negativePrompt: "smooth, digital, photograph, realistic",
      guidance: 7.5,
      strength: 0.8,
    },
  },
  {
    id: "studio-ghibli",
    name: "Studio Ghibli",
    description: "Magical Studio Ghibli animation style",
    category: "special",
    isActive: true,
    sortOrder: 10,
    metadata: {
      prompt: "Studio Ghibli style, Miyazaki, magical, whimsical, soft colors, fantasy",
      negativePrompt: "realistic, dark, scary, photograph",
      guidance: 8.0,
      strength: 0.8,
    },
  },
];

// Style Categories
export const STYLE_CATEGORIES = [
  { id: "classic", name: "Classic Art", description: "Traditional art styles" },
  { id: "modern", name: "Modern", description: "Contemporary digital styles" },
  { id: "special", name: "Special", description: "Unique and themed styles" },
  { id: "seasonal", name: "Seasonal", description: "Holiday and seasonal themes" },
] as const;

// Utility functions
export function getStyleById(styleId: string): AIStyle | undefined {
  return DEFAULT_AI_STYLES.find(style => style.id === styleId);
}

export function getStylesByCategory(category: string): AIStyle[] {
  return DEFAULT_AI_STYLES.filter(style => style.category === category && style.isActive);
}

export function getAllActiveStyles(): AIStyle[] {
  return DEFAULT_AI_STYLES.filter(style => style.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

// Generate style prompt for AI
export function generateStylePrompt(style: AIStyle, petDescription?: string): string {
  const basePrompt = style.metadata.prompt;
  const petDescriptor = petDescription || "adorable pet";
  
  return `${petDescriptor}, ${basePrompt}, high quality, detailed, masterpiece`;
}

// Generate negative prompt for AI
export function generateNegativePrompt(style: AIStyle): string {
  const baseNegative = style.metadata.negativePrompt || "";
  const commonNegative = "blurry, low quality, distorted, ugly, deformed";
  
  return `${baseNegative}, ${commonNegative}`.trim();
}