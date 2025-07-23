"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Eye,
  ArrowRight,
  Coins,
  CheckCircle2,
  Loader2,
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
  // uploadedImages,
  onBack,
  onStartGeneration,
  userCredits,
}: StyleExplorerGridProps) {
  const [stylesData, setStylesData] = useState<StylesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<AIStyle | null>(null);
  // Removed unused hoveredStyle state
  const [previewStyle, setPreviewStyle] = useState<AIStyle | null>(null);
  const [activeCategory, setActiveCategory] = useState("classic");
  const [numImages] = useState(1);

  // Use first uploaded image as primary image for generation

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
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Loading Styles</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden -py-6">
              <div className="aspect-square bg-muted animate-pulse" />
              <CardContent>
                <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <Card className="p-8 text-center">
          <div className="text-destructive mb-4 font-medium">Failed to load styles</div>
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
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Clean header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Choose Your Art Style</h2>
            <p className="text-muted-foreground text-sm">
              Select a style to transform your pet photo
            </p>
          </div>
        </div>

        <Badge variant="outline" className="gap-1 px-3 py-1">
          <Coins className="h-4 w-4" />
          {userCredits.remaining}
        </Badge>
      </div>

      {/* Simplified category tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-sm font-medium"
            >
              {getCategoryEmoji(category.id)} {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-8">

            {/* Clean styles grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentStyles.map((style) => (
                <Card
                  key={style.id}
                  className={cn(
                    "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedStyle?.id === style.id && "ring-2 ring-primary shadow-lg"
                  )}
                  onClick={() => handleStyleSelect(style)}
                >
                  <div className="relative aspect-square -mt-6">
                    {style.previewImageUrl ? (
                      <Image
                        src={style.previewImageUrl}
                        alt={style.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center -mt-6">
                        <Palette className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}

                    {/* Status badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {isStylePopular(style) && (
                        <Badge className="bg-orange-500 text-white text-xs px-2 py-0.5">
                          <Star className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                      {isStylePremium(style) && (
                        <Badge className="bg-purple-500 text-white text-xs px-2 py-0.5">
                          <Crown className="w-3 h-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                    </div>

                    {/* Selection indicator */}
                    {selectedStyle?.id === style.id && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      </div>
                    )}

                    {/* Quick preview button */}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewStyle(style);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm leading-tight">{style.name}</h3>
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                        <Coins className="w-3 h-3 mr-1" />
                        {getStyleCredits()}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs line-clamp-2">
                      {style.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Clean generation bar */}
      {selectedStyle && (
        <Card className="border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg overflow-hidden border">
                  {selectedStyle.previewImageUrl ? (
                    <Image
                      src={selectedStyle.previewImageUrl}
                      alt={selectedStyle.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Palette className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {selectedStyle.name}
                    {isStylePremium(selectedStyle) && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Cost: {totalCredits} credits • You have {userCredits.remaining}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="gap-2"
              >
                <Wand2 className="h-4 w-4" />
                Generate Art
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simplified preview modal */}
      <Dialog open={!!previewStyle} onOpenChange={() => setPreviewStyle(null)}>
        <DialogContent className="max-w-2xl">
          {previewStyle && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {previewStyle.name}
                  {isStylePremium(previewStyle) && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </DialogTitle>
                <DialogDescription>
                  {previewStyle.description}
                </DialogDescription>
              </DialogHeader>

              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                {previewStyle.previewImageUrl ? (
                  <Image
                    src={previewStyle.previewImageUrl}
                    alt={previewStyle.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Palette className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="text-muted-foreground">Category</div>
                  <div className="font-medium">{previewStyle.category}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Credits</div>
                  <div className="font-medium">{getStyleCredits()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Time</div>
                  <div className="font-medium">~30s</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    handleStyleSelect(previewStyle);
                    setPreviewStyle(null);
                  }}
                  className="flex-1"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Select Style
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleQuickGenerate(previewStyle);
                    setPreviewStyle(null);
                  }}
                  className="flex-1"
                  disabled={userCredits.remaining < getStyleCredits()}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Now
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}