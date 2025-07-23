"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth/client";
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
  const { data: session } = useSession();
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
  const isLoggedIn = !!session?.user;
  const canGenerate = selectedStyle && (isLoggedIn ? userCredits.remaining >= totalCredits : true);

  const handleGenerate = () => {
    if (!selectedStyle) return;

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
          <div className="bg-muted mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Loading Styles</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="bg-muted h-8 w-16 animate-pulse rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="-py-6 overflow-hidden">
              <div className="bg-muted aspect-square animate-pulse" />
              <CardContent>
                <div className="bg-muted mb-2 h-4 w-full animate-pulse rounded" />
                <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
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
          <div className="text-destructive mb-4 font-medium">
            Failed to load styles
          </div>
          <div className="text-muted-foreground mb-4 text-sm">{error}</div>
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
          {isLoggedIn ? userCredits.remaining : "Login to view"}
        </Badge>
      </div>

      {/* Simplified category tabs */}
      <Tabs
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <TabsList className="mx-auto grid w-full max-w-lg grid-cols-4">
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {currentStyles.map((style) => (
                <Card
                  key={style.id}
                  className={cn(
                    "cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md",
                    selectedStyle?.id === style.id &&
                      "ring-primary shadow-lg ring-2",
                  )}
                  onClick={() => handleStyleSelect(style)}
                >
                  <div className="relative -mt-6 aspect-square">
                    {style.previewImageUrl ? (
                      <Image
                        src={style.previewImageUrl}
                        alt={style.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="bg-muted -mt-6 flex h-full w-full items-center justify-center">
                        <Palette className="text-muted-foreground h-8 w-8" />
                      </div>
                    )}

                    {/* Status badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {isStylePopular(style) && (
                        <Badge className="bg-orange-500 px-2 py-0.5 text-xs text-white">
                          <Star className="mr-1 h-3 w-3" />
                          Hot
                        </Badge>
                      )}
                      {isStylePremium(style) && (
                        <Badge className="bg-purple-500 px-2 py-0.5 text-xs text-white">
                          <Crown className="mr-1 h-3 w-3" />
                          Pro
                        </Badge>
                      )}
                    </div>

                    {/* Selection indicator */}
                    {selectedStyle?.id === style.id && (
                      <div className="bg-primary/10 absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                      </div>
                    )}

                    {/* Quick preview button */}
                    <div className="absolute right-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-100">
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
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm leading-tight font-medium">
                        {style.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0.5 text-xs"
                      >
                        <Coins className="mr-1 h-3 w-3" />
                        {getStyleCredits()}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-xs">
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
                <div className="h-12 w-12 overflow-hidden rounded-lg border">
                  {selectedStyle.previewImageUrl ? (
                    <Image
                      src={selectedStyle.previewImageUrl}
                      alt={selectedStyle.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="bg-muted flex h-full w-full items-center justify-center">
                      <Palette className="text-muted-foreground h-5 w-5" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {selectedStyle.name}
                    {isStylePremium(selectedStyle) && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Cost: {totalCredits} credits • {isLoggedIn ? `You have ${userCredits.remaining}` : "Login to generate"}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="gap-2"
              >
                <Wand2 className="h-4 w-4" />
                {isLoggedIn ? "Generate Art" : "Login & Generate"}
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

              <div className="bg-muted aspect-square overflow-hidden rounded-lg">
                {previewStyle.previewImageUrl ? (
                  <Image
                    src={previewStyle.previewImageUrl}
                    alt={previewStyle.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Palette className="text-muted-foreground h-16 w-16" />
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
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Select Style
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleQuickGenerate(previewStyle);
                    setPreviewStyle(null);
                  }}
                  className="flex-1"
                  disabled={isLoggedIn && userCredits.remaining < getStyleCredits()}
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isLoggedIn ? "Generate Now" : "Login & Generate"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
