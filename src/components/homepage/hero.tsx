"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Star,
  Sparkles,
  Heart,
  Camera,
  CheckCircle,
  ShoppingBag,
  Palette,
  Clock,
  Zap,
  Gift,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center py-8 lg:min-h-screen lg:py-0">
      {/* Enhanced background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="from-background via-primary/[0.03] to-background absolute inset-0 bg-gradient-to-br" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10 sm:bg-[size:3rem_3rem] lg:bg-[size:4rem_4rem]" />
        <div className="bg-primary/6 absolute top-1/4 left-1/6 h-20 w-20 animate-pulse rounded-full blur-2xl sm:h-32 sm:w-32 lg:h-40 lg:w-40 lg:blur-3xl" />
        <div className="bg-primary/8 absolute right-1/6 bottom-1/4 h-16 w-16 animate-pulse rounded-full blur-xl delay-1000 sm:h-24 sm:w-24 lg:h-32 lg:w-32 lg:blur-2xl" />
        <div className="bg-primary/4 absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full blur-xl delay-500 sm:h-20 sm:w-20" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
          {/* Main Content - Mobile First */}
          <motion.div
            className="max-w-2xl flex-1 space-y-6 text-center lg:max-w-none lg:space-y-8 lg:text-left"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {/* Emotional Badge */}
            <motion.div variants={fadeInUp}>
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/8 hover:bg-primary/12 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium shadow-sm transition-colors sm:px-4 sm:py-2 sm:text-sm"
              >
                <Heart className="text-primary h-3 w-3 animate-pulse sm:h-4 sm:w-4" />
                AI-Powered Pet Art Creator
                <Sparkles className="text-primary h-3 w-3" />
              </Badge>
            </motion.div>

            {/* Primary Headline - Clearer hierarchy */}
            <motion.div className="space-y-3 sm:space-y-4" variants={fadeInUp}>
              <h1 className="text-3xl leading-[1.1] font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                <span className="text-foreground mb-1 block sm:mb-2">
                  Transform Pet Into
                </span>
                <span className="from-primary via-primary/90 to-primary block bg-gradient-to-r bg-clip-text font-extrabold text-transparent">
                  Stunning Artwork
                </span>
              </h1>
            </motion.div>

            {/* Value Proposition - Simplified */}
            <motion.div variants={fadeInUp}>
              <p className="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed sm:text-lg lg:mx-0 lg:text-xl">
                Upload any pet photo and watch AI transform it into Van Gogh
                masterpieces,anime art, and 50+ stunning styles.{" "}
                <span className="text-foreground font-semibold">
                  Order custom products instantly.
                </span>
              </p>
            </motion.div>

            {/* Trust Indicators - Compact */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6 lg:justify-start"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="fill-primary text-primary h-4 w-4"
                    />
                  ))}
                </div>
                <span className="text-foreground text-sm font-medium">
                  4.9/5 • 12,000+ happy pet parents
                </span>
              </div>
            </motion.div>

            {/* CTA Section - Prominent */}
            <motion.div className="space-y-4 sm:space-y-5" variants={fadeInUp}>
              <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
                <Button
                  size="lg"
                  className="from-primary to-primary/90 hover:from-primary/90 hover:to-primary h-12 transform bg-gradient-to-r px-6 text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105 sm:h-14 sm:px-8 sm:text-base"
                  asChild
                >
                  <Link href="/ai-studio">
                    <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Create My Pet Art
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary/30 hover:border-primary/50 hover:bg-primary/8 h-12 border-2 px-6 text-sm font-semibold transition-all duration-300 sm:h-14 sm:px-8 sm:text-base"
                  asChild
                >
                  <Link href="/gallery">
                    <ImageIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    See Examples
                  </Link>
                </Button>
              </div>

              {/* Benefits - Horizontal on mobile */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:gap-4 sm:text-sm lg:justify-start">
                <div className="text-muted-foreground bg-background/50 border-border/50 flex items-center gap-1.5 rounded-full border px-3 py-1.5">
                  <CheckCircle className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Free to try</span>
                </div>
                <div className="text-muted-foreground bg-background/50 border-border/50 flex items-center gap-1.5 rounded-full border px-3 py-1.5">
                  <Clock className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
                  <span>30-second results</span>
                </div>
                <div className="text-muted-foreground bg-background/50 border-border/50 flex items-center gap-1.5 rounded-full border px-3 py-1.5">
                  <Gift className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Perfect gifts</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Demo - Side by side on desktop */}
          <motion.div
            variants={fadeInUp}
            className="w-full max-w-lg flex-1 lg:max-w-none"
          >
            <Card className="border-primary/10 from-card via-card/95 to-card/90 relative overflow-hidden border-2 bg-gradient-to-br p-4 shadow-2xl backdrop-blur-sm sm:p-6">
              {/* Studio Header */}
              <div className="mb-4 flex items-center justify-between sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="from-primary to-primary/80 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br sm:h-10 sm:w-10">
                    <Palette className="text-primary-foreground h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <div className="text-foreground text-sm font-bold sm:text-base">
                      AI Pet Art Studio
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Photo → AI Magic → Custom Products
                    </div>
                  </div>
                </div>
                <div className="text-primary bg-primary/15 border-primary/20 rounded-full border px-2.5 py-1 text-xs font-semibold">
                  LIVE
                </div>
              </div>

              {/* Process Steps - Optimized for mobile */}
              <div className="mb-4 grid grid-cols-3 gap-3 sm:mb-6 sm:gap-4">
                {[
                  {
                    icon: Camera,
                    title: "Upload",
                    desc: "Any pet photo",
                    bg: "bg-blue-50 border-blue-200",
                    iconColor: "text-blue-600",
                  },
                  {
                    icon: Sparkles,
                    title: "AI Magic",
                    desc: "50+ art styles",
                    bg: "bg-purple-50 border-purple-200",
                    iconColor: "text-purple-600",
                    pulse: true,
                  },
                  {
                    icon: ShoppingBag,
                    title: "Products",
                    desc: "Canvas, mugs & more",
                    bg: "bg-green-50 border-green-200",
                    iconColor: "text-green-600",
                  },
                ].map((step, i) => (
                  <div key={i} className="space-y-2 text-center sm:space-y-3">
                    <div
                      className={`mx-auto aspect-square w-full max-w-20 rounded-xl border-2 sm:max-w-none ${step.bg} flex items-center justify-center`}
                    >
                      <step.icon
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${step.iconColor} ${step.pulse ? "animate-pulse" : ""}`}
                      />
                    </div>
                    <div>
                      <p className="text-foreground text-xs font-semibold sm:text-sm">
                        {step.title}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Art Styles Preview */}
              <div className="bg-muted/30 rounded-xl border p-3 backdrop-blur-sm sm:p-4">
                <div className="text-primary mb-2 text-xs font-semibold sm:text-sm">
                  🎨 Popular Art Styles
                </div>
                <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                  {[
                    { name: "Van Gogh", emoji: "🌟", active: true },
                    { name: "Anime", emoji: "✨", active: false },
                    { name: "Watercolor", emoji: "🎨", active: false },
                    { name: "Digital Art", emoji: "💎", active: false },
                    { name: "Oil Paint", emoji: "🖼️", active: false },
                  ].map((style, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                        style.active
                          ? "bg-primary text-primary-foreground"
                          : "bg-background/70 text-foreground hover:bg-background/90"
                      }`}
                    >
                      <span>{style.emoji}</span>
                      {style.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 flex items-center justify-around border-t pt-4 text-center sm:mt-6">
                {[
                  { value: "30s", label: "AI generation" },
                  { value: "50+", label: "Art styles" },
                  { value: "15+", label: "Product types" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-primary text-sm font-bold sm:text-base">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
