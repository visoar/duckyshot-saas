import type {
  SubscriptionEntity,
  CustomerEntity,
  CheckoutEntity,
  CustomerLinksEntity as CreemCustomerPortalLink,
} from "creem/models/components";

export type { SubscriptionEntity, CustomerEntity, CheckoutEntity, CreemCustomerPortalLink };

export type PaymentMode = "subscription" | "one_time";
export type BillingCycle = "monthly" | "yearly";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "unpaid"
  | "trialing"
  | "incomplete";

export interface Subscription {
  id: string;
  userId: string;
  customerId: string;
  subscriptionId: string;
  status: SubscriptionStatus;
  tierId: string;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  canceledAt?: Date | null;
}

export interface CreateCheckoutOptions {
  userId: string;
  userEmail: string;
  userName?: string | null;
  tierId: string;
  paymentMode: PaymentMode;
  billingCycle?: BillingCycle;
  successUrl: string;
}

// --- Creem Webhook 事件对象详细类型定义 ---

export type CreemMetadata = {
  userId?: string;
  tierId?: string;
  paymentMode?: PaymentMode;
  billingCycle?: BillingCycle;
  [key: string]: unknown;
};

interface CreemBaseObject {
  id: string;
  customer: string | { id: string };
  metadata?: CreemMetadata;
}

export interface CreemSubscriptionObject extends CreemBaseObject {
  product: string | { id: string };
  status: SubscriptionStatus;
  current_period_start_date: string;
  current_period_end_date: string;
  canceled_at: string | null;
}

export interface CreemPaymentObject extends CreemBaseObject {
  subscription_id?: string;
  subscription?: string;
  product_id?: string;
  amount: number;
  amount_paid?: number;
  currency: string;
  billing_reason?: 'subscription_cycle' | 'subscription_create';
  lines?: {
    data?: Array<{
      period: {
        start: number;
        end: number;
      };
      price?: {
        product?: string;
      }
    }>
  }
}

export interface CreemCheckoutObject extends CreemBaseObject {
  subscription?: CreemSubscriptionObject;
  order?: {
    id: string;
    transaction: string;
    amount_due: number;
    currency: string;
  };
}

export type CreemWebhookPayload = {
  id: string;
  eventType: string;
  created_at: number;
  object: CreemCheckoutObject | CreemSubscriptionObject | CreemPaymentObject;
};