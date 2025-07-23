'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Star,
  Users,
  Sparkles,
  Heart,
  Camera,
  Zap,
  CheckCircle,
  Gift,
  ShoppingBag,
  Award,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Enhanced background with warm emotional feel */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/[0.02] to-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-primary/15 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div 
          className="grid items-center gap-12 lg:gap-20 lg:grid-cols-2"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {/* Left Content - Enhanced messaging */}
          <motion.div 
            className="space-y-8 lg:space-y-10" 
            variants={fadeInUp}
          >
            {/* Badge with emotional hook */}
            <motion.div variants={fadeInUp}>
              <Badge 
                variant="secondary" 
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5"
              >
                <Heart className="h-4 w-4 text-primary" />
                Turn Pet Photos Into Treasured Keepsakes
                <Sparkles className="h-3 w-3 text-primary" />
              </Badge>
            </motion.div>

            {/* Emotional headline focused on outcome */}
            <motion.div className="space-y-6" variants={fadeInUp}>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
                <span className="text-foreground">
                  Turn Paw Into Art
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent font-extrabold">
                  They Deserve
                </span>
              </h1>

              <p className="text-muted-foreground max-w-xl text-md sm:text-md lg:text-lg leading-relaxed">
                Transform cherished pet moments into{" "}
                <span className="text-foreground font-semibold">
                  museum-quality artwork
                </span>{" "}
                and custom products. From Van Gogh masterpieces to anime art, then onto{" "}
                <span className="text-foreground font-semibold">
                  canvas prints, mugs, apparel
                </span>{" "}
                — all in one seamless experience.
              </p>
            </motion.div>


            {/* Enhanced CTA with urgency and value */}
            <motion.div className="space-y-6" variants={fadeInUp}>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="h-16 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  asChild
                >
                  <Link href="/ai-studio">
                    <Heart className="mr-3 h-5 w-5" />
                    Start Creating Now
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 px-8 text-lg font-semibold border-2 border-primary/20 hover:border-primary/40"
                  asChild
                >
                  <Link href="/gallery">
                    <Users className="mr-3 h-5 w-5" />
                    See Examples
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1/2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <div className="text-sm font-medium">
                      <span className="text-foreground">4.9/5</span>
                      <span className="text-muted-foreground"> from 12,000+ happy pet parents</span>
                    </div>
                  </div>
                </div>

                {/* Risk reduction */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>30s Free to try</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>50+ art styles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Art to products in one click</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual - Simplified but impactful */}
          <motion.div 
            className="relative order-first lg:order-last w-full"
            variants={fadeInUp}
          >
            <div className="relative mx-auto max-w-lg">
              {/* Main Demo Card */}
              <Card className="relative p-6 sm:p-8 shadow-2xl border-2 bg-gradient-to-br from-card to-card/80">
                {/* Header with emotional connection */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg">
                      <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-bold text-primary">
                        Pet Art Creator
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        From photo to product
                      </div>
                    </div>
                  </div>
                  <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-primary/70" />
                </div>

                {/* Simplified flow visualization */}
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {/* Step 1: Upload */}
                    <div className="text-center space-y-2">
                      <div className="aspect-square rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center">
                        <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-primary/70" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">Upload</p>
                    </div>

                    {/* Step 2: AI Transform */}
                    <div className="text-center space-y-2">
                      <div className="aspect-square rounded-lg bg-gradient-to-r from-primary/10 to-primary/20 flex items-center justify-center border border-primary/20">
                        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-pulse" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">AI Magic</p>
                    </div>

                    {/* Step 3: Products */}
                    <div className="text-center space-y-2">
                      <div className="aspect-square rounded-lg bg-gradient-to-r from-primary/20 to-primary/30 flex items-center justify-center border border-primary/30">
                        <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">Products</p>
                    </div>
                  </div>

                  {/* Popular styles showcase */}
                  <div className="rounded-lg border bg-muted/5 p-4">
                    <div className="mb-3 text-sm font-semibold text-primary">
                      Popular Art Styles
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {[
                        { name: "Van Gogh", active: true },
                        { name: "Anime", active: false },
                        { name: "Oil Paint", active: false },
                        { name: "Watercolor", active: false },
                      ].map((style, i) => (
                        <div
                          key={i}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                            style.active
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {style.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="flex items-center justify-around text-center text-sm">
                    <div>
                      <div className="font-bold text-primary">30s</div>
                      <div className="text-muted-foreground text-xs">Create art</div>
                    </div>
                    <div>
                      <div className="font-bold text-primary">50+</div>
                      <div className="text-muted-foreground text-xs">Art styles</div>
                    </div>
                    <div>
                      <div className="font-bold text-primary">15+</div>
                      <div className="text-muted-foreground text-xs">Products</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Floating emotional elements */}
              <div className="absolute -top-4 -right-4 rounded-lg border bg-card/90 backdrop-blur-sm px-3 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-foreground">Creating memories...</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-lg border bg-card/90 backdrop-blur-sm px-3 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <Heart className="h-3 w-3 text-primary fill-current" />
                  <span className="text-xs font-semibold text-primary">
                    Made with Love
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}