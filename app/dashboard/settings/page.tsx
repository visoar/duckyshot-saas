import React from "react";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { DashboardPageHeader } from "../_components/dashboard-page-header";
import { Settings } from "./_components/settings";
import {
  getUserSubscription,
  getUserPayments,
} from "@/lib/database/subscription";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account and subscription settings.",
};

export default async function SettingsPage() {
  // Cache headers to avoid multiple calls
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  // Parallel data fetching for better performance
  const [activeSessionsRaw, subscription, payments] = await Promise.all([
    session
      ? auth.api.listSessions({ headers: requestHeaders })
      : Promise.resolve([]),
    session?.user?.id
      ? getUserSubscription(session.user.id)
      : Promise.resolve(null),
    session?.user?.id
      ? getUserPayments(session.user.id, 20)
      : Promise.resolve([]),
  ]);

  // Use pre-parsed userAgent data from database for better performance
  const activeSessions = activeSessionsRaw;

  return (
    <>
      <DashboardPageHeader title="Settings" />
      <section className="space-y-6 px-4 py-2">
        <Settings
          session={session}
          activeSessions={activeSessions} // 传递已经解析好的数据
          subscription={subscription}
          payments={payments}
        />
      </section>
    </>
  );
}
