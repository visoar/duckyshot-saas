import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats amount from cents to currency display
 * @param amountInCents - Amount in cents (e.g., 1299 for $12.99)
 * @param currency - Currency code (default: "USD")
 * @returns Formatted currency string
 */
export function formatCurrency(
  amountInCents: number,
  currency: string = "USD",
): string {
  const amountInDollars = amountInCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountInDollars);
}
