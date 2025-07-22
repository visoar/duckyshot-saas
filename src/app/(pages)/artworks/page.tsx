import React from "react";
import { createMetadata } from "@/lib/metadata";
import { MyArtworksGallery } from "./_components/my-artworks-gallery";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import {
  Star,
  Heart,
  Image as Gallery,
  Palette,
  Download,
  Wand2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = createMetadata({
  title: "My AI Artworks - Personal Pet Art Collection",
  description:
    "View, download, and manage all your AI-generated pet artworks. Control privacy settings and share your beautiful creations.",
  keywords: [
    "my AI artwork gallery",
    "personal pet art collection",
    "digital art management",
    "AI generated art",
    "private artwork collection",
  ],
});

export default function ArtworksPage() {
  return (
    <section className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="bg-background relative overflow-hidden">
        <BackgroundPattern />

        <div className="relative px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="border-border bg-background/50 mb-6 inline-flex items-center rounded-full border px-4 py-2 text-sm backdrop-blur-sm">
                <Gallery className="text-primary mr-2 h-4 w-4" />
                <span className="text-muted-foreground">
                  Your Personal Art Gallery
                </span>
              </div>

              <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                My
                <span className="text-primary"> AI Artworks</span>
              </h1>

              <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-xl leading-relaxed">
                Manage your personal collection of AI-generated pet artworks.
                Control privacy settings and share your favorites with the
                world.
              </p>

              {/* Feature highlights */}
              <div className="text-muted-foreground mb-8 flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  <span>Personal collection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-orange-500" />
                  <span>Privacy controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-blue-500" />
                  <span>High-quality downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-purple-500" />
                  <span>Multiple styles</span>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/ai-studio">
                    <Wand2 className="mr-2 h-5 w-5" />
                    Create New Artwork
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/gallery">
                    <Gallery className="mr-2 h-5 w-5" />
                    Explore Public Gallery
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Gallery Section */}
      <div className="bg-background/50 relative flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <MyArtworksGallery />
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-muted/20 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold">
              Make the Most of Your Artworks
            </h2>
            <p className="text-muted-foreground text-lg">
              Tips to get the best from your AI-generated pet art
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Download className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                High-Quality Downloads
              </h3>
              <p className="text-muted-foreground">
                Download your artworks in full resolution for printing or
                sharing on social media.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Star className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Organize by Style
              </h3>
              <p className="text-muted-foreground">
                Use filters to organize your collection by art style, creation
                date, or status.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Heart className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Share Your Art
              </h3>
              <p className="text-muted-foreground">
                Share your beautiful pet artworks with friends and family to
                spread the joy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
