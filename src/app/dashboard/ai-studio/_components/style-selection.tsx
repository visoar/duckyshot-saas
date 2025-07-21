"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Wand2,
  Star,
  Crown,
  Check,
  Eye,
  Settings,
  Zap,
  Clock,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { AIStyle } from "@/lib/ai/styles";
import type { GenerationSettings } from "./ai-studio-workflow";
import { isStylePremium, isStylePopular, getStyleCredits } from "@/lib/ai/utils";

interface StylesResponse {
  styles: AIStyle[];
  stylesByCategory: Record<string, AIStyle[]>;
  categories: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

interface StyleSelectionProps {
  uploadedImage: { url: string; file: File };
  selectedStyle?: AIStyle;
  onStyleSelect: (style: AIStyle) => void;
  onStartGeneration: (settings: GenerationSettings) => void;
  onBack: () => void;
  userCredits: { remaining: number; total: number };
}

export function StyleSelection({
  uploadedImage,
  selectedStyle,
  onStyleSelect,
  onStartGeneration,
  onBack,
  userCredits,
}: StyleSelectionProps) {
  const [stylesData, setStylesData] = useState<StylesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewStyle, setPreviewStyle] = useState<AIStyle | null>(null);
  const [numImages] = useState(1);
  const [generationMode, setGenerationMode] = useState<"fast" | "quality">("fast");

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Change Photo
          </Button>
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-xl" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-20 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Change Photo
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-muted">
              <Image 
                src={uploadedImage.url} 
                alt="Uploaded pet"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Choose Your Art Style</h2>
              <p className="text-muted-foreground">
                Each style will transform your pet in a unique way
              </p>
            </div>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-destructive mb-2">Failed to load AI styles</div>
            <div className="text-sm text-muted-foreground">{error}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stylesData) {
    return null;
  }

  const categories = stylesData.categories;
  
  const getStylesByCategory = (category: string) => 
    stylesData.stylesByCategory[category] || [];

  const totalCredits = selectedStyle ? getStyleCredits() * numImages : 0;
  const canGenerate = selectedStyle && userCredits.remaining >= totalCredits;

  const handleGenerate = () => {
    if (!selectedStyle || !canGenerate) return;
    
    const settings: GenerationSettings = {
      numImages,
      mode: generationMode,
      style: selectedStyle,
    };
    
    onStartGeneration(settings);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with uploaded image */}
      <div className="flex items-center gap-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Change Photo
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-muted">
            <Image 
              src={uploadedImage.url} 
              alt="Uploaded pet"
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Choose Your Art Style</h2>
            <p className="text-muted-foreground">
              Each style will transform your pet in a unique way
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Styles Grid */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue={categories[0]?.id} className="w-full">
            <TabsList className="grid w-full" style={{gridTemplateColumns: `repeat(${categories.length}, 1fr)`}}>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs capitalize">
                  {category.name}
                  {category.id === "special" && (
                    <Crown className="h-3 w-3 ml-1 text-yellow-500" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
                  {getStylesByCategory(category.id).map((style) => (
                    <Card 
                      key={style.id}
                      className={cn(
                        "group cursor-pointer transition-all duration-300 hover:shadow-lg -py-6 -gap-6",
                        selectedStyle?.id === style.id && "ring-2 ring-primary shadow-lg scale-105"
                      )}
                      onClick={() => onStyleSelect(style)}
                    >
                      <div className="relative">
                        <div className="aspect-square rounded-t-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                          {style.previewImageUrl ? (
                            <Image 
                              src={style.previewImageUrl}
                              alt={style.name}
                              width={200}
                              height={200}
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

                        {/* Selection indicator */}
                        {selectedStyle?.id === style.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-t-lg">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-5 w-5 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{style.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {getStyleCredits()} credit/image
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {style.description}
                        </p>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewStyle(style);
                          }}
                          className="text-xs w-full"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {/* Generation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Generation mode */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Generation Mode
                </label>
                <div className="space-y-2">
                  <Button
                    variant={generationMode === "fast" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGenerationMode("fast")}
                    className="w-full justify-start text-xs"
                  >
                    <Zap className="h-3 w-3 mr-2" />
                    Fast (30s)
                  </Button>
                  <Button
                    variant={generationMode === "quality" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGenerationMode("quality")}
                    className="w-full justify-start text-xs"
                  >
                    <Star className="h-3 w-3 mr-2" />
                    Quality (60s)
                  </Button>
                </div>
              </div>

              {/* Cost calculation */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Cost:</span>
                  <span className="text-sm font-bold">
                    {selectedStyle ? `${totalCredits} credits` : 'Select a style first'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>You have:</span>
                  <span>{userCredits.remaining} credits</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Style Preview */}
          {selectedStyle && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                  {selectedStyle.previewImageUrl ? (
                    <Image 
                      src={selectedStyle.previewImageUrl}
                      alt={selectedStyle.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Palette className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{selectedStyle.name}</h4>
                    {isStylePremium(selectedStyle) && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedStyle.description}
                  </p>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Wand2 className="h-4 w-4" />
                  {selectedStyle ? `Generate Art (${totalCredits} credits)` : 'Select a style to continue'}
                </Button>

                {!canGenerate && userCredits.remaining < totalCredits && (
                  <p className="text-xs text-destructive text-center">
                    Insufficient credits. Need {totalCredits - userCredits.remaining} more.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Credits info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Credits remaining:</span>
                <span className="font-bold">{userCredits.remaining}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Style Preview Modal */}
      <Dialog open={!!previewStyle} onOpenChange={() => setPreviewStyle(null)}>
        <DialogContent className="max-w-2xl">
          {previewStyle && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {previewStyle.name}
                  {isStylePremium(previewStyle) && <Crown className="h-5 w-5 text-yellow-500" />}
                </DialogTitle>
                <DialogDescription>
                  {previewStyle.description}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Style Preview</h4>
                  <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                    {previewStyle.previewImageUrl ? (
                      <Image 
                        src={previewStyle.previewImageUrl}
                        alt={previewStyle.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Palette className="h-12 w-12 text-primary" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Style Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <Badge variant="outline">{previewStyle.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Credits:</span>
                        <span className="font-medium">{getStyleCredits()} credit/image</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Generation time:</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          ~30-60s
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      onClick={() => {
                        onStyleSelect(previewStyle);
                        setPreviewStyle(null);
                      }}
                      className="w-full"
                    >
                      Select This Style
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setPreviewStyle(null)}
                      className="w-full"
                    >
                      Close Preview
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