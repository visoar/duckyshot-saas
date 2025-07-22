ALTER TABLE "ai_artworks" ADD COLUMN "isPublic" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_artworks" ADD COLUMN "isPrivate" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_artworks" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "ai_artworks" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "ai_artworks" ADD COLUMN "sharedAt" timestamp;--> statement-breakpoint
CREATE INDEX "ai_artworks_isPublic_idx" ON "ai_artworks" USING btree ("isPublic");--> statement-breakpoint
CREATE INDEX "ai_artworks_isPrivate_idx" ON "ai_artworks" USING btree ("isPrivate");--> statement-breakpoint
CREATE INDEX "ai_artworks_sharedAt_idx" ON "ai_artworks" USING btree ("sharedAt");