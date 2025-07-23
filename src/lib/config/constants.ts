// Brand Configuration
export const APP_NAME =
  process.env.NODE_ENV === "development" ? "DEV - DuckyShot" : "DuckyShot";
export const APP_DESCRIPTION =
  "Transform your pet photos into stunning AI artwork in Van Gogh, anime, oil painting styles. Order custom canvas prints, mugs, t-shirts, and more. Perfect for gifts, memorials, and home decor.";
export const COMPANY_NAME = "DuckyShot";
export const COMPANY_TAGLINE = "AI Pet Art & Custom Products Studio";

export const TRIAL_DAYS = 7;

// https://www.dicebear.com/playground/
// DEFAULT: initials
export const AVATAR_STYLE = "adventurer-neutral";

// Contact Information
export const CONTACT_EMAIL = "support@ullrai.com";
export const LEGAL_EMAIL = "legal@ullrai.com";
export const PRIVACY_EMAIL = "privacy@ullrai.com";
export const RESEND_EMAIL_FROM = "noreply@mail.ullrai.com";

// External Links
export const GITHUB_URL = "https://github.com/ullrai/saas-starter";
export const VERCEL_DEPLOY_URL =
  "https://vercel.com/new/clone?repository-url=https://github.com/ullrai/saas-starter";

export const PAYMENT_PROVIDER = "creem" as const;
// SEO
export const OGIMAGE = "https://starter.ullrai.com/og.png";
export const TWITTERACCOUNT = "@ullr_ai";
