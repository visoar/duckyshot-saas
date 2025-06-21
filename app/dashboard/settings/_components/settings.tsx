"use client";

import React from "react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, CreditCard, Palette, UserCircle } from "lucide-react";
import { Session } from "@/types/auth";
import type { Subscription } from "@/types/billing";
import dynamic from "next/dynamic"; // 导入 dynamic
import type { ComponentType, FC } from "react"; // Added FC

// Define local PaymentRecord as it's not exported from @/types/billing
interface PaymentRecord {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  paymentType: string;
  tierId: string;
  tierName: string;
  createdAt: Date;
  subscriptionId: string | null;
}

// 使用 dynamic 动态导入各个页面组件
const AccountPage = dynamic(() => import("./account-page").then(mod => mod.AccountPage));
const AppearancePage = dynamic(() => import("./appearance-page").then(mod => mod.AppearancePage));
const NotificationPage = dynamic(() => import("./notifications-page").then(mod => mod.NotificationPage));
const BillingPage = dynamic(() => import("./billing-page").then(mod => mod.BillingPage));

// Define Props for each page component
interface AccountPageProps {
  activeSessions: Array<{
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
    os?: string | null;
    browser?: string | null;
    deviceType?: string | null;
  }>;
}

interface BillingPageProps {
  subscription: Subscription | null;
  payments: PaymentRecord[];
}

// Union type for all possible page props
export type SettingsPageProps =
  | AccountPageProps
  | BillingPageProps
  | Record<string, never>; // For pages with no props like NotificationPage and AppearancePage

// 统一的标签页配置，包含组件引用
interface SettingsTabConfig {
  name: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  component: FC<SettingsPageProps>; // Use the union type
}

const settingsTabsConfig: SettingsTabConfig[] = [
  { name: "Account & Security", value: "account", icon: UserCircle, component: AccountPage as FC<SettingsPageProps> },
  { name: "Billing & Plans", value: "billing", icon: CreditCard, component: BillingPage as FC<SettingsPageProps> },
  { name: "Emails & Notifications", value: "notifications", icon: Bell, component: NotificationPage as FC<SettingsPageProps> },
  { name: "Appearance", value: "appearance", icon: Palette, component: AppearancePage as FC<SettingsPageProps> },
];

interface PaymentRecord {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  paymentType: string;
  tierId: string;
  tierName: string;
  createdAt: Date;
  subscriptionId: string | null;
}

export function Settings({
  activeSessions,
  subscription,
  payments,
}: {
  session: Session | null;
  activeSessions: Array<{
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
    os?: string | null;
    browser?: string | null;
    deviceType?: string | null;
  }>;
  subscription: Subscription | null;
  payments: PaymentRecord[];
}) {
  const [tab, setTab] = useQueryState("page", { defaultValue: "account" });

  // 找到当前活动的标签页配置
  const activeTabConfig = settingsTabsConfig.find(t => t.value === tab);
  const ActiveComponent = activeTabConfig?.component;

  // 根据不同组件准备相应的props
  const getComponentProps = (): SettingsPageProps => {
    switch (tab) {
      case "account":
        return { activeSessions };
      case "billing":
        return { subscription, payments };
      case "notifications":
      case "appearance":
      default:
        return {} as Record<string, never>; // Ensure it matches a part of the union type
    }
  };

  return (
    <section className="grid grid-rows-[1fr] gap-6 lg:grid-cols-[280px_1fr]">
      <nav className="space-y-2">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Settings</h3>
        </div>
        {settingsTabsConfig.map((mappedTab) => (
          <Button
            key={mappedTab.value}
            variant="ghost"
            className={cn("w-full justify-start h-10 px-3 rounded-lg transition-all", tab === mappedTab.value ? "bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground")}
            onClick={() => setTab(mappedTab.value)}
          >
            <mappedTab.icon className="mr-2 h-4 w-4" />
            {mappedTab.name}
          </Button>
        ))}
      </nav>
      <main className="flex-1 space-y-6">
        {ActiveComponent && <ActiveComponent {...getComponentProps()} />}
      </main>
    </section>
  );
}