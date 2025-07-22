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
    description: "A classical oil painting masterpiece",
    category: "classic",
    previewImageUrl: "https://gen-image.ullrai.com/q/oil_painting_cat",
    isActive: true,
    sortOrder: 1,
    metadata: {
      prompt:
        "Make this oil painting, classical art style, rich textures, masterpiece, detailed brushstrokes",
      guidance: 4.0,
      strength: 0.15,
    },
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft, flowing watercolor painting",
    category: "classic",
    previewImageUrl: "https://gen-image.ullrai.com/q/watercolor_cat",
    isActive: true,
    sortOrder: 2,
    metadata: {
      prompt:
        "Make this watercolor painting, soft colors, flowing paint, artistic, delicate brushwork",
      guidance: 3.5,
      strength: 0.15,
    },
  },
  {
    id: "pencil-sketch",
    name: "Pencil Sketch",
    description: "Pencil drawing with shading",
    category: "classic",
    previewImageUrl: "https://gen-image.ullrai.com/q/pencil_sketch_cat",
    isActive: true,
    sortOrder: 3,
    metadata: {
      prompt:
        "Make this pencil sketch, detailed drawing, graphite, shading, artistic sketch",
      guidance: 4.5,
      strength: 0.15,
    },
  },

  // Modern Styles
  {
    id: "cartoon",
    name: "Cartoon",
    description: "Fun and playful cartoon style",
    category: "modern",
    previewImageUrl: "https://gen-image.ullrai.com/q/cartoon_cat",
    isActive: true,
    sortOrder: 4,
    metadata: {
      prompt: "Make this cartoon style, animated, cute, colorful, Disney-like, adorable",
      guidance: 5.0,
      strength: 0.15,
    },
  },
  {
    id: "anime",
    name: "Anime",
    description: "Japanese anime and manga style",
    category: "modern",
    previewImageUrl: "https://gen-image.ullrai.com/q/anime_cat",
    isActive: true,
    sortOrder: 5,
    metadata: {
      prompt: "Make this anime style, manga, kawaii, big eyes, Japanese animation style",
      guidance: 5.5,
      strength: 0.15,
    },
  },
  {
    id: "pop-art",
    name: "Pop Art",
    description: "Vibrant pop art with bold colors",
    category: "modern",
    previewImageUrl: "https://gen-image.ullrai.com/q/pop_art_cat",
    isActive: true,
    sortOrder: 6,
    metadata: {
      prompt: "Make this pop art style, Andy Warhol, bright colors, high contrast, retro",
      guidance: 4.5,
      strength: 0.15,
    },
  },

  // Special Styles
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic cyberpunk aesthetic",
    category: "special",
    previewImageUrl: "https://gen-image.ullrai.com/q/cyberpunk_cat",
    isActive: true,
    sortOrder: 7,
    metadata: {
      prompt:
        "Make this cyberpunk style, neon lights, futuristic, sci-fi, glowing effects, digital",
      guidance: 6.0,
      strength: 0.15,
    },
  },
  {
    id: "pixel-art",
    name: "Pixel Art",
    description: "Retro 8-bit pixel art style",
    category: "special",
    previewImageUrl: "https://gen-image.ullrai.com/q/pixel_art_cat",
    isActive: true,
    sortOrder: 8,
    metadata: {
      prompt: "Make this pixel art, 8-bit, retro gaming, pixelated, arcade style",
      guidance: 7.0,
      strength: 0.15,
    },
  },
  {
    id: "van-gogh",
    name: "Van Gogh Style",
    description: "Swirling like Van Gogh",
    category: "special",
    previewImageUrl: "https://gen-image.ullrai.com/q/van-gogh_cat",
    isActive: true,
    sortOrder: 9,
    metadata: {
      prompt:
        "Make this Van Gogh style, swirling brushstrokes, post-impressionist, textured paint, expressive",
      guidance: 4.0,
      strength: 0.15,
    },
  },
  {
    id: "studio-ghibli",
    name: "Studio Ghibli",
    description: "Magical Studio Ghibli style",
    category: "special",
    previewImageUrl: "https://gen-image.ullrai.com/q/ghibli_cat",
    isActive: true,
    sortOrder: 10,
    metadata: {
      prompt:
        "Make this Studio Ghibli style, Miyazaki, magical, whimsical, soft colors, fantasy",
      guidance: 5.0,
      strength: 0.15,
    },
  },
];

// Style Categories
export const STYLE_CATEGORIES = [
  {
    id: "classic",
    name: "Classic Art",
    description: "Traditional art styles",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary digital styles",
  },
  {
    id: "special",
    name: "Special",
    description: "Unique and themed styles",
  },
  {
    id: "seasonal",
    name: "Seasonal",
    description: "Holiday and seasonal themes",
  },
] as const;

// Utility functions
export function getStyleById(styleId: string): AIStyle | undefined {
  return DEFAULT_AI_STYLES.find((style) => style.id === styleId);
}

export function getStylesByCategory(category: string): AIStyle[] {
  return DEFAULT_AI_STYLES.filter(
    (style) => style.category === category && style.isActive,
  );
}

export function getAllActiveStyles(): AIStyle[] {
  return DEFAULT_AI_STYLES.filter((style) => style.isActive).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

// Generate style prompt for AI
export function generateStylePrompt(
  style: AIStyle,
  petDescription?: string,
): string {
  const basePrompt = style.metadata.prompt;

  if (!petDescription) {
    return basePrompt;
  }

  return `${petDescription}, ${basePrompt}`;
}

// Generate negative prompt for AI
export function generateNegativePrompt(style: AIStyle): string {
  const baseNegative = style.metadata.negativePrompt || "";
  const commonNegative = "blurry, low quality, distorted, ugly, deformed";

  return `${baseNegative}, ${commonNegative}`.trim();
}
