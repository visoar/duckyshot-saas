"use client";

import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import Link from "next/link";
import { useEffect, useState } from "react";

type PaymentStatus = "success" | "failed" | "pending" | "cancelled";

interface StatusConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  badgeVariant: "default" | "destructive" | "secondary" | "outline";
  badgeText: string;
  primaryAction: {
    text: string;
    href: string;
    variant: "default" | "destructive" | "outline" | "secondary";
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
}

const statusConfigs: Record<PaymentStatus, StatusConfig> = {
  success: {
    icon: <CheckCircle className="h-16 w-16 text-green-500" />,
    title: "Payment Successful! 🎉",
    description:
      "Thank you for your purchase! Your subscription has been activated and you now have access to all premium features.",
    badgeVariant: "default",
    badgeText: "Payment Completed",
    primaryAction: {
      text: "Go to Dashboard",
      href: "/dashboard",
      variant: "default",
    },
    secondaryAction: {
      text: "View Billing Settings",
      href: "/dashboard/settings?page=billing",
    },
  },
  failed: {
    icon: <XCircle className="h-16 w-16 text-red-500" />,
    title: "Payment Failed",
    description:
      "We couldn't process your payment. Please check your payment method and try again.",
    badgeVariant: "destructive",
    badgeText: "Payment Failed",
    primaryAction: {
      text: "Try Again",
      href: "/pricing",
      variant: "default",
    },
    secondaryAction: {
      text: "Contact Support",
      href: "/contact",
    },
  },
  pending: {
    icon: <Clock className="h-16 w-16 text-yellow-500" />,
    title: "Payment Pending",
    description:
      "Your payment is being processed. This may take a few minutes. You'll receive an email confirmation once it's complete.",
    badgeVariant: "secondary",
    badgeText: "Processing",
    primaryAction: {
      text: "Go to Dashboard",
      href: "/dashboard",
      variant: "outline",
    },
    secondaryAction: {
      text: "Check Status",
      href: "/dashboard/settings?page=billing",
    },
  },
  cancelled: {
    icon: <XCircle className="h-16 w-16 text-gray-500" />,
    title: "Payment Cancelled",
    description:
      "You cancelled the payment process. No charges have been made to your account.",
    badgeVariant: "outline",
    badgeText: "Cancelled",
    primaryAction: {
      text: "View Plans",
      href: "/pricing",
      variant: "default",
    },
    secondaryAction: {
      text: "Go to Dashboard",
      href: "/dashboard",
    },
  },
};

export function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const statusParam = searchParams.get("status") as PaymentStatus;
        const sessionIdParam = searchParams.get("session_id");

        setSessionId(sessionIdParam);

        // If we have a clear status from URL and it's not pending, use it directly
        if (
          statusParam &&
          statusParam in statusConfigs &&
          statusParam !== "pending"
        ) {
          setStatus(statusParam);
          setIsLoading(false);
          return;
        }

        // For pending status or no status, check with the API
        const response = await fetch(
          `/api/payment-status?sessionId=${sessionIdParam || ""}`,
        );
        if (response.ok) {
          const data = await response.json();
          setStatus(data.status as PaymentStatus);
        } else {
          // Fallback to URL parameter or default to pending
          setStatus(
            statusParam && statusParam in statusConfigs
              ? statusParam
              : "pending",
          );
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
        setError("Failed to check payment status");
        // Fallback to URL parameter or default to pending
        const statusParam = searchParams.get("status") as PaymentStatus;
        setStatus(
          statusParam && statusParam in statusConfigs ? statusParam : "pending",
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  // Show loading state while checking status
  if (isLoading || status === null) {
    return (
      <section className="flex min-h-screen flex-col">
        <div className="bg-background relative grow overflow-hidden">
          <BackgroundPattern />
          <div className="relative px-4 py-16">
            <div className="mx-auto max-w-2xl">
              <div className="bg-background/80 border-border rounded-lg border p-8 text-center shadow-lg backdrop-blur-sm">
                <div className="mb-4 flex justify-center">
                  <Loader2 className="text-primary h-16 w-16 animate-spin" />
                </div>
                <div className="mb-2 flex justify-center">
                  <Badge variant="secondary">Checking Payment Status</Badge>
                </div>
                <h1 className="mb-4 text-2xl font-bold">
                  Verifying Your Payment
                </h1>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Please wait while we confirm your payment status...
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const config = statusConfigs[status];

  return (
    <section className="flex min-h-screen flex-col">
      <div className="bg-background relative grow overflow-hidden">
        <BackgroundPattern />
        <div className="relative px-4 py-16">
          <div className="mx-auto max-w-2xl">
            {/* Status Badge */}
            <div className="mb-6 text-center">
              <div className="border-border bg-background/50 mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm backdrop-blur-sm">
                <Badge variant={config.badgeVariant} className="border-0">
                  {config.badgeText}
                </Badge>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-background/80 border-border rounded-lg border p-8 text-center shadow-lg backdrop-blur-sm">
              <div className="mb-6 flex justify-center">{config.icon}</div>

              <h1 className="text-foreground mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {config.title}
              </h1>

              <p className="text-muted-foreground mx-auto mb-8 max-w-lg text-lg leading-relaxed">
                {config.description}
              </p>

              {sessionId && (
                <div className="bg-muted/50 border-border mb-8 rounded-lg border p-4">
                  <p className="text-muted-foreground text-sm">
                    Session ID:{" "}
                    <code className="bg-background rounded px-2 py-1 font-mono text-xs">
                      {sessionId}
                    </code>
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <Button
                  asChild
                  variant={config.primaryAction.variant}
                  size="lg"
                  className="w-full min-w-[200px] sm:w-auto"
                >
                  <Link
                    href={config.primaryAction.href}
                    className="flex items-center justify-center gap-2"
                  >
                    {config.primaryAction.text}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                {config.secondaryAction && (
                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="w-full min-w-[200px] sm:w-auto"
                  >
                    <Link href={config.secondaryAction.href}>
                      {config.secondaryAction.text}
                    </Link>
                  </Button>
                )}
              </div>

              {status === "success" && (
                <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950/20">
                  <h3 className="mb-4 text-lg font-semibold text-green-800 dark:text-green-200">
                    🎉 What's Next?
                  </h3>
                  <div className="grid gap-3 text-left">
                    <div className="flex items-start gap-3">
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Access all premium features in your dashboard
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Check your email for the receipt and welcome guide
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Manage your subscription in billing settings
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
