"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationDialog } from "@/components/artworks/delete-confirmation-dialog";
import {
  ArrowLeft,
  Download,
  Share2,
  Calendar,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Globe,
  Lock,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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

interface ArtworkDetailProps {
  artworkId: string;
}

export function ArtworkDetail({ artworkId }: ArtworkDetailProps) {
  const router = useRouter();
  const [artwork, setArtwork] = useState<AIArtwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Load artwork data
  useEffect(() => {
    async function loadArtwork() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/ai/artworks/${artworkId}`);

        if (response.status === 404) {
          router.push("/404");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load artwork");
        }

        const data = await response.json();
        setArtwork(data.artwork);
      } catch (error) {
        console.error("Failed to load artwork:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load artwork",
        );
      } finally {
        setLoading(false);
      }
    }

    loadArtwork();
  }, [artworkId, router]);

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `duckyshot-artwork-${artworkId}-${selectedImageIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDelete = async () => {
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

      router.push("/artworks");
    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete artwork");
    }
  };

  const handleTogglePublic = async () => {
    if (!artwork) return;

    try {
      const response = await fetch("/api/ai/artworks/privacy", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artworkId,
          isPublic: !artwork.isPublic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update privacy settings");
      }

      setArtwork((prev) =>
        prev
          ? {
              ...prev,
              isPublic: !prev.isPublic,
              sharedAt: !prev.isPublic ? new Date().toISOString() : undefined,
            }
          : null,
      );
    } catch (error) {
      console.error("Privacy update failed:", error);
      setError("Failed to update privacy settings");
    }
  };

  const handleShare = async () => {
    if (!artwork) return;

    try {
      await navigator.share({
        title: artwork.title || "AI Artwork",
        text: artwork.description || "Check out this amazing AI artwork!",
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch {
        console.error("Share failed:", error);
      }
    }
  };

  const getStatusBadge = (status: AIArtwork["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-emerald-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="secondary">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="bg-muted h-8 w-32 animate-pulse rounded" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-muted aspect-square animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="bg-muted h-8 animate-pulse rounded" />
              <div className="bg-muted h-4 animate-pulse rounded" />
              <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <XCircle className="text-destructive mx-auto h-12 w-12" />
            <div>
              <h3 className="text-lg font-semibold">Error loading artwork</h3>
              <p className="text-muted-foreground">
                {error || "Artwork not found"}
              </p>
            </div>
            <Button asChild>
              <Link href="/artworks">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Artworks
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link href="/artworks">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Artworks
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {artwork.status === "completed" && artwork.generatedImages && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      handleDownload(
                        artwork.generatedImages![selectedImageIndex],
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleTogglePublic}>
                    {artwork.isPublic ? (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Make Private
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-4 w-4" />
                        Make Public
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DeleteConfirmationDialog
                onConfirm={handleDelete}
                trigger={
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive cursor-pointer"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Artwork
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Display */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="bg-muted relative aspect-square">
                {artwork.status === "completed" &&
                artwork.generatedImages &&
                artwork.generatedImages.length > 0 ? (
                  <img
                    src={artwork.generatedImages[selectedImageIndex]}
                    alt={
                      artwork.title || `${artwork.style?.name || "AI"} artwork`
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    {artwork.status === "processing" ? (
                      <Loader2 className="text-muted-foreground h-12 w-12 animate-spin" />
                    ) : artwork.status === "failed" ? (
                      <XCircle className="text-destructive h-12 w-12" />
                    ) : (
                      <Clock className="text-muted-foreground h-12 w-12" />
                    )}
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  {getStatusBadge(artwork.status)}
                </div>

                {/* Privacy Badge */}
                <div className="absolute top-4 right-4">
                  {artwork.isPublic ? (
                    <Badge
                      variant="secondary"
                      className="bg-blue-500/80 text-white"
                    >
                      <Globe className="mr-1 h-3 w-3" />
                      Public
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-black/50 text-white"
                    >
                      <Lock className="mr-1 h-3 w-3" />
                      Private
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Image Thumbnails */}
            {artwork.generatedImages && artwork.generatedImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {artwork.generatedImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "aspect-square overflow-hidden rounded-lg border-2",
                      selectedImageIndex === index
                        ? "border-primary"
                        : "hover:border-muted-foreground/50 border-transparent",
                    )}
                  >
                    <img
                      src={image}
                      alt={`Artwork variant ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Artwork Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">
                {artwork.title || artwork.style?.name || "AI Artwork"}
              </h1>
              {artwork.description && (
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {artwork.description}
                </p>
              )}
            </div>

            {/* Artwork Details */}
            <Card>
              <CardContent className="space-y-4 p-6">
                <h3 className="mb-4 text-lg font-semibold">Artwork Details</h3>

                <div className="space-y-3">
                  {artwork.style && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Style</span>
                      <Badge variant="outline" className="capitalize">
                        {artwork.style.name}
                      </Badge>
                    </div>
                  )}

                  {artwork.style?.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="outline" className="capitalize">
                        {artwork.style.category}
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    {getStatusBadge(artwork.status)}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Privacy</span>
                    <span className="text-sm">
                      {artwork.isPublic ? "Public" : "Private"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Credits Used</span>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-sm">{artwork.creditsUsed}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-sm">
                        {formatDate(artwork.createdAt)}
                      </span>
                    </div>
                  </div>

                  {artwork.completedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Completed</span>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span className="text-sm">
                          {formatDate(artwork.completedAt)}
                        </span>
                      </div>
                    </div>
                  )}

                  {artwork.sharedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shared</span>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span className="text-sm">
                          {formatDate(artwork.sharedAt)}
                        </span>
                      </div>
                    </div>
                  )}

                  {artwork.generatedImages && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Images Generated
                      </span>
                      <span className="text-sm">
                        {artwork.generatedImages.length}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Original Image */}
            {artwork.originalImage && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Original Image</h3>
                  <div className="bg-muted relative aspect-video overflow-hidden rounded-lg">
                    <img
                      src={artwork.originalImage.url}
                      alt="Original uploaded image"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {artwork.originalImage.fileName}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
