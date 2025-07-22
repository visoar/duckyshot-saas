import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Star,
  Users,
  Zap,
  Sparkles,
  Heart,
  Palette,
  Camera,
} from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-background relative flex items-center justify-center overflow-hidden">
      {/* Artistic Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,69,19,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,182,193,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Status Badge */}
            <div className="border-border bg-background/50 inline-flex items-center rounded-full border px-3 py-1 text-sm backdrop-blur-sm">
              <Heart className="mr-2 h-3 w-3 fill-current text-pink-500" />
              <span className="text-muted-foreground">
                Loved by 25,000+ pet parents worldwide
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Transform Pet Into
                <span className="text-primary block">Magical AI Artwork</span>
              </h1>

              <p className="text-muted-foreground max-w-lg text-xl leading-relaxed">
                Upload your pet&apos;s photo and watch our AI transform it into
                stunning artwork in 10+ artistic styles. Then create custom
                merchandise to treasure forever.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="text-muted-foreground flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-500" />
                <span>10+ Art Styles</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <Camera className="h-4 w-4 text-emerald-500" />
                <span>High Quality Results</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Generated in Seconds</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group h-12 px-8 text-base font-medium"
                asChild
              >
                <Link href="/dashboard/ai-studio">
                  Start Creating Art
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group border-border hover:bg-accent h-12 px-8 text-base font-medium"
                asChild
              >
                <Link href="#gallery">
                  <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  View Examples
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.9/5</span>
                <span className="text-xs">(2,500+ reviews)</span>
              </div>
              <div className="bg-border h-4 w-px" />
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>50,000+ artworks created</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative lg:order-last">
            <div className="relative mx-auto max-w-lg">
              {/* AI Art Studio Preview */}
              <div className="border-border bg-background/50 relative mr-6 rounded-xl border p-6 shadow-xl backdrop-blur-sm">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                        <Palette className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">AI Art Studio</div>
                        <div className="text-muted-foreground text-xs">
                          Create magical pet art
                        </div>
                      </div>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/20">
                      <Heart className="h-4 w-4 fill-current text-pink-500" />
                    </div>
                  </div>

                  {/* Before/After Demo */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border-border/50 rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50 p-3 dark:from-blue-950/50 dark:to-purple-950/50">
                      <div className="mb-2 text-center text-xs font-medium">
                        Original Photo
                      </div>
                      <div className="flex aspect-square items-center justify-center rounded bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30">
                        <Camera className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <div className="border-border/50 rounded-lg border bg-gradient-to-br from-emerald-50 to-teal-50 p-3 dark:from-emerald-950/50 dark:to-teal-950/50">
                      <div className="mb-2 text-center text-xs font-medium">
                        AI Artwork
                      </div>
                      <div className="flex aspect-square items-center justify-center rounded bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/30 dark:to-pink-900/30">
                        <Sparkles className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div className="border-border/50 bg-background/30 rounded-lg border p-3">
                    <div className="mb-2 text-xs font-medium">Art Styles</div>
                    <div className="flex gap-2">
                      {["Oil", "Cartoon", "Anime", "Van Gogh"].map(
                        (style, i) => (
                          <div
                            key={i}
                            className={`rounded px-2 py-1 text-xs ${i === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                          >
                            {style}
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Generation Progress */}
                  <div className="border-border/50 bg-background/30 rounded-lg border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-xs font-medium">Generating...</div>
                      <div className="text-xs text-emerald-600">85%</div>
                    </div>
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                        style={{ width: "85%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="border-border bg-background absolute -top-4 right-0 rounded-lg border p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium">AI Working</span>
                </div>
              </div>

              <div className="border-border bg-background absolute -bottom-4 -left-4 rounded-lg border p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs font-medium">30s Generation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
