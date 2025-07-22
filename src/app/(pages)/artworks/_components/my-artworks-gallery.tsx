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
  Plus,
  Sparkles,
  XCircle,
  ImageIcon,
  Filter,
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
}

export function MyArtworksGallery() {
  const [artworks, setArtworks] = useState<AIArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [privacyFilter, setPrivacyFilter] = useState<string>("all");

  // Load artworks from API
  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: "1",
          limit: "50",
        });

        if (statusFilter !== "all") {
          params.append("status", statusFilter);
        }

        if (privacyFilter !== "all") {
          params.append("privacy", privacyFilter);
        }

        const response = await fetch(`/api/ai/artworks?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to load artworks");
        }

        const data = await response.json();
        setArtworks(data.artworks || []);
      } catch (error) {
        console.error("Failed to load artworks:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load artworks",
        );
      } finally {
        setLoading(false);
      }
    }

    loadArtworks();
  }, [statusFilter, privacyFilter]);

  // Filter artworks by search query
  const filteredArtworks = artworks.filter((artwork) => {
    if (!searchQuery) return true;

    const title = artwork.title || "";
    const description = artwork.description || "";
    const styleName = artwork.style?.name || "";
    const styleCategory = artwork.style?.category || "";

    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      styleCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDownload = async (imageUrl: string, artworkId: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `duckyshot-artwork-${artworkId}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDelete = async (artworkId: string) => {
    try {
      const response = await fetch("/api/ai/artworks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artworkIds: [artworkId],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete artwork");
      }

      setArtworks((prev) => prev.filter((artwork) => artwork.id !== artworkId));
    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete artwork");
    }
  };

  const handleTogglePublic = async (artworkId: string, isPublic: boolean) => {
    try {
      const response = await fetch("/api/ai/artworks/privacy", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artworkId,
          isPublic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update privacy settings");
      }

      setArtworks((prev) =>
        prev.map((artwork) =>
          artwork.id === artworkId
            ? {
                ...artwork,
                isPublic,
                sharedAt: isPublic ? new Date().toISOString() : undefined,
              }
            : artwork,
        ),
      );
    } catch (error) {
      console.error("Privacy update failed:", error);
      setError("Failed to update privacy settings");
    }
  };

  const getStatsData = () => {
    const total = artworks.length;
    const completed = artworks.filter((a) => a.status === "completed").length;
    const processing = artworks.filter((a) => a.status === "processing").length;
    const public_count = artworks.filter(
      (a) => a.isPublic && a.status === "completed",
    ).length;
    const private_count = artworks.filter(
      (a) => !a.isPublic && a.status === "completed",
    ).length;
    const totalCredits = artworks.reduce((sum, a) => sum + a.creditsUsed, 0);

    return {
      total,
      completed,
      processing,
      public_count,
      private_count,
      totalCredits,
    };
  };

  const stats = getStatsData();

  if (error) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <XCircle className="text-destructive mx-auto h-12 w-12" />
          <div>
            <h3 className="text-lg font-semibold">Error loading artworks</h3>
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-primary text-2xl font-bold">
                {stats.total}
              </div>
              <div className="text-muted-foreground text-sm">Total</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-500">
                {stats.completed}
              </div>
              <div className="text-muted-foreground text-sm">Completed</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {stats.processing}
              </div>
              <div className="text-muted-foreground text-sm">Processing</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {stats.public_count}
              </div>
              <div className="text-muted-foreground text-sm">Public</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">
                {stats.private_count}
              </div>
              <div className="text-muted-foreground text-sm">Private</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {stats.totalCredits}
              </div>
              <div className="text-muted-foreground text-sm">Credits</div>
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
                placeholder="Search artworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/ai-studio">
                <Plus className="mr-2 h-4 w-4" />
                Create New Art
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
              <h3 className="mb-2 text-xl font-semibold">No artworks found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ||
                statusFilter !== "all" ||
                privacyFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Ready to create your first AI masterpiece? Upload a photo and let the magic begin!"}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/ai-studio">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Your First Artwork
                </Link>
              </Button>
              {(searchQuery ||
                statusFilter !== "all" ||
                privacyFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setPrivacyFilter("all");
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
          showUser={false}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onTogglePublic={handleTogglePublic}
        />
      )}
    </div>
  );
}
