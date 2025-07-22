import React from "react";
import { createMetadata } from "@/lib/metadata";
import { AIStudioWorkflow } from "./_components/ai-studio-workflow";
import {
  Sparkles,
  Upload,
  Palette,
} from "lucide-react";

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
      {/* Header Section */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="bg-primary/10 inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6">
            <Sparkles className="text-primary h-4 w-4" />
            <span className="text-sm font-medium">AI Art Studio</span>
          </div>
          <h1 className="from-primary via-primary/80 to-primary/60 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-5xl mb-6">
            Transform Pet Into Magical Artwork
          </h1>
          <p className="text-muted-foreground text-xl mb-8">
            Upload your pet&apos;s photo and watch our AI create stunning artwork in 10+ artistic styles.
          </p>
        </div>
      </div>

      {/* Main Studio Section */}
      <div className="bg-background/50 relative flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <AIStudioWorkflow />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-muted/20 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to create amazing pet art
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Upload className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                1. Upload Photo
              </h3>
              <p className="text-muted-foreground">
                Upload a clear photo of your pet. The better the photo, the
                better the result.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Palette className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                2. Choose Style
              </h3>
              <p className="text-muted-foreground">
                Select from various artistic styles - from oil painting to
                digital art.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Sparkles className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                3. Get Your Art
              </h3>
              <p className="text-muted-foreground">
                Watch as AI transforms your pet into stunning artwork in
                seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
