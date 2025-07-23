"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Download,
  Star,
  Maximize2,
  Plus,
  Crown,
  Palette,
  Sparkles,
  Camera,
  Trophy,
  Scissors,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import type { ArtworkResult } from "./ai-studio-workflow";
import { isStylePremium, getStyleCredits } from "@/lib/ai/utils";

interface SpectacularResultsShowcaseProps {
  results: ArtworkResult[];
  originalImage: { url: string; file: File };
  onRestart: () => void;
  onBack: () => void;
}

export function SpectacularResultsShowcase({
  results,
  // originalImage,
  onRestart,
  onBack,
}: SpectacularResultsShowcaseProps) {
  const [selectedImage, setSelectedImage] = useState<ArtworkResult | null>(
    null,
  );

  const handleDownload = async (
    artwork: ArtworkResult,
    format: "standard" | "high-res" | "print" = "standard",
  ) => {
    try {
      const downloadUrl = artwork.url;
      let fileName = `pet-masterpiece-${artwork.style.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

      // Determine file extension and quality based on format
      switch (format) {
        case "high-res":
          fileName += "-hd.jpg";
          break;
        case "print":
          fileName += "-print-ready.png";
          break;
        default:
          fileName += ".jpg";
      }

      const proxyUrl = `/api/download?url=${encodeURIComponent(downloadUrl)}&format=${format}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        `${format === "standard" ? "Artwork" : format === "high-res" ? "High-res artwork" : "Print-ready artwork"} downloaded successfully!`,
      );
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download artwork. Please try again.");
    }
  };

  const primaryResult = results[0];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Success Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-100 px-4 py-2 text-green-800">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-sm font-medium">Generation Complete</span>
        </div>
        <h2 className="from-primary via-primary/80 to-primary/60 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
          Your Artwork is Ready!
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Your pet has been transformed into a stunning{" "}
          <strong>{primaryResult?.style.name}</strong> masterpiece
        </p>
      </div>

      {/* Main Result Display - Left-Right Layout */}
      <Card className="-py-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid gap-0 md:grid-cols-2">
            {/* Left: Image */}
            <div className="from-muted/30 to-muted/10 relative flex min-h-[400px] items-center justify-center overflow-hidden bg-gradient-to-br md:min-h-[500px] md:rounded-l-lg">
              <div className="relative max-h-full max-w-full">
                <Image
                  src={primaryResult?.url || ""}
                  alt="AI Generated Artwork"
                  width={800}
                  height={800}
                  className="max-h-full max-w-full object-contain"
                  priority
                />
              </div>
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="border-0 bg-black/70 text-white"
                >
                  <Star className="mr-1 h-3 w-3" />
                  {primaryResult?.style.name}
                  {isStylePremium(primaryResult?.style) && (
                    <Crown className="ml-1 h-3 w-3 text-yellow-400" />
                  )}
                </Badge>
              </div>
            </div>

            {/* Right: Actions & Info */}
            <div className="flex flex-col justify-center space-y-6 p-8">
              {/* Style Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Sparkles className="text-primary h-4 w-4" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Your Masterpiece is Ready!
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Your pet has been transformed into a beautiful{" "}
                  <strong>{primaryResult?.style.name}</strong> artwork using
                  advanced AI technology.
                </p>
              </div>

              {/* Stats */}
              <div className="border-muted grid grid-cols-2 gap-4 border-y py-4">
                <div className="text-center">
                  <div className="text-muted-foreground text-xs">
                    {results.length} Artwork{results.length > 1 ? "s" : ""}{" "}
                    Created
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground text-xs">
                    {getStyleCredits() * results.length} Credit
                    {results.length > 1 ? "s" : ""} Used
                  </div>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={() => handleDownload(primaryResult)}
                  className="h-12 w-full gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Artwork
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setSelectedImage(primaryResult)}
                  className="w-full gap-2"
                >
                  <Maximize2 className="h-4 w-4" />
                  View Full Size
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="border-muted space-y-3 border-t pt-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onBack}
                  className="h-12 w-full gap-2"
                >
                  <Palette className="h-5 w-5" />
                  Try Different Styles
                </Button>

                <Button
                  variant="ghost"
                  onClick={onRestart}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Upload New Photo
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multiple Results Gallery */}
      {results.length > 1 && (
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h3 className="flex items-center justify-center gap-2 text-2xl font-semibold">
              <Camera className="text-primary h-6 w-6" />
              All Your Masterpieces
              <Badge variant="secondary" className="ml-2">
                {results.length}
              </Badge>
            </h3>
            <p className="text-muted-foreground">
              Click any artwork to view full-size and access more download
              options
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {results.map((artwork, index) => (
              <Card
                key={artwork.id}
                className="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                onClick={() => setSelectedImage(artwork)}
              >
                <div className="bg-muted/20 relative flex aspect-square items-center justify-center">
                  <Image
                    src={artwork.url}
                    alt={`${artwork.style.name} artwork ${index + 1}`}
                    width={300}
                    height={300}
                    className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute right-0 bottom-0 left-0 p-3">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 text-xs text-black"
                        >
                          #{index + 1}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 bg-white/90 p-0 hover:bg-white"
                          >
                            <Maximize2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(artwork);
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Celebration Message */}
      <div className="py-6 text-center">
        <div className="from-primary/10 to-primary/5 border-primary/20 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-6 py-3">
          <Trophy className="text-primary h-5 w-5" />
          <span className="text-primary font-medium">
            Congratulations! Your pet is now immortalized as art!
          </span>
          <Sparkles className="text-primary h-5 w-5" />
        </div>
      </div>

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
            <div className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="h-6 w-6" />
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedImage.style.name} Masterpiece
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedImage.style.category} • Created{" "}
                      {selectedImage.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  {isStylePremium(selectedImage.style) && (
                    <Crown className="h-6 w-6 text-yellow-500" />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(selectedImage, "high-res")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    HD Download
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg">
                <Image
                  src={selectedImage.url}
                  alt={`${selectedImage.style.name} artwork`}
                  width={1200}
                  height={900}
                  className="h-auto max-h-[60vh] w-full object-contain"
                />
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedImage, "standard")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Standard Quality
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedImage, "print")}
                >
                  <Scissors className="mr-2 h-4 w-4" />
                  Print Ready
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
