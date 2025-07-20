CREATE TYPE "public"."ai_generation_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending_payment', 'paid', 'processing', 'production', 'shipped', 'delivered', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."product_category" AS ENUM('apparel', 'home', 'accessories', 'stationery', 'digital');--> statement-breakpoint
CREATE TABLE "ai_artworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"originalImageUploadId" uuid NOT NULL,
	"styleId" text NOT NULL,
	"status" "ai_generation_status" DEFAULT 'pending' NOT NULL,
	"generatedImages" jsonb,
	"generationParams" jsonb,
	"errorMessage" text,
	"processingStartedAt" timestamp,
	"completedAt" timestamp,
	"creditsUsed" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_styles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"previewImageUrl" text,
	"category" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderId" uuid NOT NULL,
	"productId" text NOT NULL,
	"artworkId" uuid,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unitPrice" numeric(10, 2) NOT NULL,
	"totalPrice" numeric(10, 2) NOT NULL,
	"customizationData" jsonb,
	"previewImageUrl" text,
	"fulfillmentItemId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"orderNumber" text NOT NULL,
	"status" "order_status" DEFAULT 'pending_payment' NOT NULL,
	"paymentId" text,
	"totalAmount" numeric(10, 2) NOT NULL,
	"shippingCost" numeric(10, 2) DEFAULT '0' NOT NULL,
	"taxAmount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"shippingAddressId" uuid NOT NULL,
	"trackingNumber" text,
	"shippingProvider" text,
	"fulfillmentOrderId" text,
	"estimatedDeliveryDate" timestamp,
	"shippedAt" timestamp,
	"deliveredAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_orders_orderNumber_unique" UNIQUE("orderNumber")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" "product_category" NOT NULL,
	"basePrice" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"previewImageUrl" text,
	"specifications" jsonb,
	"customizationOptions" jsonb,
	"fulfillmentData" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"recipientName" text NOT NULL,
	"addressLine1" text NOT NULL,
	"addressLine2" text,
	"city" text NOT NULL,
	"stateProvince" text NOT NULL,
	"postalCode" text NOT NULL,
	"country" text NOT NULL,
	"phoneNumber" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"totalCredits" integer DEFAULT 0 NOT NULL,
	"usedCredits" integer DEFAULT 0 NOT NULL,
	"remainingCredits" integer DEFAULT 0 NOT NULL,
	"lastResetAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_credits_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "ai_artworks" ADD CONSTRAINT "ai_artworks_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_artworks" ADD CONSTRAINT "ai_artworks_originalImageUploadId_uploads_id_fk" FOREIGN KEY ("originalImageUploadId") REFERENCES "public"."uploads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_artworks" ADD CONSTRAINT "ai_artworks_styleId_ai_styles_id_fk" FOREIGN KEY ("styleId") REFERENCES "public"."ai_styles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_product_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."product_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_artworkId_ai_artworks_id_fk" FOREIGN KEY ("artworkId") REFERENCES "public"."ai_artworks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_paymentId_payments_paymentId_fk" FOREIGN KEY ("paymentId") REFERENCES "public"."payments"("paymentId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_orders" ADD CONSTRAINT "product_orders_shippingAddressId_shipping_addresses_id_fk" FOREIGN KEY ("shippingAddressId") REFERENCES "public"."shipping_addresses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping_addresses" ADD CONSTRAINT "shipping_addresses_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_credits" ADD CONSTRAINT "user_credits_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_artworks_userId_idx" ON "ai_artworks" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "ai_artworks_status_idx" ON "ai_artworks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ai_artworks_styleId_idx" ON "ai_artworks" USING btree ("styleId");--> statement-breakpoint
CREATE INDEX "ai_artworks_createdAt_idx" ON "ai_artworks" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "ai_styles_category_idx" ON "ai_styles" USING btree ("category");--> statement-breakpoint
CREATE INDEX "ai_styles_isActive_idx" ON "ai_styles" USING btree ("isActive");--> statement-breakpoint
CREATE INDEX "order_items_orderId_idx" ON "order_items" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX "order_items_productId_idx" ON "order_items" USING btree ("productId");--> statement-breakpoint
CREATE INDEX "order_items_artworkId_idx" ON "order_items" USING btree ("artworkId");--> statement-breakpoint
CREATE INDEX "product_orders_userId_idx" ON "product_orders" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "product_orders_status_idx" ON "product_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "product_orders_orderNumber_idx" ON "product_orders" USING btree ("orderNumber");--> statement-breakpoint
CREATE INDEX "product_orders_createdAt_idx" ON "product_orders" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "products_isActive_idx" ON "products" USING btree ("isActive");--> statement-breakpoint
CREATE INDEX "shipping_addresses_userId_idx" ON "shipping_addresses" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "shipping_addresses_isDefault_idx" ON "shipping_addresses" USING btree ("isDefault");--> statement-breakpoint
CREATE INDEX "user_credits_userId_idx" ON "user_credits" USING btree ("userId");