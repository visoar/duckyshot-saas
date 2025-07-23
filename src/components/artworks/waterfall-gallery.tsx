"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationDialog } from "@/components/artworks/delete-confirmation-dialog";
import {
  Download,
  Trash2,
  Calendar,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Share2,
  User,
  Globe,
  Lock,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

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

interface WaterfallGalleryProps {
  artworks: AIArtwork[];
  loading?: boolean;
  showUser?: boolean; // For public gallery
  onDownload?: (imageUrl: string, artworkId: string) => void;
  onDelete?: (artworkId: string) => void;
  onShare?: (artwork: AIArtwork) => void;
  onTogglePublic?: (artworkId: string, isPublic: boolean) => void;
  className?: string;
}

export function WaterfallGallery({
  artworks,
  loading = false,
  showUser = false,
  onDownload,
  onDelete,
  onShare,
  onTogglePublic,
  className,
}: WaterfallGalleryProps) {
  const [imageHeights, setImageHeights] = useState<Record<string, number>>({});
  const [columns, setColumns] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate optimal column count based on container width
  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      if (width < 640)
        setColumns(1); // sm breakpoint
      else if (width < 768)
        setColumns(2); // md breakpoint
      else if (width < 1024)
        setColumns(3); // lg breakpoint
      else if (width < 1280)
        setColumns(4); // xl breakpoint
      else setColumns(5); // 2xl+
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Load image and calculate its display height
  const loadImage = (src: string, artworkId: string) => {
    const img = new Image();
    img.onload = () => {
      // Calculate height for 280px width (card width minus padding)
      const aspectRatio = img.height / img.width;
      const displayHeight = 280 * aspectRatio;
      setImageHeights((prev) => ({
        ...prev,
        [artworkId]: Math.min(displayHeight, 400), // Cap max height
      }));
    };
    img.src = src;
  };

  // Load images when artworks change
  useEffect(() => {
    artworks.forEach((artwork) => {
      if (
        artwork.status === "completed" &&
        artwork.generatedImages?.[0] &&
        !imageHeights[artwork.id]
      ) {
        loadImage(artwork.generatedImages[0], artwork.id);
      }
    });
  }, [artworks, imageHeights]);

  // Distribute artworks across columns for waterfall layout
  const getColumnItems = () => {
    const columnArrays: AIArtwork[][] = Array.from(
      { length: columns },
      () => [],
    );
    const columnHeights = Array(columns).fill(0);

    artworks.forEach((artwork) => {
      // Find column with minimum height
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights),
      );
      columnArrays[shortestColumnIndex].push(artwork);

      // Add estimated height to column
      const estimatedHeight = imageHeights[artwork.id] || 200;
      columnHeights[shortestColumnIndex] += estimatedHeight + 200; // Card content height
    });

    return columnArrays;
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
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={cn("space-y-6", className)} ref={containerRef}>
        <div
          className="grid w-full gap-4 overflow-x-hidden"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="bg-muted aspect-[4/5] animate-pulse" />
                  <CardContent>
                    <div className="space-y-2">
                      <div className="bg-muted h-4 animate-pulse rounded" />
                      <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const columnItems = getColumnItems();

  return (
    <div className={cn("space-y-6", className)} ref={containerRef}>
      <div
        className="grid w-full gap-4 overflow-x-hidden pb-6"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {columnItems.map((columnArtworks, colIndex) => (
          <div key={colIndex} className="space-y-4">
            {columnArtworks.map((artwork) => (
              <Card
                key={artwork.id}
                className="group   overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                {/* Image */}
                <div
                  className="bg-muted relative"
                  style={{
                    height: imageHeights[artwork.id] || 200,
                  }}
                >
                  {artwork.status === "completed" &&
                  artwork.generatedImages &&
                  artwork.generatedImages.length > 0 ? (
                    <img
                      src={artwork.generatedImages[0]}
                      alt={
                        artwork.title ||
                        `${artwork.style?.name || "AI"} artwork`
                      }
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      {artwork.status === "processing" ? (
                        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                      ) : artwork.status === "failed" ? (
                        <XCircle className="text-destructive h-8 w-8" />
                      ) : (
                        <Clock className="text-muted-foreground h-8 w-8" />
                      )}
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-2 left-2">
                    {getStatusBadge(artwork.status)}
                  </div>

                  {/* Privacy indicator */}
                  <div className="absolute top-2 right-2">
                    {!showUser &&
                      (artwork.isPublic ? (
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
                      ))}
                    {showUser && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-500/80 text-white"
                      >
                        <Globe className="mr-1 h-3 w-3" />
                        Public
                      </Badge>
                    )}
                  </div>

                  {/* Multiple images indicator */}
                  {artwork.generatedImages &&
                    artwork.generatedImages.length > 1 && (
                      <div className="absolute right-2 bottom-2">
                        <Badge
                          variant="secondary"
                          className="bg-black/50 text-xs text-white"
                        >
                          +{artwork.generatedImages.length - 1} more
                        </Badge>
                      </div>
                    )}
                </div>

                {/* Content */}
                <CardContent>
                  <div className="space-y-3">
                    {/* Title and description */}
                    <div>
                      <h3 className="line-clamp-2 flex justify-between text-lg font-semibold">
                        {artwork.title || artwork.style?.name || "AI Art"}
                        {/* Style category */}
                        <Badge
                          variant="outline"
                          className="w-fit text-xs capitalize"
                        >
                          {artwork.style?.category || "unknown"}
                        </Badge>
                      </h3>
                      {artwork.description && (
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                          {artwork.description}
                        </p>
                      )}
                    </div>

                    {/* User info (for public gallery) */}
                    {showUser && artwork.user && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          {artwork.user.image ? (
                            <img
                              src={artwork.user.image}
                              alt={artwork.user.name}
                              className="h-6 w-6 rounded-full"
                            />
                          ) : (
                            <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full">
                              <User className="h-3 w-3" />
                            </div>
                          )}
                          <span className="text-muted-foreground font-medium">
                            {artwork.user.name}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Meta info */}
                    <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(artwork.createdAt)}
                      </div>
                      {/* {artwork.creditsUsed > 0 && (
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {artwork.creditsUsed} credits
                        </div>
                      )} */}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {artwork.status === "completed" &&
                        artwork.generatedImages &&
                        artwork.generatedImages.length > 0 && (
                          <>
                            {onDownload && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  onDownload(
                                    artwork.generatedImages![0],
                                    artwork.id,
                                  )
                                }
                                className="flex-1"
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Download
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="flex-1"
                            >
                              <Link href={`/artworks/${artwork.id}`}>
                                <Eye className="mr-1 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                          </>
                        )}

                      {!showUser && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {artwork.status === "completed" &&
                              artwork.generatedImages && (
                                <>
                                  {onShare && (
                                    <DropdownMenuItem
                                      onClick={() => onShare(artwork)}
                                    >
                                      <Share2 className="mr-2 h-4 w-4" />
                                      Share
                                    </DropdownMenuItem>
                                  )}
                                  {onTogglePublic && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        onTogglePublic(
                                          artwork.id,
                                          !artwork.isPublic,
                                        )
                                      }
                                    >
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
                                  )}
                                  {(onShare || onTogglePublic) && (
                                    <DropdownMenuSeparator />
                                  )}
                                </>
                              )}
                            {onDelete && (
                              <DeleteConfirmationDialog
                                onConfirm={() => onDelete(artwork.id)}
                                trigger={
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive focus:text-destructive cursor-pointer"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                }
                              />
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
