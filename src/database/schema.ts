import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
  index,
  pgEnum,
  jsonb,
  decimal,
} from "drizzle-orm/pg-core";

// 定义用户角色枚举
export const userRoleEnum = pgEnum("user_role", [
  "user",
  "admin",
  "super_admin",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("user"),
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
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => {
    return {
      userIdx: index("accounts_userId_idx").on(table.userId),
    };
  },
);

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// Subscription table to store user subscription information
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    customerId: text("customerId").notNull(),
    subscriptionId: text("subscriptionId").notNull().unique(),
    productId: text("productId").notNull(),
    status: text("status").notNull(),
    currentPeriodStart: timestamp("currentPeriodStart"),
    currentPeriodEnd: timestamp("currentPeriodEnd"),
    canceledAt: timestamp("canceledAt"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("subscriptions_userId_idx").on(table.userId),
      customerIdIdx: index("subscriptions_customerId_idx").on(table.customerId),
    };
  },
);

// Payment records table to store payment history
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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
  },
  (table) => {
    return {
      userIdx: index("payments_userId_idx").on(table.userId),
    };
  },
);

// Webhook events table to ensure idempotency
export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: text("eventId").notNull().unique(), // Unique identifier from webhook provider
    eventType: text("eventType").notNull(),
    provider: text("provider").notNull().default("creem"), // Support multiple providers
    processed: boolean("processed").notNull().default(true),
    processedAt: timestamp("processedAt").notNull().defaultNow(),
    payload: text("payload"), // Store original payload for debugging
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      eventIdIdx: index("webhook_events_eventId_idx").on(table.eventId),
      providerIdx: index("webhook_events_provider_idx").on(table.provider),
    };
  },
);

// File uploads table to store uploaded file metadata
export const uploads = pgTable(
  "uploads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }), // Made nullable for anonymous uploads
    fileKey: text("fileKey").notNull(), // Key in R2 storage
    url: text("url").notNull(), // Public access URL
    fileName: text("fileName").notNull(), // Original file name
    fileSize: integer("fileSize").notNull(), // File size in bytes
    contentType: text("contentType").notNull(), // MIME type
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("uploads_userId_idx").on(table.userId),
      fileKeyIdx: index("uploads_fileKey_idx").on(table.fileKey),
    };
  },
);

// === Pet AI Specific Tables ===

// AI generation status enum
export const aiGenerationStatusEnum = pgEnum("ai_generation_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

// AI styles table for configurable art styles
export const aiStyles = pgTable(
  "ai_styles",
  {
    id: text("id").primaryKey(), // e.g. "cartoon", "oil-painting"
    name: text("name").notNull(), // Display name
    description: text("description"), // Style description
    previewImageUrl: text("previewImageUrl"), // Preview image URL
    category: text("category").notNull(), // e.g. "classic", "modern", "special"
    isActive: boolean("isActive").notNull().default(true),
    sortOrder: integer("sortOrder").notNull().default(0),
    metadata: jsonb("metadata"), // Additional style configuration
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      categoryIdx: index("ai_styles_category_idx").on(table.category),
      isActiveIdx: index("ai_styles_isActive_idx").on(table.isActive),
    };
  },
);

// AI artworks table for storing generated pet images
export const aiArtworks = pgTable(
  "ai_artworks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    originalImageUploadId: uuid("originalImageUploadId")
      .notNull()
      .references(() => uploads.id, { onDelete: "cascade" }),
    styleId: text("styleId")
      .notNull()
      .references(() => aiStyles.id, { onDelete: "restrict" }),
    status: aiGenerationStatusEnum("status").notNull().default("pending"),
    generatedImages: jsonb("generatedImages"), // Array of generated image URLs
    generationParams: jsonb("generationParams"), // AI generation parameters
    errorMessage: text("errorMessage"), // Error details if failed
    processingStartedAt: timestamp("processingStartedAt"),
    completedAt: timestamp("completedAt"),
    creditsUsed: integer("creditsUsed").notNull().default(1),
    // Privacy and sharing settings
    isPublic: boolean("isPublic").notNull().default(false), // Whether artwork is visible in public gallery
    isPrivate: boolean("isPrivate").notNull().default(true), // Private generation (paid feature)
    title: text("title"), // Optional title set by user
    description: text("description"), // Optional description set by user
    sharedAt: timestamp("sharedAt"), // When artwork was shared to public gallery
    deletedAt: timestamp("deletedAt"), // Soft delete timestamp
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("ai_artworks_userId_idx").on(table.userId),
      statusIdx: index("ai_artworks_status_idx").on(table.status),
      styleIdx: index("ai_artworks_styleId_idx").on(table.styleId),
      createdAtIdx: index("ai_artworks_createdAt_idx").on(table.createdAt),
      isPublicIdx: index("ai_artworks_isPublic_idx").on(table.isPublic),
      isPrivateIdx: index("ai_artworks_isPrivate_idx").on(table.isPrivate),
      sharedAtIdx: index("ai_artworks_sharedAt_idx").on(table.sharedAt),
    };
  },
);

