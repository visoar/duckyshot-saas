import type { CreateCheckoutOptions } from "@/types/billing";

export interface PaymentProvider {
  createCheckoutSession(
    options: CreateCheckoutOptions,
  ): Promise<{ checkoutUrl: string }>;
  createCustomerPortalUrl(customerId: string): Promise<{ portalUrl: string }>;

  /**
   * FIX: The payload should be the raw request body string for HMAC verification.
   * @param payload - The raw request body as a string.
   * @param signature - The signature from the 'creem-signature' header.
   */
  handleWebhook(
    payload: string,
    signature: string,
  ): Promise<{ received: boolean; message?: string }>;
}
