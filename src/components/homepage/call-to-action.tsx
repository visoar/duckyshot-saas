import React from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden py-20 sm:py-28 lg:py-36">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/30 opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-primary/30 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8 text-center">
          {/* Icon */}
          <div className="bg-primary/10 border border-primary/20 mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl">
            <Logo className="text-primary h-8 w-8 sm:h-10 sm:w-10" variant="icon-only" />
          </div>

          {/* Heading */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-6xl animate-in slide-in-from-bottom-4 duration-1000">
              Ready to Create
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-pulse">
                Custom Pet Products?
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-base sm:text-lg lg:text-xl leading-relaxed animate-in slide-in-from-bottom-4 duration-1000 delay-300">
              Upload photo → Pick AI art style → Download files or order custom products. Perfect for gifts, memorials, or home decor.
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span>50+ AI Art Styles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span>Custom Products</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span>Professional Printing</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6 sm:flex-row animate-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Button
              size="lg"
              className="group relative bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-xl font-bold shadow-2xl transition-all duration-500 hover:shadow-primary/50 hover:scale-105 border-2 border-primary/20 overflow-hidden"
              asChild
            >
              <Link href="/ai-studio">
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 sm:hidden">Start Free</span>
                <span className="relative z-10 hidden sm:inline">Try It Free Now</span>
                <ArrowRight className="relative z-10 ml-3 h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-2 group-hover:scale-110" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="hover:bg-primary/10 hover:border-primary/50 h-14 sm:h-16 border-2 px-8 sm:px-12 text-base sm:text-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
              asChild
            >
              <Link href="/pricing">
                <span className="sm:hidden">Pricing</span>
                <span className="hidden sm:inline">View Pricing</span>
              </Link>
            </Button>
          </div>

          {/* Bottom Text */}
          <div className="pt-4 sm:pt-6 space-y-3 animate-in slide-in-from-bottom-4 duration-1000 delay-700">
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              🎆 Free to start • 🎁 Instant AI art generation • ❤️ Premium custom products
            </p>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-primary font-semibold">
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
