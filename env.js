import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
  // Server-side environment variables
  server: {
    // Database URL
    DATABASE_URL: z.string(),

    // Authentication credentials
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    LINKEDIN_CLIENT_ID: z.string().optional(),
    LINKEDIN_CLIENT_SECRET: z.string().optional(),
    BETTER_AUTH_SECRET: z.string(),

    // API keys
    RESEND_API_KEY: z.string(),

    // Cloudflare R2 Storage
    R2_ENDPOINT: z.string(),
    R2_ACCESS_KEY_ID: z.string(),
    R2_SECRET_ACCESS_KEY: z.string(),
    R2_BUCKET_NAME: z.string(),
    R2_PUBLIC_URL: z.string(),

    // Payments
    CREEM_API_KEY: z.string(),
    CREEM_ENVIRONMENT: z.enum(["test_mode", "live_mode"]).default("test_mode"),
    CREEM_WEBHOOK_SECRET: z.string(),
  },

  // Client-side public environment variables
  client: {
    // Application settings
    NEXT_PUBLIC_APP_URL: z.string(),
  },

  // Linking runtime environment variables
  runtimeEnv: {
    // Database URL
    DATABASE_URL: process.env.DATABASE_URL,

    // Authentication credentials
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

    // API keys
    RESEND_API_KEY: process.env.RESEND_API_KEY,

    // Cloudflare R2 Storage
    R2_ENDPOINT: process.env.R2_ENDPOINT,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,

    // Application settings
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    // Payments
    CREEM_API_KEY: process.env.CREEM_API_KEY,
    CREEM_ENVIRONMENT: process.env.CREEM_ENVIRONMENT,
    CREEM_WEBHOOK_SECRET: process.env.CREEM_WEBHOOK_SECRET,
  },
});

export default env;
