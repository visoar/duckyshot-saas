import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ViewTransitions } from "next-view-transitions";

import { Toaster } from "@/components/ui/sonner";

import { createMetadata } from "@/lib/metadata";
import { APP_NAME, APP_DESCRIPTION, COMPANY_NAME } from "@/constants";
import env from "@/env";

import NextTopLoader from "nextjs-toploader";
import { CookieConsent } from "@/components/cookie-consent";

export const metadata = createMetadata({
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME} - ${APP_DESCRIPTION}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: COMPANY_NAME, url: env.NEXT_PUBLIC_APP_URL }],
  creator: COMPANY_NAME,
  publisher: COMPANY_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: env.NEXT_PUBLIC_APP_URL,
  },
  // themeColor: [], // Will add later if specific theme colors are defined
  // manifest: "/manifest.json", // Will add later if PWA is implemented
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('theme') || 'light';
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    var resolvedTheme = theme === 'system' ? systemTheme : theme;
                    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
                    document.documentElement.style.colorScheme = resolvedTheme;
                  } catch (e) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                })();
              `,
            }}
          />
        </head>
        <body suppressHydrationWarning>
          <NuqsAdapter>
            <ThemeProvider
              attribute={"class"}
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
              {children}
              <Toaster />
              <CookieConsent />
            </ThemeProvider>
          </NuqsAdapter>
        </body>
      </html>
    </ViewTransitions>
  );
}
