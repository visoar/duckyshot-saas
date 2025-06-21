"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, Zap, Calendar, CreditCard, Loader2, LogIn, Star } from "lucide-react";
import { PRODUCT_TIERS, type PricingTier } from "@/lib/config/products";
import { useSession } from "@/lib/auth/client";
import { useRouter } from "nextjs-toploader/app";
import type { PaymentMode, BillingCycle } from "@/types/billing";
import { cn } from "@/lib/utils";

// 辅助函数：格式化价格
const formatPrice = (price: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
};

export function PricingSection({ className }: { className?: string }) {
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("subscription");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
  const [loadingState, setLoadingState] = useState<{ tierId: string; mode: PaymentMode; cycle?: BillingCycle } | null>(null);

  const { data: session, isPending: isSessionLoading } = useSession();
  const router = useRouter();

  const handleCheckout = async (tier: PricingTier, mode: PaymentMode, cycle?: BillingCycle) => {
    if (!session?.user) {
      toast.error("Please log in to continue purchase.", {
        action: { label: "Login", onClick: () => router.push("/login?redirect=/pricing") },
      });
      router.push("/login?redirect=/pricing");
      return;
    }

    setLoadingState({ tierId: tier.id, mode, cycle });
    toast.info("Preparing your secure checkout...");

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: tier.id,
          paymentMode: mode,
          billingCycle: cycle,
        }),
      });

      const data = await response.json();

      if (response.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || "Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setLoadingState(null);
    }
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4", className)}>
      {/* 支付模式选择 */}
      <div className="text-center mb-8">
        <Tabs value={paymentMode} onValueChange={(v) => setPaymentMode(v as PaymentMode)} className="w-full max-w-sm mx-auto">
          <TabsList className="grid w-full grid-cols-2 h-11 bg-muted/50 p-1">
            <TabsTrigger value="subscription" className="flex items-center gap-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Calendar className="w-4 h-4" /> Subscription
            </TabsTrigger>
            <TabsTrigger value="one_time" className="flex items-center gap-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <CreditCard className="w-4 h-4" /> One-time
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 订阅模式下的年/月切换 */}
      {paymentMode === "subscription" && (
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="flex items-center justify-center gap-3 bg-muted/30 rounded-full p-1">
            <Label 
              htmlFor="billing-toggle" 
              className={cn(
                "px-3 py-2 rounded-full text-sm font-medium transition-all cursor-pointer select-none",
                billingCycle === "monthly" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={billingCycle === "yearly"}
              onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
              className="data-[state=checked]:bg-primary"
            />
            <Label 
              htmlFor="billing-toggle" 
              className={cn(
                "px-3 py-2 rounded-full text-sm font-medium transition-all cursor-pointer select-none",
                billingCycle === "yearly" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly
            </Label>
          </div>
          <div className="h-7 flex items-center justify-center">
            {billingCycle === "yearly" && (
              <Badge variant="secondary" className="animate-in fade-in-0 duration-300 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
                <Zap className="w-3 h-3 mr-1.5" /> Save 17% with yearly billing
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* 定价卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {PRODUCT_TIERS.map((tier) => {
          const price = paymentMode === "one_time"
            ? tier.prices.oneTime
            : billingCycle === "yearly"
              ? tier.prices.yearly
              : tier.prices.monthly;

          const isLoading = loadingState?.tierId === tier.id && loadingState.mode === paymentMode && (paymentMode === 'one_time' || loadingState.cycle === billingCycle);

          return (
            <Card key={tier.id} className={cn(
              "relative transition-all duration-300 ease-out group",
              "hover:shadow-xl hover:-translate-y-1 hover:border-primary/30",
              "transform-gpu will-change-transform", // 减少CLS
              tier.isPopular && "border-primary/50 ring-1 ring-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-lg"
            )}>
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 rounded-full text-xs font-semibold text-primary-foreground shadow-lg flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}
              <CardHeader className="text-center pb-6 pt-6">
                <CardTitle className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{tier.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">{tier.description}</CardDescription>
                <div className="mt-6 space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-foreground tracking-tight">
                      {paymentMode === "one_time"
                        ? formatPrice(price, tier.currency)
                        : billingCycle === "monthly"
                        ? formatPrice(price, tier.currency)
                        : formatPrice(Math.round(price / 12), tier.currency)}
                    </span>
                    {paymentMode === "subscription" && (
                      <span className="text-base text-muted-foreground font-medium">
                        /month
                      </span>
                    )}
                  </div>
                  <div className="h-5 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground font-medium">
                      {paymentMode === 'one_time' 
                        ? 'One-time payment' 
                        : billingCycle === 'yearly' 
                          ? 'Billed annually' 
                          : 'Billed monthly'
                      }
                    </p>
                  </div>
                  {billingCycle === "yearly" && paymentMode !== "one_time" && (
                    <div className="text-xs text-muted-foreground/80 font-medium">
                      {formatPrice(price, tier.currency)} total per year
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 pt-0 px-6 pb-6">
                <div className="space-y-4 flex-1 mb-6">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group/feature">
                      <div className={cn(
                        "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-all duration-200",
                        feature.included 
                          ? "bg-emerald-100 dark:bg-emerald-900/30 group-hover/feature:bg-emerald-200 dark:group-hover/feature:bg-emerald-900/50" 
                          : "bg-gray-100 dark:bg-gray-800"
                      )}>
                        <Check className={cn(
                          "h-3 w-3 transition-all duration-200", 
                          feature.included 
                            ? "text-emerald-600 dark:text-emerald-400" 
                            : "text-gray-400"
                        )} />
                      </div>
                      <span className={cn(
                        "text-sm leading-relaxed transition-colors duration-200", 
                        feature.included 
                          ? "text-foreground group-hover/feature:text-foreground/90" 
                          : "text-muted-foreground line-through"
                      )}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  className={cn(
                    "w-full h-12 font-semibold text-base transition-all duration-200 cursor-pointer",
                    "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                    "disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
                    tier.isPopular && "bg-primary hover:bg-primary/90 shadow-lg"
                  )}
                  onClick={() => handleCheckout(tier, paymentMode, billingCycle)}
                  variant={tier.isPopular ? "default" : "outline"}
                  disabled={isLoading || isSessionLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : !session?.user && !isSessionLoading ? (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login to Get {tier.name}
                    </>
                  ) : (
                    `Get ${tier.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}