import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  // FIX: Added Creem Customer ID to link user with payment provider
  paymentProviderCustomerId: text("paymentProviderCustomerId").unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  // Pre-parsed userAgent fields for performance optimization
  os: text("os"),
  browser: text("browser"),
  deviceType: text("deviceType"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
}, (table) => {
  return {
    userIdx: index("accounts_userId_idx").on(table.userId),
  };
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// Subscription table to store user subscription information
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  customerId: text("customerId").notNull(),
  subscriptionId: text("subscriptionId").notNull().unique(),
  productId: text("productId").notNull(),
  status: text("status").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  canceledAt: timestamp("canceledAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => {
  return {
    userIdx: index("subscriptions_userId_idx").on(table.userId),
    customerIdIdx: index("subscriptions_customerId_idx").on(table.customerId),
  };
});

// Payment records table to store payment history
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  customerId: text("customerId").notNull(),
  subscriptionId: text("subscriptionId"),
  productId: text("productId").notNull(),
  paymentId: text("paymentId").notNull().unique(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("usd"),
  status: text("status").notNull(),
  paymentType: text("paymentType").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => {
  return {
    userIdx: index("payments_userId_idx").on(table.userId),
  };
});

// Webhook events table to ensure idempotency
export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: text("eventId").notNull().unique(), // Unique identifier from webhook provider
  eventType: text("eventType").notNull(),
  provider: text("provider").notNull().default("creem"), // Support multiple providers
  processed: boolean("processed").notNull().default(true),
  processedAt: timestamp("processedAt").notNull().defaultNow(),
  payload: text("payload"), // Store original payload for debugging
  createdAt: timestamp("createdAt").notNull().defaultNow(),
}, (table) => {
  return {
    eventIdIdx: index("webhook_events_eventId_idx").on(table.eventId),
    providerIdx: index("webhook_events_provider_idx").on(table.provider),
  };
});