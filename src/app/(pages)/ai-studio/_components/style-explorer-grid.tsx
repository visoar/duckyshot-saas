"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Wand2,
  Star,
  Crown,
  Palette,
  Heart,
  Zap,
  Clock,
  Eye,
  Sparkles,
  ArrowRight,
  Settings,
  Coins,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { AIStyle } from "@/lib/ai/styles";
import type { GenerationSettings } from "./ai-studio-workflow";
import {
  isStylePremium,
  isStylePopular,
  getStyleCredits,
} from "@/lib/ai/utils";

interface UploadedImageFile {
  uploadId: string; // UUID from database
  url: string;
  key: string;
  file: File;
  size: number;
  contentType: string;
  fileName: string;
  qualityScore?: number;
  suggestions?: string[];
}

interface StyleExplorerGridProps {
  uploadedImages: UploadedImageFile[];
  onBack: () => void;
  onStartGeneration: (settings: GenerationSettings) => void;
  userCredits: { remaining: number; total: number };
}

interface StylesResponse {
  styles: AIStyle[];
  stylesByCategory: Record<string, AIStyle[]>;
  categories: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}


export function StyleExplorerGrid({
  uploadedImages,
  onBack,
  onStartGeneration,
  userCredits,
}: StyleExplorerGridProps) {
  const [stylesData, setStylesData] = useState<StylesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<AIStyle | null>(null);
  const [hoveredStyle, setHoveredStyle] = useState<AIStyle | null>(null);
  const [previewStyle, setPreviewStyle] = useState<AIStyle | null>(null);
  const [activeCategory, setActiveCategory] = useState("classic");
  const [numImages] = useState(1);

  const primaryImage = uploadedImages[0]; // Use first uploaded image as primary

  // Fetch styles on component mount
  useEffect(() => {
    async function fetchStyles() {
      try {
        setLoading(true);
        const response = await fetch("/api/ai/styles");

        if (!response.ok) {
          throw new Error("Failed to fetch AI styles");
        }

        const data: StylesResponse = await response.json();
        setStylesData(data);
      } catch (err) {
        console.error("Error fetching styles:", err);
        setError(err instanceof Error ? err.message : "Failed to load styles");
      } finally {
        setLoading(false);
      }
    }

    fetchStyles();
  }, []);

  const getStylesByCategory = (category: string) =>
    stylesData?.stylesByCategory[category] || [];

  const totalCredits = selectedStyle ? getStyleCredits() * numImages : 0;
  const canGenerate = selectedStyle && userCredits.remaining >= totalCredits;

  const handleGenerate = () => {
    if (!selectedStyle || !canGenerate) return;

    const settings: GenerationSettings = {
      numImages,
      style: selectedStyle,
    };

    onStartGeneration(settings);
  };

  const handleStyleSelect = (style: AIStyle) => {
    setSelectedStyle(style);
  };

  const handleQuickGenerate = (style: AIStyle) => {
    const settings: GenerationSettings = {
      numImages,
      style,
    };

    onStartGeneration(settings);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in-50 duration-500">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
            <Palette className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Loading Styles...</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-4 md:gap-6 min-w-0 flex-1">
            <Button variant="ghost" onClick={onBack} className="gap-2 shrink-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Change Photos</span>
            </Button>
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-muted animate-pulse" />
            <div className="space-y-2 min-w-0 flex-1">
              <div className="h-6 md:h-8 w-48 md:w-64 bg-muted animate-pulse rounded" />
              <div className="h-3 md:h-4 w-32 md:w-48 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="h-12 w-16 bg-muted animate-pulse rounded" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-muted animate-pulse rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 mb-4">
            <Palette className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Error Loading Styles</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-4 md:gap-6 mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Change Photos</span>
          </Button>
        </div>
        
        <Card className="p-8 text-center">
          <div className="text-destructive mb-4 font-medium">Failed to load AI styles</div>
          <div className="text-muted-foreground text-sm mb-4">{error}</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  if (!stylesData) return null;

  // Category emoji mapping
  const getCategoryEmoji = (categoryId: string) => {
    const emojiMap: Record<string, string> = {
      classic: "🎨",
      modern: "✨", 
      special: "🌟",
      seasonal: "🎄",
    };
    return emojiMap[categoryId] || "🎨";
  };

  const categories = stylesData?.categories || [];
  const currentStyles = getStylesByCategory(activeCategory);

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in-50 duration-500">
      {/* Step Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-4">
          <Palette className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Choose Your Style</span>
        </div>
      </div>

      {/* Header with uploaded image */}
      <div className="flex items-center justify-between gap-4 md:gap-6">

        <Button variant="ghost" onClick={onBack} className="gap-2 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary truncate">Choose Your Art Style
            </h2>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
            Click any style to see a preview, then generate your masterpiece
          </p>
        </div>

        <div className="text-right shrink-0">
          <Badge variant="outline">
            <div className="flex gap-2 text-sm"><Coins className="size-5" /> {userCredits.remaining}</div>
          </Badge>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 h-14 md:h-16">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex flex-col gap-0.5 md:gap-1 h-12 md:h-14 px-2"
            >
              <span className="text-base md:text-lg">{getCategoryEmoji(category.id)}</span>
              <span className="text-[10px] md:text-xs font-medium leading-tight">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-8">

            {/* Styles Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentStyles.map((style) => (
                <div
                  key={style.id}
                  className={cn(
                    "group relative cursor-pointer transition-all duration-300",
                    selectedStyle?.id === style.id && "ring-2 ring-primary ring-offset-4",
                    hoveredStyle?.id === style.id && "scale-105 z-10"
                  )}
                  onMouseEnter={() => setHoveredStyle(style)}
                  onMouseLeave={() => setHoveredStyle(null)}
                  onClick={() => handleStyleSelect(style)}
                >
                  <Card className="overflow-hidden border-2 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-xl">
                    {/* Style Preview */}
                    <div className="relative aspect-square">
                      {/* Main preview image */}
                      <div className="absolute inset-0">
                        {style.previewImageUrl ? (
                          <Image
                            src={style.previewImageUrl}
                            alt={style.name}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Palette className="h-12 w-12 text-primary/50" />
                          </div>
                        )}
                      </div>

                      {/* Overlay with user's pet preview (simulated) */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300">
                        <div className="absolute inset-4 border-2 border-white/0 group-hover:border-white/30 rounded-lg transition-all duration-300" />
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 md:top-3 right-2 md:right-3 flex flex-col gap-1 md:gap-2">
                        {isStylePopular(style) && (
                          <Badge className="bg-orange-500 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 shadow-lg">
                            <Star className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
                            <span className="hidden sm:inline">Popular</span>
                          </Badge>
                        )}
                        {isStylePremium(style) && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 shadow-lg">
                            <Crown className="mr-0.5 md:mr-1 h-2.5 w-2.5 md:h-3 md:w-3" />
                            <span className="hidden sm:inline">Premium</span>
                          </Badge>
                        )}
                      </div>

                      {/* Quick action buttons */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 hover:bg-white shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewStyle(style);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickGenerate(style);
                            }}
                            disabled={userCredits.remaining < getStyleCredits()}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Selection indicator */}
                      {selectedStyle?.id === style.id && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                            <Wand2 className="h-6 w-6" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Style Info */}
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-base leading-tight">{style.name}</h3>
                      </div>
                      <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
                        {style.description}
                      </p>
                      
                      {/* Style metrics */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ~30s
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Coins className="w-3 h-3" />
                          {getStyleCredits()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Generation Settings & Action */}
      {selectedStyle && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Selected style preview */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg overflow-hidden border-2 border-primary/20">
                  {selectedStyle.previewImageUrl ? (
                    <Image
                      src={selectedStyle.previewImageUrl}
                      alt={selectedStyle.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <Palette className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {selectedStyle.name}
                    {isStylePremium(selectedStyle) && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedStyle.description}
                  </p>
                </div>
              </div>

              <div className="flex-1" />

              {/* Generation controls */}
              <div className="flex items-center gap-4">

                <div className="text-sm text-center">
                  <div className="font-semibold">Cost: {totalCredits} credits</div>
                  <div className="text-muted-foreground">
                    You have {userCredits.remaining}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  size="lg"
                  className="gap-2 min-w-[180px]"
                >
                  <Wand2 className="h-5 w-5" />
                  Generate Art
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Style Preview Modal */}
      <Dialog open={!!previewStyle} onOpenChange={() => setPreviewStyle(null)}>
        <DialogContent className="max-w-3xl">
          {previewStyle && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                {previewStyle.name} <Badge variant="outline">Style Preview</Badge>
                  {isStylePremium(previewStyle) && (
                    <Crown className="h-5 w-5 text-yellow-500" />
                  )}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {previewStyle.description}
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    {previewStyle.previewImageUrl ? (
                      <Image
                        src={previewStyle.previewImageUrl}
                        alt={previewStyle.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Palette className="h-16 w-16 text-primary/50" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Style Details</h4>
                    <div className="flex flex-col gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge variant="outline">{previewStyle.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Credits:</span>
                        <Badge variant="outline" className="text-xs">
                          <Coins className="w-3 h-3 mr-1" />
                          {getStyleCredits()}
                        </Badge>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span className="text-muted-foreground">Generation time:</span>
                        <span className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">

                          <Clock className="h-3 w-3" />
                          ~30s
                        </Badge>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        handleStyleSelect(previewStyle);
                        setPreviewStyle(null);
                      }}
                      className="w-full"
                      size="lg"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Select This Style
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleQuickGenerate(previewStyle);
                        setPreviewStyle(null);
                      }}
                      className="w-full"
                      size="lg"
                      disabled={userCredits.remaining < getStyleCredits()}
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}