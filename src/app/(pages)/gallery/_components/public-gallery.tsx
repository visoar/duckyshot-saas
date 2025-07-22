"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Sparkles,
  XCircle,
  ImageIcon,
  Filter,
  TrendingUp,
  Clock,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { WaterfallGallery } from "@/components/artworks/waterfall-gallery";

interface AIArtwork {
  id: string;
  title?: string;
  description?: string;
  originalImage?: {
    url: string;
    fileName: string;
  };
  generatedImages: string[] | null;
  style?: {
    id: string;
    name: string;
    category: string;
  };
  status: "pending" | "processing" | "completed" | "failed";
  creditsUsed: number;
  isPublic: boolean;
  isPrivate: boolean;
  sharedAt?: string;
  createdAt: string;
  completedAt?: string;
  user?: {
    id: string;
    name: string;
    image?: string;
  };
}

export function PublicGallery() {
  const [artworks, setArtworks] = useState<AIArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [styleFilter, setStyleFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Load public artworks from API
  useEffect(() => {
    async function loadPublicArtworks() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: "1",
          limit: "50",
          public_only: "true",
          sort: sortBy,
        });

        if (styleFilter !== "all") {
          params.append("style", styleFilter);
        }

        const response = await fetch(
          `/api/ai/artworks/public?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load public artworks");
        }

        const data = await response.json();
        setArtworks(data.artworks || []);
      } catch (error) {
        console.error("Failed to load public artworks:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load public artworks",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPublicArtworks();
  }, [styleFilter, sortBy]);

  // Filter artworks by search query
  const filteredArtworks = artworks.filter((artwork) => {
    if (!searchQuery) return true;

    const title = artwork.title || "";
    const description = artwork.description || "";
    const styleName = artwork.style?.name || "";
    const styleCategory = artwork.style?.category || "";
    const userName = artwork.user?.name || "";

    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      styleCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDownload = async (imageUrl: string, artworkId: string) => {
    try {
      // Use proxy API route to avoid CORS issues
      const proxyUrl = `/api/download?url=${encodeURIComponent(imageUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `public-artwork-${artworkId}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  const getStatsData = () => {
    const total = artworks.length;
    const styleCategories = [
      ...new Set(artworks.map((a) => a.style?.category).filter(Boolean)),
    ];
    const artists = [
      ...new Set(artworks.map((a) => a.user?.id).filter(Boolean)),
    ];

    return {
      total,
      styleCategories: styleCategories.length,
      artists: artists.length,
    };
  };

  const stats = getStatsData();

  if (error) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <XCircle className="text-destructive mx-auto h-12 w-12" />
          <div>
            <h3 className="text-lg font-semibold">Error loading gallery</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      {artworks.length > 0 && (
        <div className="grid grid-cols-3 gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-primary text-2xl font-bold">
                {stats.total}
              </div>
              <div className="text-muted-foreground text-sm">
                Public Artworks
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {stats.styleCategories}
              </div>
              <div className="text-muted-foreground text-sm">Art Styles</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {stats.artists}
              </div>
              <div className="text-muted-foreground text-sm">Artists</div>
            </div>
          </Card>
        </div>
      )}

      {/* Header Actions */}
      <Card className="p-6">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search artworks, styles, or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10"
              />
            </div>

            <Select value={styleFilter} onValueChange={setStyleFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="abstract">Abstract</SelectItem>
                <SelectItem value="cartoon">Cartoon</SelectItem>
                <SelectItem value="realistic">Realistic</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Newest
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Popular
                  </div>
                </SelectItem>
                <SelectItem value="trending">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Trending
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/ai-studio">
                <Sparkles className="mr-2 h-4 w-4" />
                Create Art
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {filteredArtworks.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <ImageIcon className="text-primary h-8 w-8" />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold">
                No public artworks found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || styleFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Be the first to share your AI artwork with the community!"}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/ai-studio">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Your First Artwork
                </Link>
              </Button>
              {(searchQuery || styleFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStyleFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Artworks Display */}
      {filteredArtworks.length > 0 && (
        <WaterfallGallery
          artworks={filteredArtworks}
          loading={loading}
          showUser={true}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
