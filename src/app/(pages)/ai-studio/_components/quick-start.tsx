"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wand2,
  ArrowRight,
  Sparkles,
  Camera,
  Palette,
  Crown,
  Star,
  Heart,
  Zap,
} from "lucide-react";
import type { AIStyle } from "@/lib/ai/styles";
import { isStylePremium, isStylePopular } from "@/lib/ai/utils";

// Component to fetch and display popular styles
function StylesPreview() {
  const [styles, setStyles] = useState<AIStyle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStyles() {
      try {
        const response = await fetch("/api/ai/styles");
        if (response.ok) {
          const data = await response.json();
          // Get first 4 styles for preview
          setStyles(data.styles.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch styles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStyles();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="bg-muted aspect-square rounded-t-lg" />
            <CardContent className="p-3">
              <div className="bg-muted h-4 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {styles.map((style) => (
        <Card
          key={style.id}
          className="group -gap-6 -py-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="relative">
            <div className="from-muted/50 to-muted aspect-square overflow-hidden rounded-t-xl bg-gradient-to-br">
              {style.previewImageUrl ? (
                <img
                  src={style.previewImageUrl}
                  alt={style.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Palette className="text-primary h-8 w-8" />
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="absolute top-2 right-2 flex gap-1">
              {isStylePopular(style) && (
                <Badge className="bg-orange-500 text-xs text-white">
                  <Star className="mr-1 h-3 w-3" />
                  Popular
                </Badge>
              )}
              {isStylePremium(style) && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-xs text-white">
                  <Crown className="mr-1 h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>
          </div>

          <CardContent className="p-3">
            <h4 className="text-center font-medium">{style.name}</h4>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface QuickStartProps {
  onGetStarted: () => void;
  userCredits: {
    remaining: number;
    total: number;
  };
}

export function QuickStart({ onGetStarted, userCredits }: QuickStartProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Hero Section */}
      <div className="space-y-6 text-center">
        <div className="bg-primary/10 inline-flex items-center gap-2 rounded-full px-4 py-2">
          <Crown className="text-primary h-4 w-4" />
          <span className="text-sm font-medium">AI Art Studio</span>
        </div>

        <h1 className="from-primary via-primary/80 to-primary/60 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Transform Pet Into
          <span className="block">Magical Artwork</span>
        </h1>

        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Upload your pet&apos;s photo and watch our AI create stunning artwork
          in 10+ artistic styles. From classical paintings to modern digital
          art.
        </p>
      </div>

      {/* Process Preview */}
      <Card className="border-primary/20 border-2">
        <CardContent className="p-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
                <Camera className="text-primary h-8 w-8" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">1. Upload Photo</h3>
                <p className="text-muted-foreground text-sm">
                  Upload a clear photo of your pet. Best results with well-lit,
                  close-up shots.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
                <Palette className="text-primary h-8 w-8" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">2. Choose Style</h3>
                <p className="text-muted-foreground text-sm">
                  Select from 10+ artistic styles including oil painting,
                  watercolor, and anime.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
                <Sparkles className="text-primary h-8 w-8" />
              </div>
              <div>
                <h3 className="mb-2 font-semibold">3. Get Artwork</h3>
                <p className="text-muted-foreground text-sm">
                  Receive 2-4 high-quality artworks in ~30 seconds. Download or
                  create products.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Styles Preview */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">Popular Art Styles</h2>
          <p className="text-muted-foreground">
            Choose from our most loved artistic transformations
          </p>
        </div>

        <StylesPreview />
      </div>

      {/* Stats */}
      <div className="mx-auto grid max-w-md grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
            <Heart className="h-4 w-4 text-pink-500" />
            <span>50,000+</span>
          </div>
          <div className="text-muted-foreground text-xs">Pets transformed</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>4.9/5</span>
          </div>
          <div className="text-muted-foreground text-xs">Rating</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
            <Zap className="h-4 w-4 text-orange-500" />
            <span>30s</span>
          </div>
          <div className="text-muted-foreground text-xs">Generation time</div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="space-y-4 text-center">
        <Button
          size="lg"
          onClick={onGetStarted}
          className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 h-14 gap-3 bg-gradient-to-r px-8 text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <Wand2 className="h-5 w-5" />
          Start Creating Magic
          <ArrowRight className="h-5 w-5" />
        </Button>

        <div className="text-muted-foreground text-sm">
          You have <strong>{userCredits.remaining}</strong> of{" "}
          {userCredits.total} credits remaining
        </div>
      </div>

      {/* Pro Tips */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:border-blue-800 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Pro Tips for Best Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div className="flex items-start gap-2">
              <div className="mt-2 h-2 w-2 rounded-full bg-green-500" />
              <div>
                <div className="font-medium">High Resolution</div>
                <div className="text-muted-foreground">
                  Use photos at least 512x512px for crisp results
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-2 h-2 w-2 rounded-full bg-green-500" />
              <div>
                <div className="font-medium">Clear Focus</div>
                <div className="text-muted-foreground">
                  Ensure your pet is the main subject and well-lit
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-2 h-2 w-2 rounded-full bg-green-500" />
              <div>
                <div className="font-medium">Clean Background</div>
                <div className="text-muted-foreground">
                  Simple backgrounds work best for artistic transformation
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
