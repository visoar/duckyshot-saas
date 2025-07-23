'use client';

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
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export function Hero() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center py-8 lg:py-0">
      {/* Enhanced background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/[0.03] to-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] lg:bg-[size:4rem_4rem] opacity-10" />
        <div className="absolute top-1/4 left-1/6 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-primary/6 rounded-full blur-2xl lg:blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-primary/8 rounded-full blur-xl lg:blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-20 sm:h-20 bg-primary/4 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Main Content - Mobile First */}
          <motion.div 
            className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8 max-w-2xl lg:max-w-none"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {/* Emotional Badge */}
            <motion.div variants={fadeInUp}>
              <Badge 
                variant="outline" 
                className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border-primary/20 bg-primary/8 shadow-sm hover:bg-primary/12 transition-colors"
              >
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse" />
                AI-Powered Pet Art Creator
                <Sparkles className="h-3 w-3 text-primary" />
              </Badge>
            </motion.div>

            {/* Primary Headline - Clearer hierarchy */}
            <motion.div className="space-y-3 sm:space-y-4" variants={fadeInUp}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]">
                <span className="block text-foreground mb-1 sm:mb-2">
                  Transform Pet Into
                </span>
                <span className="block bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent font-extrabold">
                  Stunning Artwork
                </span>
              </h1>
            </motion.div>

            {/* Value Proposition - Simplified */}
            <motion.div variants={fadeInUp}>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Upload any pet photo and watch AI transform it into Van Gogh masterpieces,anime art, and 50+ stunning styles.{" "}
                <span className="text-foreground font-semibold">Order custom products instantly.</span>
              </p>
            </motion.div>

            {/* Trust Indicators - Compact */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">
                  4.9/5 • 12,000+ happy pet parents
                </span>
              </div>
            </motion.div>

            {/* CTA Section - Prominent */}
            <motion.div className="space-y-4 sm:space-y-5" variants={fadeInUp}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold shadow-md transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transform hover:scale-105"
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
                  className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/8 transition-all duration-300"
                  asChild
                >
                  <Link href="/gallery">
                    <ImageIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    See Examples
                  </Link>
                </Button>
              </div>

              {/* Benefits - Horizontal on mobile */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground bg-background/50 rounded-full px-3 py-1.5 border border-border/50">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span>Free to try</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground bg-background/50 rounded-full px-3 py-1.5 border border-border/50">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span>30-second results</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground bg-background/50 rounded-full px-3 py-1.5 border border-border/50">
                  <Gift className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span>Perfect gifts</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Demo - Side by side on desktop */}
          <motion.div 
            variants={fadeInUp} 
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <Card className="relative p-4 sm:p-6 shadow-2xl border-2 border-primary/10 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm overflow-hidden">
              {/* Studio Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                    <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-foreground">
                      AI Pet Art Studio
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Photo → AI Magic → Custom Products
                    </div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-primary bg-primary/15 px-2.5 py-1 rounded-full border border-primary/20">
                  LIVE
                </div>
              </div>

              {/* Process Steps - Optimized for mobile */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {[
                  { 
                    icon: Camera, 
                    title: "Upload", 
                    desc: "Any pet photo",
                    bg: "bg-blue-50 border-blue-200",
                    iconColor: "text-blue-600"
                  },
                  { 
                    icon: Sparkles, 
                    title: "AI Magic", 
                    desc: "50+ art styles",
                    bg: "bg-purple-50 border-purple-200",
                    iconColor: "text-purple-600",
                    pulse: true
                  },
                  { 
                    icon: ShoppingBag, 
                    title: "Products", 
                    desc: "Canvas, mugs & more",
                    bg: "bg-green-50 border-green-200",
                    iconColor: "text-green-600"
                  }
                ].map((step, i) => (
                  <div key={i} className="text-center space-y-2 sm:space-y-3">
                    <div className={`aspect-square w-full max-w-20 sm:max-w-none mx-auto rounded-xl border-2 ${step.bg} flex items-center justify-center`}>
                      <step.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${step.iconColor} ${step.pulse ? 'animate-pulse' : ''}`} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-foreground">
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Art Styles Preview */}
              <div className="p-3 sm:p-4 rounded-xl border bg-muted/30 backdrop-blur-sm">
                <div className="mb-2 text-xs sm:text-sm font-semibold text-primary">
                  🎨 Popular Art Styles
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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
              <div className="mt-4 sm:mt-6 flex items-center justify-around text-center border-t pt-4">
                {[
                  { value: "30s", label: "AI generation" },
                  { value: "50+", label: "Art styles" }, 
                  { value: "15+", label: "Product types" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="font-bold text-primary text-sm sm:text-base">
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