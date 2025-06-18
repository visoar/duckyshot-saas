import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as tables from "@/database/tables";
import env from "env";
import { db } from "@/database";
import { sendMagicLink } from "@/emails/magic-link";
import { APP_NAME } from "@/constants";
import { UAParser } from "ua-parser-js";
import { providerConfigs } from "./providers";
import { users } from "@/database/schema";
import { count } from "drizzle-orm";

// Dynamically build social providers based on environment variables
const socialProviders: Record<
  string,
  { clientId: string; clientSecret: string }
> = {};

// Build social providers object based on available environment variables using unified configuration
providerConfigs.forEach(({ name, clientIdKey, clientSecretKey }) => {
  const clientId = env[clientIdKey];
  const clientSecret = env[clientSecretKey];

  if (clientId && clientSecret) {
    socialProviders[name] = {
      clientId: clientId as string,
      clientSecret: clientSecret as string,
    };
  }
});

export const auth = betterAuth({
  appName: APP_NAME,
  baseURL: env.NEXT_PUBLIC_APP_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
  logger: {
    disabled: process.env.NODE_ENV === "production",
    level: "debug",
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    cookieCache: {
      enabled: false,
    },
    additionalFields: {
      os: {
        type: "string",
        required: false,
      },
      browser: {
        type: "string",
        required: false,
      },
      deviceType: {
        type: "string",
        required: false,
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
  socialProviders,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...tables,
      // ...relations,
    },
    usePlural: true,
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github", "linkedin"],
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Check if this is the first user in the system
          const [userCount] = await db.select({ count: count() }).from(users);

          // If this is the first user, make them a super admin
          if (userCount.count === 0) {
            return {
              data: {
                ...user,
                role: "super_admin",
              },
            };
          }

          // Otherwise, use the default role
          return {
            data: user,
          };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          // Parse userAgent once during session creation for performance optimization
          if (session.userAgent) {
            const ua = new UAParser(session.userAgent);
            const os = ua.getOS();
            const browser = ua.getBrowser();
            const device = ua.getDevice();

            return {
              data: {
                ...session,
                os: os.name || null,
                browser: browser.name || null,
                deviceType: device.type || "desktop",
              },
            };
          }
          return {
            data: {
              ...session,
              os: null,
              browser: null,
              deviceType: "desktop",
            },
          };
        },
      },
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }, request) => {
        if (process.env.NODE_ENV === "development") {
          console.log("✨ Magic link: " + url);
        }
        await sendMagicLink(email, url, request);
      },
    }),
  ],
});
