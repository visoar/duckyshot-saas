import React from "react";
import { createMetadata } from "@/lib/metadata";
import { AIStudioWorkflow } from "./_components/ai-studio-workflow";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import {
  Sparkles,
  Wand2,
  Star,
  Heart,
  Zap,
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
      {/* Main Studio Section */}
      <div className="bg-background/50 relative flex-1">
        <div className="mx-auto max-w-6xl px-4 py-16">
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