// User credits table for AI generation usage tracking
export const userCredits = pgTable(
  "user_credits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    totalCredits: integer("totalCredits").notNull().default(0), // Total credits purchased/earned
    usedCredits: integer("usedCredits").notNull().default(0), // Credits consumed
    remainingCredits: integer("remainingCredits").notNull().default(0), // Available credits
    lastResetAt: timestamp("lastResetAt"), // For monthly subscriptions
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("user_credits_userId_idx").on(table.userId),
    };
  },
);

// Product categories enum
export const productCategoryEnum = pgEnum("product_category", [
  "apparel",
  "home",
  "accessories",
  "stationery",
  "digital",
]);

// Product catalog table for merchandise items
export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(), // e.g. "tshirt-basic", "mug-ceramic"
    name: text("name").notNull(),
    description: text("description"),
    category: productCategoryEnum("category").notNull(),
    basePrice: decimal("basePrice", { precision: 10, scale: 2 }).notNull(), // Base price in USD
    currency: text("currency").notNull().default("USD"),
    isActive: boolean("isActive").notNull().default(true),
    sortOrder: integer("sortOrder").notNull().default(0),
    previewImageUrl: text("previewImageUrl"),
    specifications: jsonb("specifications"), // Size, material, etc.
    customizationOptions: jsonb("customizationOptions"), // Available customization
    fulfillmentData: jsonb("fulfillmentData"), // Integration with print services
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      categoryIdx: index("products_category_idx").on(table.category),
      isActiveIdx: index("products_isActive_idx").on(table.isActive),
    };
  },
);

// Shipping addresses table for user delivery addresses
export const shippingAddresses = pgTable(
  "shipping_addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isDefault: boolean("isDefault").notNull().default(false),
    recipientName: text("recipientName").notNull(),
    addressLine1: text("addressLine1").notNull(),
    addressLine2: text("addressLine2"),
    city: text("city").notNull(),
    stateProvince: text("stateProvince").notNull(),
    postalCode: text("postalCode").notNull(),
    country: text("country").notNull(),
    phoneNumber: text("phoneNumber"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("shipping_addresses_userId_idx").on(table.userId),
      isDefaultIdx: index("shipping_addresses_isDefault_idx").on(
        table.isDefault,
      ),
    };
  },
);

// Order status enum
export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "paid",
  "processing",
  "production",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

// Physical product orders table
export const productOrders = pgTable(
  "product_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orderNumber: text("orderNumber").notNull().unique(), // Human-readable order number
    status: orderStatusEnum("status").notNull().default("pending_payment"),

    // Payment integration
    paymentId: text("paymentId").references(() => payments.paymentId),
    totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
    shippingCost: decimal("shippingCost", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    taxAmount: decimal("taxAmount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    currency: text("currency").notNull().default("USD"),

    // Shipping information
    shippingAddressId: uuid("shippingAddressId")
      .notNull()
      .references(() => shippingAddresses.id, { onDelete: "restrict" }),
    trackingNumber: text("trackingNumber"),
    shippingProvider: text("shippingProvider"),

    // Fulfillment data
    fulfillmentOrderId: text("fulfillmentOrderId"), // External fulfillment service order ID
    estimatedDeliveryDate: timestamp("estimatedDeliveryDate"),
    shippedAt: timestamp("shippedAt"),
    deliveredAt: timestamp("deliveredAt"),

    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("product_orders_userId_idx").on(table.userId),
      statusIdx: index("product_orders_status_idx").on(table.status),
      orderNumberIdx: index("product_orders_orderNumber_idx").on(
        table.orderNumber,
      ),
      createdAtIdx: index("product_orders_createdAt_idx").on(table.createdAt),
    };
  },
);

// Order items table for individual products in an order
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("orderId")
      .notNull()
      .references(() => productOrders.id, { onDelete: "cascade" }),
    productId: text("productId")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    artworkId: uuid("artworkId").references(() => aiArtworks.id, {
      onDelete: "restrict",
    }), // Optional: if custom artwork
    quantity: integer("quantity").notNull().default(1),
    unitPrice: decimal("unitPrice", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
    customizationData: jsonb("customizationData"), // Size, color, position, etc.
    previewImageUrl: text("previewImageUrl"), // Generated preview of customized product
    fulfillmentItemId: text("fulfillmentItemId"), // External fulfillment service item ID
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      orderIdx: index("order_items_orderId_idx").on(table.orderId),
      productIdx: index("order_items_productId_idx").on(table.productId),
      artworkIdx: index("order_items_artworkId_idx").on(table.artworkId),
    };
  },
);
