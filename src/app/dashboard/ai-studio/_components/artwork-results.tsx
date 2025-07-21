"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Download,
  Share2,
  ShoppingBag,
  RotateCcw,
  Heart,
  Star,
  Maximize2,
  Eye,
  Copy,
  ExternalLink,
  Plus,
  Sparkles,
  Crown,
  Palette,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import type { ArtworkResult } from "./ai-studio-workflow";
import { isStylePremium, getStyleCredits } from "@/lib/ai/utils";

interface ArtworkResultsProps {
  results: ArtworkResult[];
  originalImage: { url: string; file: File };
  onRestart: () => void;
  onBack: () => void;
}

export function ArtworkResults({
  results,
  originalImage,
  onRestart,
  onBack,
}: ArtworkResultsProps) {
  const [selectedImage, setSelectedImage] = useState<ArtworkResult | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "comparison">("comparison");

  const handleDownload = async (artwork: ArtworkResult) => {
    try {
      const response = await fetch(artwork.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pet-artwork-${artwork.style.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Artwork downloaded successfully!");
    } catch {
      toast.error("Failed to download artwork. Please try again.");
    }
  };

  const handleDownloadAll = async () => {
    for (const artwork of results) {
      await handleDownload(artwork);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleShare = async (artwork: ArtworkResult) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My pet as ${artwork.style.name} art!`,
          text: `Check out this amazing AI artwork of my pet in ${artwork.style.name} style!`,
          url: artwork.url,
        });
      } catch {
        // Fallback to clipboard
        await copyToClipboard(artwork.url);
      }
    } else {
      await copyToClipboard(artwork.url);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Artwork URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL to clipboard");
    }
  };

  const handleCreateProducts = () => {
    // This would navigate to the product customization page
    toast.info("Redirecting to product customization...");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-2xl">
          <span>🎉</span>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Your Masterpiece is Ready!
          </h2>
          <span>🎨</span>
        </div>
        <p className="text-muted-foreground text-lg">
          Your pet has been transformed into beautiful {results[0]?.style.name} artwork
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "comparison" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("comparison")}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Comparison
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Gallery
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Change Style
          </Button>
          <Button variant="outline" onClick={onRestart} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Another
          </Button>
        </div>
      </div>

      {/* Results Display */}
      {viewMode === "comparison" ? (
        <div className="space-y-6">
          {/* Before/After Comparison */}
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-muted-foreground">Original Photo</h3>
                  <Badge variant="outline" className="text-xs">
                    {(originalImage.file.size / (1024 * 1024)).toFixed(1)} MB
                  </Badge>
                </div>
                <div className="aspect-[4/3] rounded-xl overflow-hidden border">
                  <Image 
                    src={originalImage.url}
                    alt="Original pet photo"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-primary">AI Generated Art</h3>
                  <div className="flex items-center gap-2">
                    {results[0] && isStylePremium(results[0].style) && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                    <Badge className="text-xs">
                      {results[0]?.style.name}
                    </Badge>
                  </div>
                </div>
                <div className="aspect-[4/3] rounded-xl overflow-hidden border group relative">
                  <Image 
                    src={results[0]?.url}
                    alt="AI generated artwork"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setSelectedImage(results[0])}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Results */}
          {results.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>All Variations ({results.length})</CardTitle>
                <CardDescription>
                  Click any image to view full size and access download options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.map((artwork, index) => (
                    <div
                      key={artwork.id}
                      className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border hover:border-primary/50 transition-colors"
                      onClick={() => setSelectedImage(artwork)}
                    >
                      <Image 
                        src={artwork.url}
                        alt={`Variation ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <Button size="sm" variant="secondary" className="text-xs">
                            <Maximize2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Badge className="absolute top-2 left-2 text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((artwork, index) => (
            <Card key={artwork.id} className="group overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-[4/3]">
                <Image 
                  src={artwork.url}
                  alt={`${artwork.style.name} artwork ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedImage(artwork)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownload(artwork)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Badge className="absolute top-2 left-2">
                  #{index + 1}
                </Badge>
                {isStylePremium(artwork.style) && (
                  <Crown className="absolute top-2 right-2 h-4 w-4 text-yellow-500" />
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{artwork.style.name}</h4>
                    <p className="text-sm text-muted-foreground">{artwork.style.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare(artwork)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleCreateProducts()}
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button size="lg" onClick={handleDownloadAll} className="gap-2">
          <Download className="h-5 w-5" />
          Download All ({results.length})
        </Button>
        
        <Button size="lg" variant="outline" className="gap-2">
          <ShoppingBag className="h-5 w-5" />
          Create Products
        </Button>
        
        <Button size="lg" variant="outline" className="gap-2">
          <Heart className="h-5 w-5" />
          Save to Favorites
        </Button>
        
        <Button size="lg" variant="outline" onClick={onRestart} className="gap-2">
          <RotateCcw className="h-5 w-5" />
          Generate More
        </Button>
      </div>

      {/* Generation Summary */}
      <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{results.length > 0 ? getStyleCredits() * results.length : 0}</div>
              <div className="text-sm text-muted-foreground">Credits Used</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{results.length}</div>
              <div className="text-sm text-muted-foreground">Artworks Created</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">~30s</div>
              <div className="text-sm text-muted-foreground">Generation Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                <Star className="h-5 w-5" />
                {results[0]?.style.name}
              </div>
              <div className="text-sm text-muted-foreground">Style Applied</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {selectedImage?.style.name} Artwork Preview
          </DialogTitle>
          {selectedImage && (
            <div className="space-y-4 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">{selectedImage.style.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedImage.style.category}</p>
                  </div>
                  {isStylePremium(selectedImage.style) && (
                    <Crown className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(selectedImage.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(selectedImage.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(selectedImage)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden">
                <Image 
                  src={selectedImage.url}
                  alt={`${selectedImage.style.name} artwork`}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain max-h-[60vh]"
                />
              </div>

              <div className="flex justify-center gap-3">
                <Button onClick={() => handleShare(selectedImage)} className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Artwork
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleCreateProducts()}
                  className="gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Create Products
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}