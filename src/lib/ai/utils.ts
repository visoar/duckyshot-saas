// AI-related utility functions
// Centralized location for style checking and credit calculation logic

import type { AIStyle } from "./styles";

/**
 * Check if a style is considered premium based on category and sort order
 */
export function isStylePremium(style: AIStyle): boolean {
  return style.category === "special" && style.sortOrder > 6;
}

/**
 * Check if a style is popular based on sort order
 */
export function isStylePopular(style: AIStyle): boolean {
  return style.sortOrder <= 3;
}

/**
 * Get the credit cost for any style
 * All styles cost 1 credit per image - standardized pricing
 */
export function getStyleCredits(): number {
  return 1;
}

/**
 * Calculate total credits needed for generation
 */
export function calculateTotalCredits(numImages: number): number {
  return getStyleCredits() * numImages;
}