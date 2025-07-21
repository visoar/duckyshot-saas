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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square rounded-t-lg bg-muted" />
            <CardContent className="p-3">
              <div className="h-4 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {styles.map((style) => (
        <Card key={style.id} className="group hover:shadow-lg transition-all duration-300 -gap-6 -py-6">
          <div className="relative">
            <div className="aspect-square rounded-t-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
              {style.previewImageUrl ? (
                <img 
                  src={style.previewImageUrl}
                  alt={style.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Palette className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 right-2 flex gap-1">
              {isStylePopular(style) && (
                <Badge className="bg-orange-500 text-white text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
              {isStylePremium(style) && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
          
          <CardContent className="p-3">
            <h4 className="font-medium text-center">{style.name}</h4>
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Crown className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Art Studio</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Transform Pet Into
          <span className="block">Magical Artwork</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your pet&apos;s photo and watch our AI create stunning artwork in 10+ artistic styles. 
          From classical paintings to modern digital art.
        </p>
      </div>

      {/* Process Preview */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">1. Upload Photo</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a clear photo of your pet. Best results with well-lit, close-up shots.
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <Palette className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Choose Style</h3>
                <p className="text-sm text-muted-foreground">
                  Select from 10+ artistic styles including oil painting, watercolor, and anime.
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Get Artwork</h3>
                <p className="text-sm text-muted-foreground">
                  Receive 2-4 high-quality artworks in ~30 seconds. Download or create products.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Styles Preview */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Popular Art Styles</h2>
          <p className="text-muted-foreground">Choose from our most loved artistic transformations</p>
        </div>

        <StylesPreview />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-pink-500" />
            <span>50,000+</span>
          </div>
          <div className="text-xs text-muted-foreground">Pets transformed</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>4.9/5</span>
          </div>
          <div className="text-xs text-muted-foreground">Rating</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-orange-500" />
            <span>30s</span>
          </div>
          <div className="text-xs text-muted-foreground">Generation time</div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-4">
        <Button
          size="lg"
          onClick={onGetStarted}
          className="h-14 px-8 text-lg gap-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Wand2 className="h-5 w-5" />
          Start Creating Magic
          <ArrowRight className="h-5 w-5" />
        </Button>
        
        <div className="text-sm text-muted-foreground">
          You have <strong>{userCredits.remaining}</strong> of {userCredits.total} credits remaining
        </div>
      </div>

      {/* Pro Tips */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Pro Tips for Best Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <div className="font-medium">High Resolution</div>
                <div className="text-muted-foreground">Use photos at least 512x512px for crisp results</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <div className="font-medium">Clear Focus</div>
                <div className="text-muted-foreground">Ensure your pet is the main subject and well-lit</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
              <div>
                <div className="font-medium">Clean Background</div>
                <div className="text-muted-foreground">Simple backgrounds work best for artistic transformation</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}