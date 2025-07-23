"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
  const [selectedImage, setSelectedImage] = useState<ArtworkResult | null>(null);

  const handleDownload = async (artwork: ArtworkResult, format: 'standard' | 'high-res' | 'print' = 'standard') => {
    try {
      const downloadUrl = artwork.url;
      let fileName = `pet-masterpiece-${artwork.style.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
      
      // Determine file extension and quality based on format
      switch (format) {
        case 'high-res':
          fileName += '-hd.jpg';
          break;
        case 'print':
          fileName += '-print-ready.png';
          break;
        default:
          fileName += '.jpg';
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
      
      toast.success(`${format === 'standard' ? 'Artwork' : format === 'high-res' ? 'High-res artwork' : 'Print-ready artwork'} downloaded successfully!`);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download artwork. Please try again.");
    }
  };


  const primaryResult = results[0];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 border border-green-200">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Generation Complete</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Your Artwork is Ready!
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your pet has been transformed into a stunning <strong>{primaryResult?.style.name}</strong> masterpiece
        </p>
      </div>

      {/* Main Result Display - Left-Right Layout */}
      <Card className="-py-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: Image */}
            <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center min-h-[400px] md:min-h-[500px] md:rounded-l-lg overflow-hidden">
              <div className="relative max-w-full max-h-full">
                <Image
                  src={primaryResult?.url || ''}
                  alt="AI Generated Artwork"
                  width={800}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                  priority
                />
              </div>
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-black/70 text-white border-0">
                  <Star className="w-3 h-3 mr-1" />
                  {primaryResult?.style.name}
                  {isStylePremium(primaryResult?.style) && (
                    <Crown className="h-3 w-3 text-yellow-400 ml-1" />
                  )}
                </Badge>
              </div>
            </div>

            {/* Right: Actions & Info */}
            <div className="p-8 flex flex-col justify-center space-y-6">
              {/* Style Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Your Masterpiece is Ready!</h3>
                </div>
                <p className="text-muted-foreground">
                  Your pet has been transformed into a beautiful <strong>{primaryResult?.style.name}</strong> artwork using advanced AI technology.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-muted">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">{results.length} Artwork{results.length > 1 ? 's' : ''} Created</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">{getStyleCredits() * results.length} Credit{results.length > 1 ? 's' : ''} Used</div>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={() => handleDownload(primaryResult)}
                  className="w-full gap-2 h-12"
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
              <div className="space-y-3 pt-4 border-t border-muted">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onBack}
                  className="w-full gap-2 h-12"
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
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold flex items-center justify-center gap-2">
              <Camera className="h-6 w-6 text-primary" />
              All Your Masterpieces
              <Badge variant="secondary" className="ml-2">{results.length}</Badge>
            </h3>
            <p className="text-muted-foreground">
              Click any artwork to view full-size and access more download options
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((artwork, index) => (
              <Card
                key={artwork.id}
                className="group relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden"
                onClick={() => setSelectedImage(artwork)}
              >
                <div className="aspect-square relative bg-muted/20 flex items-center justify-center">
                  <Image
                    src={artwork.url}
                    alt={`${artwork.style.name} artwork ${index + 1}`}
                    width={300}
                    height={300}
                    className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs bg-white/90 text-black">
                          #{index + 1}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                            <Maximize2 className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
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
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <Trophy className="h-5 w-5 text-primary" />
          <span className="text-primary font-medium">Congratulations! Your pet is now immortalized as art!</span>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Image Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
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
                      {selectedImage.style.category} • Created {selectedImage.createdAt.toLocaleDateString()}
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
                    onClick={() => handleDownload(selectedImage, 'high-res')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    HD Download
                  </Button>
                </div>
              </div>

              <div className="rounded-lg overflow-hidden">
                <Image
                  src={selectedImage.url}
                  alt={`${selectedImage.style.name} artwork`}
                  width={1200}
                  height={900}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedImage, 'standard')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Standard Quality
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedImage, 'print')}
                >
                  <Scissors className="h-4 w-4 mr-2" />
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