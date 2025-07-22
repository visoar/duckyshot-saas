"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Download,
  ShoppingBag,
  RotateCcw,
  Heart,
  Star,
  Maximize2,
  Copy,
  ExternalLink,
  Plus,
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
  const [selectedImage, setSelectedImage] = useState<ArtworkResult | null>(
    null,
  );

  const handleDownload = async (artwork: ArtworkResult) => {
    try {
      // Use proxy API route to avoid CORS issues
      const proxyUrl = `/api/download?url=${encodeURIComponent(artwork.url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pet-artwork-${artwork.style.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Artwork downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download artwork. Please try again.");
    }
  };

  const handleDownloadAll = async () => {
    for (const artwork of results) {
      await handleDownload(artwork);
      // Small delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 500));
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
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Success Header */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 text-2xl">
          <span>🎉</span>
          <h2 className="from-primary to-primary/80 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
            Your Masterpiece is Ready!
          </h2>
          <span>🎨</span>
        </div>
        <p className="text-muted-foreground text-lg">
          Your pet has been transformed into beautiful {results[0]?.style.name}{" "}
          artwork
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div></div>
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
      <div className="space-y-6">
          {/* Before/After Comparison */}
          <Card className="p-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-muted-foreground font-semibold">
                    Original Photo
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {(originalImage.file.size / (1024 * 1024)).toFixed(1)} MB
                  </Badge>
                </div>
                <div className="aspect-[4/3] overflow-hidden rounded-xl border">
                  <Image
                    src={originalImage.url}
                    alt="Original pet photo"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-primary font-semibold">
                    AI Generated Art
                  </h3>
                  <div className="flex items-center gap-2">
                    {results[0] && isStylePremium(results[0].style) && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                    <Badge className="text-xs">{results[0]?.style.name}</Badge>
                  </div>
                </div>
                <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border">
                  <Image
                    src={results[0]?.url}
                    alt="AI generated artwork"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
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
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {results.map((artwork, index) => (
                    <div
                      key={artwork.id}
                      className="group hover:border-primary/50 relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg border transition-colors"
                      onClick={() => setSelectedImage(artwork)}
                    >
                      <Image
                        src={artwork.url}
                        alt={`Variation ${index + 1}`}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="text-xs"
                          >
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

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
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

        <Button
          size="lg"
          variant="outline"
          onClick={onRestart}
          className="gap-2"
        >
          <RotateCcw className="h-5 w-5" />
          Generate More
        </Button>
      </div>

      {/* Generation Summary */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:border-green-800 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:justify-center md:gap-8 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {results.length > 0 ? getStyleCredits() * results.length : 0}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">Credits Used</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {results.length}
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                Artworks Created
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">~30s</div>
              <div className="text-muted-foreground text-xs sm:text-sm">
                Generation Time
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-bold text-green-600">
                <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="truncate">{results[0]?.style.name}</span>
              </div>
              <div className="text-muted-foreground text-xs sm:text-sm">Style Applied</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-hidden p-0">
          <DialogTitle className="sr-only">
            {selectedImage?.style.name} Artwork Preview
          </DialogTitle>
          {selectedImage && (
            <div className="max-h-[90vh] space-y-4 overflow-y-auto p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">
                      {selectedImage.style.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {selectedImage.style.category}
                    </p>
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

              <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-lg">
                <Image
                  src={selectedImage.url}
                  alt={`${selectedImage.style.name} artwork`}
                  width={800}
                  height={600}
                  className="h-auto max-h-[60vh] w-full object-contain"
                />
              </div>

              <div className="flex justify-center gap-3">
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
