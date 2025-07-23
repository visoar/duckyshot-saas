"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Palette,
  // Sparkles,
  // ArrowRight,
  // Star,
  // Crown,
  // CheckCircle,
  Brush,
  Zap,
  Wand2
} from "lucide-react";
// import Link from "next/link";
import { DEFAULT_AI_STYLES, STYLE_CATEGORIES, getStylesByCategory } from "@/lib/ai/styles";

// Category design system
const getCategoryDesign = (category: string) => {
  switch (category) {
    case "classic":
      return {
        gradient: "from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950",
        iconBg: "bg-amber-100 dark:bg-amber-900",
        iconColor: "text-amber-600 dark:text-amber-400",
        icon: Brush,
        theme: "Traditional Art"
      };
    case "modern":
      return {
        gradient: "from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950",
        iconBg: "bg-blue-100 dark:bg-blue-900",
        iconColor: "text-blue-600 dark:text-blue-400",  
        icon: Zap,
        theme: "Digital & Contemporary"
      };
    case "special":
      return {
        gradient: "from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
        iconBg: "bg-purple-100 dark:bg-purple-900",
        iconColor: "text-purple-600 dark:text-purple-400",
        icon: Wand2,
        theme: "Artistic & Unique"
      };
    default:
      return {
        gradient: "from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950",
        iconBg: "bg-gray-100 dark:bg-gray-900",
        iconColor: "text-gray-600 dark:text-gray-400",
        icon: Palette,
        theme: "Artistic"
      };
  }
};

function StyleCategoryCard({ category, styles }: { 
  category: { id: string; name: string; description: string }; 
  styles: typeof DEFAULT_AI_STYLES;
}) {
  const design = getCategoryDesign(category.id);
  const IconComponent = design.icon;
  
  return (
    <Card className="h-full">
      <div className="p-6 space-y-4">
        {/* Category Header with Icon */}
        <div className={`rounded-lg bg-gradient-to-br ${design.gradient} p-4 text-center`}>
          {/* Icon */}
          <div className={`mx-auto mb-3 w-12 h-12 rounded-full ${design.iconBg} flex items-center justify-center`}>
            <IconComponent className={`w-6 h-6 ${design.iconColor}`} />
          </div>
          
          {/* Category Title */}
          <h3 className="font-bold text-lg text-foreground mb-1">
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {design.theme}
          </p>
        </div>
        {/* Popular Styles Preview */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {styles.slice(0, 3).map((style) => (
              <Badge key={style.id} variant="outline" className="text-xs">
                {style.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ArtGalleryShowcase() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      {/* Clean Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mx-auto mb-12 sm:mb-16 max-w-3xl text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <Palette className="mr-2 h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI Art Styles
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
            Transform Your Pet Into
            <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Beautiful Artwork
            </span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Choose from {DEFAULT_AI_STYLES.length}+ professional AI art styles. From classic paintings to modern digital art, create stunning pet portraits in seconds.
          </p>
        </header>

        {/* Art Style Categories */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              Art Style Categories
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {STYLE_CATEGORIES.slice(0, 3).map((category) => {
              const categoryStyles = getStylesByCategory(category.id);
              return (
                <StyleCategoryCard
                  key={category.id}
                  category={category}
                  styles={categoryStyles}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}