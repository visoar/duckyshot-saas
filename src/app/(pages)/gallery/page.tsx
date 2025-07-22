import React from "react";
import { createMetadata } from "@/lib/metadata";
import { PublicGallery } from "./_components/public-gallery";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import {
  Star,
  Heart,
  Image as Gallery,
  Globe,
  Users,
  Wand2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Public Gallery - Community Pet AI Art Collection",
  description:
    "Explore amazing AI-generated pet artworks shared by our community. Discover creative styles and get inspired for your next pet art creation.",
  keywords: [
    "public AI art gallery",
    "community pet art",
    "AI generated art showcase",
    "pet art inspiration",
    "digital art community",
  ],
});

export default function GalleryPage() {
  return (
    <section className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="bg-background relative overflow-hidden">
        <BackgroundPattern />

        <div className="relative px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="border-border bg-background/50 mb-6 inline-flex items-center rounded-full border px-4 py-2 text-sm backdrop-blur-sm">
                <Globe className="text-primary mr-2 h-4 w-4" />
                <span className="text-muted-foreground">
                  Community Art Gallery
                </span>
              </div>

              <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Public
                <span className="text-primary"> Art Gallery</span>
              </h1>

              <p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-xl leading-relaxed">
                Discover incredible AI-generated pet artworks shared by our
                creative community. Get inspired and see what&apos;s possible
                with AI art.
              </p>

              {/* Feature highlights */}
              <div className="text-muted-foreground mb-8 flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>Community showcase</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span>Public artworks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Featured creations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  <span>Community favorites</span>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/ai-studio">
                    <Wand2 className="mr-2 h-5 w-5" />
                    Create Your Own Art
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/artworks">
                    <Gallery className="mr-2 h-5 w-5" />
                    My Artworks
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
          <PublicGallery />
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-muted/20 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold">
              Join Our Creative Community
            </h2>
            <p className="text-muted-foreground text-lg">
              Share your AI-generated pet artworks and inspire others
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Wand2 className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Create Amazing Art
              </h3>
              <p className="text-muted-foreground">
                Use our AI tools to transform your pet photos into stunning
                artworks in various artistic styles.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Globe className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Share with the World
              </h3>
              <p className="text-muted-foreground">
                Make your artworks public to showcase your creativity and
                inspire others in the community.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Heart className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Get Inspired
              </h3>
              <p className="text-muted-foreground">
                Browse through community creations to discover new styles and
                techniques for your next artwork.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
