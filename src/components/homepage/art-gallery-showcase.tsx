"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Palette,
  Sparkles,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { DEFAULT_AI_STYLES, STYLE_CATEGORIES, getStylesByCategory } from "@/lib/ai/styles";

// Color mapping for style categories
const getCategoryColor = (category: string) => {
  switch (category) {
    case "classic":
      return "from-amber-600 via-red-700 to-purple-800";
    case "modern":
      return "from-pink-400 via-purple-400 to-indigo-400";
    case "special":
      return "from-yellow-400 via-orange-500 to-red-500";
    default:
      return "from-blue-300 via-purple-300 to-pink-300";
  }
};

// Get mood description for categories
const getCategoryMood = (category: string) => {
  switch (category) {
    case "classic":
      return "Timeless & Elegant";
    case "modern":
      return "Contemporary & Vibrant";
    case "special":
      return "Unique & Creative";
    default:
      return "Artistic & Beautiful";
  }
};

function StyleCategoryCard({ category, styles, isActive, onClick }: { 
  category: { id: string; name: string; description: string }; 
  styles: typeof DEFAULT_AI_STYLES;
  isActive: boolean; 
  onClick: () => void; 
}) {
  const categoryColor = getCategoryColor(category.id);
  const categoryMood = getCategoryMood(category.id);
  
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
        isActive ? 'ring-2 ring-primary shadow-lg scale-105' : 'hover:scale-102'
      }`}
      onClick={onClick}
    >
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Category Preview */}
        <div className={`aspect-video rounded-lg bg-gradient-to-br ${categoryColor} border border-primary/20 flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-white text-center px-4">
            <h3 className="font-bold text-lg sm:text-xl lg:text-2xl drop-shadow-lg">
              {category.name}
            </h3>
            <p className="text-sm sm:text-base opacity-90 mt-1">
              {styles.length} styles
            </p>
          </div>
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm border border-white/20 rounded-full px-2 py-1">
            <span className="text-xs font-medium text-gray-800">{categoryMood}</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Category Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base sm:text-lg">{category.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {styles.length} styles
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {category.description}
          </p>
        </div>

        {/* Style List - Show when active */}
        {isActive && (
          <div className="border-t border-border pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {styles.slice(0, 6).map((style) => (
                <div key={style.id} className="text-center p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="text-xs font-medium text-foreground truncate">
                    {style.name}
                  </div>
                </div>
              ))}
            </div>
            {styles.length > 6 && (
              <p className="text-xs text-muted-foreground text-center">
                +{styles.length - 6} more styles
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export function ArtGalleryShowcase() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const activeCategory = STYLE_CATEGORIES[activeCategoryIndex];
  const activeStyles = getStylesByCategory(activeCategory.id);

  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-muted/30">
      {/* Clean Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Gallery Header */}
        <div className="mx-auto mb-12 sm:mb-16 max-w-4xl text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 sm:px-4 py-1.5 sm:py-2">
            <Palette className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              AI Pet Art Styles Gallery
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            Transform Your Pet Into
            <span className="block text-primary">
              Stunning AI Artwork
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Choose from {DEFAULT_AI_STYLES.length}+ AI art styles across classic, modern, and special categories. 
            Perfect for wall art, custom merchandise, and personalized gifts.
          </p>
        </div>

        {/* Style Categories Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Explore Art Style Categories
            </h3>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              From timeless classics to modern digital styles, find the perfect artistic expression for your pet.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {STYLE_CATEGORIES.slice(0, 3).map((category, index) => {
              const categoryStyles = getStylesByCategory(category.id);
              return (
                <StyleCategoryCard
                  key={category.id}
                  category={category}
                  styles={categoryStyles}
                  isActive={activeCategoryIndex === index}
                  onClick={() => setActiveCategoryIndex(index)}
                />
              );
            })}
          </div>
        </div>

        {/* Popular Styles Showcase */}
        <div className="mt-16 sm:mt-20 space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              Most Popular Styles
            </h3>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              These styles are loved by pet parents worldwide for their versatility and stunning results.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {DEFAULT_AI_STYLES.slice(0, 10).map((style) => {
              const categoryColor = getCategoryColor(style.category);
              return (
                <Card key={style.id} className="group cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105">
                  <div className="p-3 sm:p-4 space-y-3">
                    <div className={`aspect-square rounded-lg bg-gradient-to-br ${categoryColor} border border-primary/20 flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative z-10 text-white font-bold text-sm sm:text-base text-center px-2 drop-shadow-lg">
                        {style.name}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-sm text-foreground truncate">{style.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{style.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 sm:mt-20 text-center space-y-4 sm:space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            Ready to Create Your Pet's Masterpiece?
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from {DEFAULT_AI_STYLES.length}+ styles and turn your pet's photo into stunning artwork. 
            Then order custom products or download high-resolution files.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg bg-primary hover:bg-primary/90" asChild>
              <Link href="/ai-studio">
                <Sparkles className="mr-2 h-4 h-4 sm:h-5 sm:w-5" />
                Start Creating Art
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg border-2" asChild>
              <Link href="/gallery">
                <Palette className="mr-2 h-4 h-4 sm:h-5 sm:w-5" />
                Explore All Styles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}