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
        "This character with oil painting, classical art style, rich textures, masterpiece, detailed brushstrokes",
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
        "This character with watercolor painting, soft colors, flowing paint, artistic, delicate brushwork",
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
        "This character with pencil sketch, detailed drawing, graphite, shading, artistic sketch",
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
      prompt:
        "This character with cartoon style, animated, cute, colorful, Disney-like, adorable",
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
      prompt:
        "This character with anime style, manga, kawaii, big eyes, Japanese animation style",
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
      prompt:
        "This character with pop art style, Andy Warhol, bright colors, high contrast, retro",
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
        "This character with cyberpunk style, neon lights, futuristic, sci-fi, glowing effects, digital",
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
      prompt:
        "This character with pixel art, 8-bit, retro gaming, pixelated, arcade style",
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
        "This character with Van Gogh style, swirling brushstrokes, post-impressionist, textured paint, expressive",
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
        "This character with Studio Ghibli style, Miyazaki, magical, whimsical, soft colors, fantasy",
      guidance: 5.0,
      strength: 0.15,
    },
  },

  // Seasonal Styles
  {
    id: "spring-blossom",
    name: "Spring Blossom",
    description: "Fresh spring vibes with cherry blossoms",
    category: "seasonal",
    previewImageUrl: "https://gen-image.ullrai.com/q/spring_blossom_cat",
    isActive: true,
    sortOrder: 11,
    metadata: {
      prompt:
        "This character with spring theme painting, cherry blossoms, pink flowers, fresh green leaves, pastel colors, blooming garden, gentle sunlight",
      guidance: 4.5,
      strength: 0.15,
    },
  },
  {
    id: "summer-beach",
    name: "Summer Beach",
    description: "Sunny summer beach vacation vibes",
    category: "seasonal",
    previewImageUrl: "https://gen-image.ullrai.com/q/summer_beach_cat",
    isActive: true,
    sortOrder: 12,
    metadata: {
      prompt:
        "This character with summer beach theme painting, tropical paradise, palm trees, blue ocean, bright sunshine, sandy beach, vacation vibes, colorful",
      guidance: 4.0,
      strength: 0.15,
    },
  },
  {
    id: "autumn-harvest",
    name: "Autumn Harvest",
    description: "Cozy autumn with falling leaves",
    category: "seasonal",
    previewImageUrl: "https://gen-image.ullrai.com/q/autumn_harvest_cat",
    isActive: true,
    sortOrder: 13,
    metadata: {
      prompt:
        "This character with autumn theme painting, falling leaves, orange and red colors, harvest season, pumpkins, warm golden light, cozy atmosphere",
      guidance: 4.5,
      strength: 0.15,
    },
  },
  {
    id: "winter-wonderland",
    name: "Winter Wonderland",
    description: "Magical winter snow scene",
    category: "seasonal",
    previewImageUrl: "https://gen-image.ullrai.com/q/winter_wonderland_cat",
    isActive: true,
    sortOrder: 14,
    metadata: {
      prompt:
        "This character with winter wonderland theme painting, snow falling, white snowflakes, evergreen trees, cozy winter scene, soft blue and white colors, magical atmosphere",
      guidance: 4.5,
      strength: 0.15,
    },
  },
  {
    id: "christmas-holiday",
    name: "Christmas Holiday",
    description: "Festive Christmas celebration",
    category: "seasonal",
    previewImageUrl: "https://gen-image.ullrai.com/q/christmas_holiday_cat",
    isActive: true,
    sortOrder: 15,
    metadata: {
      prompt:
        "This character with Christmas holiday theme painting, Christmas tree, red and green colors, festive decorations, holiday lights, warm cozy feeling, gift boxes, holly",
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
