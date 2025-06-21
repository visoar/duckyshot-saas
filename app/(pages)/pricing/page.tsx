import React from "react";
import { createMetadata } from "@/lib/metadata";
import { PricingSection } from "@/components/payment-options";
import { PAYMENT_PROVIDER } from "@/constants";
import { Check, Zap, Shield, Info, ShieldCheck, Award, X, Flag } from "lucide-react";

export const metadata = createMetadata({
  title: "Pricing Plans - Choose Your Perfect Plan",
  description: "Simple, transparent pricing for every business size. Start with our free plan or choose from our flexible subscription options. 7-Day money-back guarantee included.",
  keywords: ["pricing", "plans", "subscription", "saas pricing", "business plans"],
});

import { BackgroundPattern } from "@/components/ui/background-pattern";

export default function PricingPage() {
  return (
    <section className="flex min-h-screen flex-col">

      {/* Background Pattern */}
      <div className="relative grow overflow-hidden bg-background">
        <BackgroundPattern />
        
        <div className="relative px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm backdrop-blur-sm mb-6">
                <span className="text-muted-foreground">💰 Transparent Pricing</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                Simple, transparent pricing
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Choose the plan that works best for your needs. No hidden fees, no surprises. Start building today.
              </p>
            </div>

            <PricingSection />

            {/* Customer Assurance Section */}
            <div className="mt-20 text-center">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-semibold text-foreground mb-4">Why choose our platform?</h3>
                <p className="text-muted-foreground mb-8">
                  Join thousands of satisfied customers who trust our secure, reliable platform
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                  <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-foreground mb-1">7-Day Free Trial</h4>
                      <p className="text-sm text-muted-foreground">Full money-back*</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-foreground mb-1">Instant Activation</h4>
                      <p className="text-sm text-muted-foreground">Start using immediately</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-foreground mb-1">Enterprise Security</h4>
                      <p className="text-sm text-muted-foreground">Bank-grade protection</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Info className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-foreground mb-1">24/7 Support</h4>
                      <p className="text-sm text-muted-foreground">Always here to help</p>
                    </div>
                  </div>
                </div>
                
                <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-4 py-2 text-sm backdrop-blur-sm mb-4">
                  <span className="text-muted-foreground">💬 Need Help?</span>
                </div>
                <p className="text-muted-foreground">
                  Have questions about our pricing? <a href="/contact" className="text-primary font-medium hover:underline transition-colors">Contact our team</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Compliance Section */}
      <div className="bg-muted/20 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-xl font-semibold text-foreground mb-3">Security & Compliance</h3>
            <p className="text-muted-foreground">Industry-leading security standards and certifications</p>
          </div>
          
          {/* Security Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="flex flex-col items-center p-4 bg-background/60 rounded-lg border border-border/50">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-medium text-center">SSL Encrypted</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-background/60 rounded-lg border border-border/50">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-2">
                <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs font-medium text-center">SOC 2 Compliant</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-background/60 rounded-lg border border-border/50">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-2">
                <X className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs font-medium text-center">GDPR Ready</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-background/60 rounded-lg border border-border/50">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-2">
                <Flag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-xs font-medium text-center">PCI DSS Level 1</span>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-6">Accepted payment methods</p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-8 px-3 bg-background rounded border border-border/50 flex items-center opacity-70 hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold">VISA</span>
              </div>
              <div className="h-8 px-3 bg-background rounded border border-border/50 flex items-center opacity-70 hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold">MC</span>
              </div>
              <div className="h-8 px-3 bg-background rounded border border-border/50 flex items-center opacity-70 hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold">AMEX</span>
              </div>
              <div className="h-8 px-3 bg-background rounded border border-border/50 flex items-center opacity-70 hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold">PayPal</span>
              </div>
              <div className="h-8 px-3 bg-background rounded border border-border/50 flex items-center opacity-70 hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold">Apple Pay</span>
              </div>
            </div>
            
            {/* Powered by */}
            <div className="pt-6 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                Powered by <span className="font-semibold text-primary capitalize">{PAYMENT_PROVIDER}</span> - Modern Payment Infrastructure
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
