import React from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="from-primary/5 via-background to-primary/10 relative overflow-hidden bg-gradient-to-br py-20 sm:py-28 lg:py-36">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="from-primary/20 to-primary/30 absolute inset-0 bg-gradient-to-br via-transparent opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />
        <div className="bg-primary/20 absolute top-1/4 left-1/4 h-32 w-32 animate-pulse rounded-full blur-3xl" />
        <div className="bg-primary/30 absolute right-1/4 bottom-1/4 h-24 w-24 animate-pulse rounded-full blur-2xl delay-1000" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 text-center sm:space-y-8">
          {/* Icon */}
          <div className="bg-primary/10 border-primary/20 mx-auto flex h-12 w-12 items-center justify-center rounded-xl border sm:h-16 sm:w-16 sm:rounded-2xl">
            <Logo
              className="text-primary h-8 w-8 sm:h-10 sm:w-10"
              variant="icon-only"
            />
          </div>

          {/* Heading */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-foreground animate-in slide-in-from-bottom-4 text-3xl font-bold tracking-tight duration-1000 sm:text-4xl lg:text-6xl">
              Ready to Create
              <span className="from-primary via-primary/80 to-primary block animate-pulse bg-gradient-to-r bg-clip-text text-transparent">
                Custom Pet Products?
              </span>
            </h2>
            <p className="text-muted-foreground animate-in slide-in-from-bottom-4 mx-auto max-w-3xl text-base leading-relaxed delay-300 duration-1000 sm:text-lg lg:text-xl">
              Upload photo → Pick AI art style → Download files or order custom
              products. Perfect for gifts, memorials, or home decor.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm sm:gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
              <span>50+ AI Art Styles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
              <span>Custom Products</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
              <span>Professional Printing</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="animate-in slide-in-from-bottom-4 flex flex-col items-center justify-center gap-4 pt-4 delay-500 duration-1000 sm:flex-row sm:gap-6 sm:pt-6">
            <Button
              size="lg"
              className="group from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary hover:shadow-primary/50 border-primary/20 relative h-14 overflow-hidden border-2 bg-gradient-to-r px-8 text-base font-bold shadow-2xl transition-all duration-500 hover:scale-105 sm:h-16 sm:px-12 sm:text-xl"
              asChild
            >
              <Link href="/ai-studio">
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative z-10 sm:hidden">Start Free</span>
                <span className="relative z-10 hidden sm:inline">
                  Try It Free Now
                </span>
                <ArrowRight className="relative z-10 ml-3 h-5 w-5 transition-transform group-hover:translate-x-2 group-hover:scale-110 sm:h-6 sm:w-6" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="hover:bg-primary/10 hover:border-primary/50 h-14 border-2 px-8 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg sm:h-16 sm:px-12 sm:text-xl"
              asChild
            >
              <Link href="/pricing">
                <span className="sm:hidden">Pricing</span>
                <span className="hidden sm:inline">View Pricing</span>
              </Link>
            </Button>
          </div>

          {/* Bottom Text */}
          <div className="animate-in slide-in-from-bottom-4 space-y-3 pt-4 delay-700 duration-1000 sm:pt-6">
            <p className="text-muted-foreground text-sm font-medium sm:text-base">
              🎆 Free to start • 🎁 Instant AI art generation • ❤️ Premium
              custom products
            </p>
            <div className="text-primary flex items-center justify-center gap-2 text-xs font-semibold sm:text-sm">
              <span className="animate-bounce">✨</span>
              <span>Create digital art first, then choose your products!</span>
              <span className="animate-bounce delay-300">✨</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
