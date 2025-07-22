import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Camera,
  Palette,
  Heart,
  ShoppingBag,
  Download,
  ArrowRight,
  Wand2,
  Clock,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

const features: Feature[] = [
  {
    title: "AI Art Generation",
    description:
      "Transform your pet photos into stunning artwork using advanced AI. Choose from 10+ artistic styles including oil painting, watercolor, and cartoon.",
    icon: Wand2,
    category: "AI Technology",
  },
  {
    title: "Multiple Art Styles",
    description:
      "Express your pet's personality with diverse styles: classic art, modern designs, anime, cyberpunk, and seasonal themes.",
    icon: Palette,
    category: "Creative Options",
  },
  {
    title: "High-Quality Upload",
    description:
      "Upload photos up to 20MB with smart compression. Our AI works best with clear, well-lit photos of your beloved pets.",
    icon: Camera,
    category: "Photo Processing",
  },
  {
    title: "Custom Merchandise",
    description:
      "Turn your AI artwork into physical products: t-shirts, mugs, phone cases, canvas prints, and more. Perfect for gifts!",
    icon: ShoppingBag,
    category: "Products",
  },
  {
    title: "Instant Download",
    description:
      "Download high-resolution artwork immediately. Get watermark-free versions and share your pet's art with friends and family.",
    icon: Download,
    category: "Output",
  },
  {
    title: "Lightning Fast",
    description:
      "Generate beautiful artwork in under 30 seconds. Our optimized AI ensures quick turnaround without compromising quality.",
    icon: Clock,
    category: "Performance",
  },
];

function FeatureCard({ feature }: { feature: Feature; index: number }) {
  const IconComponent = feature.icon;

  return (
    <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-md">
      <div className="space-y-4">
        {/* Icon and Category */}
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 text-primary group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300">
            <IconComponent className="h-6 w-6" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {feature.category}
          </Badge>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-foreground text-lg font-semibold">
            {feature.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>

      {/* Hover Arrow */}
      <div className="absolute right-4 bottom-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
        <ArrowRight className="text-muted-foreground h-4 w-4" />
      </div>
    </Card>
  );
}

export function Features() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Heart className="mr-2 h-3 w-3 fill-current text-pink-500" />
            Made with Love for Pet Parents
          </Badge>

          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to create
            <span className="text-primary block">magical pet art</span>
          </h2>

          <p className="text-muted-foreground mt-6 text-lg">
            From photo upload to custom merchandise, our platform handles the
            entire journey of transforming your pet&apos;s photos into treasured
            artwork.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} index={0} /> // Removed unused index from map and passed 0 as index to FeatureCard
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-foreground text-2xl font-bold">10+</div>
            <div className="text-muted-foreground text-sm">Art Styles</div>
          </div>
          <div>
            <div className="text-foreground text-2xl font-bold">50K+</div>
            <div className="text-muted-foreground text-sm">
              Artworks Created
            </div>
          </div>
          <div>
            <div className="text-foreground text-2xl font-bold">30s</div>
            <div className="text-muted-foreground text-sm">Generation Time</div>
          </div>
        </div>
      </div>
    </section>
  );
}
