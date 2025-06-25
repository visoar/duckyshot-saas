import env from "@/env";
import { createAuthClient } from "better-auth/react";
import {
  magicLinkClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "./server";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
  fetchOptions: {
    onError: async (context) => {
      const { response } = context;
      if (response.status === 429) {
        const retryAfter = response.headers.get("X-Retry-After");
        if (retryAfter) {
          console.warn(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
          throw new Error(`请求过于频繁，请在 ${retryAfter} 秒后重试`);
        } else {
          throw new Error("请求过于频繁，请稍后重试");
        }
      }
    },
  },
});

export const {
  signIn,
  signOut,
  signUp,
  revokeSession,
  updateUser,
  getSession,
  magicLink,
  changePassword,
  resetPassword,
  sendVerificationEmail,
  changeEmail,
  deleteUser,
  linkSocial,
  forgetPassword,
  useSession,
  verifyEmail,
  listAccounts,
  listSessions,
  revokeOtherSessions,
  revokeSessions,
} = authClient;
