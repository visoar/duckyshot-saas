import React from "react";
import { createMetadata } from "@/lib/metadata";
import { AIStudioWorkflow } from "./_components/ai-studio-workflow";
import { Sparkles, Upload, Palette } from "lucide-react";

export const metadata = createMetadata({
  title: "AI Art Studio - Transform Your Pet Photos",
  description:
    "Transform your pet photos into stunning AI artwork with multiple artistic styles. Professional quality results in seconds.",
  keywords: [
    "AI art",
    "pet photos",
    "artificial intelligence",
    "photo transformation",
    "digital art",
  ],
});

export default function AIStudioPage() {
  return (
    <section className="flex min-h-screen flex-col">
      {/* Clean header section */}
      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="bg-muted mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
            <Sparkles className="text-primary h-4 w-4" />
            <span className="text-sm font-medium">AI Art Studio</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Transform Pet Into Magical Artwork
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Upload your pet&apos;s photo and create stunning artwork in 50+
            artistic styles.
          </p>
        </div>
      </div>

      {/* Main Studio Section */}
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <AIStudioWorkflow />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold">How It Works</h2>
            <p className="text-muted-foreground">
              Three simple steps to create amazing pet art
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Upload className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">1. Upload Photo</h3>
              <p className="text-muted-foreground text-sm">
                Upload a clear photo of your pet for best results.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Palette className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">2. Choose Style</h3>
              <p className="text-muted-foreground text-sm">
                Select from 50+ artistic styles and generate instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <Sparkles className="text-primary h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">3. Get Your Art</h3>
              <p className="text-muted-foreground text-sm">
                Download your artwork or order custom products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
