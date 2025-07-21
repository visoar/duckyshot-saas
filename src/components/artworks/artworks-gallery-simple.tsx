"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Grid3X3,
  List,
  Download,
  Trash2,
  Calendar,
  Plus,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";

interface AIArtwork {
  id: string;
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
  createdAt: string;
  completedAt?: string;
}


export function ArtworksGallery() {
  const [artworks, setArtworks] = useState<AIArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Load artworks from API
  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          page: "1",
          limit: "20",
        });
        
        if (statusFilter !== "all") {
          params.append("status", statusFilter);
        }

        const response = await fetch(`/api/ai/artworks?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to load artworks");
        }

        const data = await response.json();
        setArtworks(data.artworks || []);
      } catch (error) {
        console.error("Failed to load artworks:", error);
        setError(error instanceof Error ? error.message : "Failed to load artworks");
      } finally {
        setLoading(false);
      }
    }

    loadArtworks();
  }, [statusFilter]);

  // Filter artworks by search query
  const filteredArtworks = artworks.filter(artwork => {
    if (!searchQuery) return true;
    
    const styleName = artwork.style?.name || "";
    const styleCategory = artwork.style?.category || "";
    
    return styleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           styleCategory.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDownload = async (imageUrl: string, artworkId: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
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

      setArtworks(prev => prev.filter(artwork => artwork.id !== artworkId));
    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete artwork");
    }
  };

  const getStatusBadge = (status: AIArtwork["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-emerald-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "processing":
        return <Badge variant="secondary"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Processing</Badge>;
      case "pending":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden -py-6">
              <div className="aspect-square bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <XCircle className="mx-auto h-12 w-12 text-destructive" />
          <div>
            <h3 className="text-lg font-semibold">Error loading artworks</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
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
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          
          <Button asChild>
            <Link href="/dashboard/ai-studio">
              <Plus className="h-4 w-4 mr-2" />
              Create New Art
            </Link>
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {filteredArtworks.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No artworks found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Start creating your first AI artwork!"}
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/ai-studio">
                <Sparkles className="h-4 w-4 mr-2" />
                Create Your First Artwork
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Artworks Grid */}
      {filteredArtworks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
            <Card key={artwork.id} className="group overflow-hidden -py-6 -gap-6">
              {/* Image */}
              <div className="aspect-square relative bg-muted">
                {artwork.status === "completed" && artwork.generatedImages && artwork.generatedImages.length > 0 ? (
                  <img
                    src={artwork.generatedImages[0]}
                    alt={`${artwork.style?.name || 'AI'} artwork`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {artwork.status === "processing" ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : artwork.status === "failed" ? (
                      <XCircle className="h-8 w-8 text-destructive" />
                    ) : (
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                )}

                <div className="absolute top-2 left-2">
                  {getStatusBadge(artwork.status)}
                </div>

                {artwork.generatedImages && artwork.generatedImages.length > 1 && (
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      +{artwork.generatedImages.length - 1} more
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{artwork.style?.name || 'AI Art'}</h3>
                    <Badge variant="outline" className="text-xs capitalize">
                      {artwork.style?.category || 'unknown'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(artwork.createdAt)}
                    </div>
                    {artwork.creditsUsed > 0 && (
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {artwork.creditsUsed} credits
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {artwork.status === "completed" && artwork.generatedImages && artwork.generatedImages.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(artwork.generatedImages![0], artwork.id)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(artwork.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}