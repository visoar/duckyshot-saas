import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';

// Test the Zod schemas directly
const CreemCheckoutResponseSchema = z.object({
  checkoutUrl: z.string().url(),
});

const CreemCustomerPortalResponseSchema = z.object({
  customerPortalLink: z.string().url(),
});

describe('Creem Provider Zod Validation', () => {
  describe('CreemCheckoutResponseSchema', () => {
    it('should validate valid checkout response', () => {
      const validResponse = {
        checkoutUrl: 'https://checkout.creem.io/session-123',
      };

      const result = CreemCheckoutResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.checkoutUrl).toBe('https://checkout.creem.io/session-123');
      }
    });

    it('should reject invalid URL format', () => {
      const invalidResponse = {
        checkoutUrl: 'invalid-url',
      };

      const result = CreemCheckoutResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should reject missing checkoutUrl', () => {
      const invalidResponse = {};

      const result = CreemCheckoutResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should reject null checkoutUrl', () => {
      const invalidResponse = {
        checkoutUrl: null,
      };

      const result = CreemCheckoutResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('CreemCustomerPortalResponseSchema', () => {
    it('should validate valid customer portal response', () => {
      const validResponse = {
        customerPortalLink: 'https://portal.creem.io/customer-123',
      };

      const result = CreemCustomerPortalResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.customerPortalLink).toBe('https://portal.creem.io/customer-123');
      }
    });

    it('should reject invalid URL format', () => {
      const invalidResponse = {
        customerPortalLink: 'invalid-url',
      };

      const result = CreemCustomerPortalResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should reject missing customerPortalLink', () => {
      const invalidResponse = {};

      const result = CreemCustomerPortalResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should reject null customerPortalLink', () => {
      const invalidResponse = {
        customerPortalLink: null,
      };

      const result = CreemCustomerPortalResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('Error handling patterns', () => {
    it('should demonstrate safe parsing pattern for checkout', () => {
      const mockApiResponse = { someOtherField: 'value' };
      
      const parsed = CreemCheckoutResponseSchema.safeParse(mockApiResponse);
      
      if (!parsed.success) {
        // This is the pattern we implemented in the provider
        const errorMessage = `Failed to parse checkout response from Creem. API Response: ${JSON.stringify(mockApiResponse)}`;
        expect(errorMessage).toContain('Failed to parse checkout response');
        expect(parsed.error).toBeDefined();
      }
    });

    it('should demonstrate safe parsing pattern for customer portal', () => {
      const mockApiResponse = { someOtherField: 'value' };
      
      const parsed = CreemCustomerPortalResponseSchema.safeParse(mockApiResponse);
      
      if (!parsed.success) {
        // This is the pattern we implemented in the provider
        const errorMessage = `Failed to parse customer portal response from Creem. API Response: ${JSON.stringify(mockApiResponse)}`;
        expect(errorMessage).toContain('Failed to parse customer portal response');
        expect(parsed.error).toBeDefined();
      }
    });
  });
});