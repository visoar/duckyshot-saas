import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Upload,
  Palette,
  Heart,
  Sparkles,
  ArrowRight,
  Camera,
  Wand2,
  Gift,
  Clock,
  Star,
} from "lucide-react";
import Link from "next/link";

interface JourneyStep {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  emotion: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  time: string;
  experience: string;
  examples: string[];
}

const journeySteps: JourneyStep[] = [
  {
    step: 1,
    title: "Upload Photo",
    subtitle: "Any pet photo works",
    description: "Clear photo of your pet. That's it.",
    emotion: "Excitement & Anticipation",
    icon: Upload,
    color: "from-pink-500 to-rose-500",
    time: "Takes 30 seconds",
    experience: "Feel the joy of choosing their best moment",
    examples: [
      "The morning stretch photo",
      "That proud sitting pose",
      "Sleepy cuddle time",
      "Action shot mid-play",
    ],
  },
  {
    step: 2,
    title: "Pick Style",
    subtitle: "Choose from 50+ art styles",
    description:
      "Van Gogh, Anime, Oil Painting, Watercolor. Pick what you like.",
    emotion: "Wonder & Amazement",
    icon: Wand2,
    color: "from-purple-500 to-indigo-500",
    time: "30 seconds of magic",
    experience: "Experience the thrill of creation",
    examples: [
      "Van Gogh's swirling energy",
      "Watercolor's soft beauty",
      "Anime's playful charm",
      "Renaissance nobility",
    ],
  },
  {
    step: 3,
    title: "Get & Order Products",
    subtitle: "Digital art plus custom merchandise",
    description:
      "Download high-resolution files instantly. Order custom canvas prints, apparel, mugs, and more.",
    emotion: "Joy & Fulfillment",
    icon: Heart,
    color: "from-emerald-500 to-teal-500",
    time: "Instant download + fast shipping",
    experience: "Turn digital art into treasured keepsakes",
    examples: [
      "Canvas wall art",
      "Custom coffee mugs",
      "Personalized t-shirts",
      "Greeting cards & stickers",
    ],
  },
];

function JourneyStepCard({
  stepData,
  isActive,
}: {
  stepData: JourneyStep;
  isActive: boolean;
}) {
  const IconComponent = stepData.icon;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-500 ${
        isActive
          ? "ring-primary scale-105 shadow-xl ring-2"
          : "hover:scale-102 hover:shadow-lg"
      }`}
    >
      <div className="bg-primary/5 absolute inset-0" />

      <div className="relative space-y-4 p-4 sm:space-y-6 sm:p-6 lg:p-8">
        {/* Step Number & Icon */}
        <div className="flex items-center justify-between">
          <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl shadow-lg sm:h-14 sm:w-14 lg:h-16 lg:w-16">
            <IconComponent className="text-primary-foreground h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-xs font-medium">
              Step {stepData.step}
            </Badge>
            <div className="text-muted-foreground mt-1 text-xs">
              {stepData.time}
            </div>
          </div>
        </div>

        {/* Title & Emotion */}
        <div className="space-y-2">
          <h3 className="text-foreground text-xl font-bold sm:text-2xl">
            {stepData.title}
          </h3>
          <p className="text-muted-foreground text-base font-medium sm:text-lg">
            {stepData.subtitle}
          </p>
          <Badge variant="outline" className="text-xs">
            {stepData.emotion}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
          {stepData.description}
        </p>

        {/* Experience Highlight */}
        <div className="border-border bg-muted/10 rounded-lg border p-3 sm:p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="text-primary h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-foreground text-xs font-medium sm:text-sm">
              {stepData.experience}
            </span>
          </div>
          <div className="text-muted-foreground grid grid-cols-1 gap-1 text-xs sm:grid-cols-2 sm:gap-2">
            {stepData.examples.map((example, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="bg-primary/60 h-1 w-1 shrink-0 rounded-full" />
                <span className="line-clamp-1">{example}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SimpleJourney() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Clean Background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-muted/10 absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-4xl space-y-4 text-center sm:mb-16 sm:space-y-6 lg:mb-20">
          <div className="border-primary/20 bg-primary/5 inline-flex items-center rounded-full border px-3 py-1.5 sm:px-4 sm:py-2">
            <Clock className="text-primary mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-primary text-xs font-medium sm:text-sm">
              From Pet Photo to Custom Products in Minutes
            </span>
          </div>

          <h2 className="text-foreground text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Simple 3-Step Process to
            <span className="text-primary block">Custom Pet Products</span>
          </h2>

          <p className="text-muted-foreground mx-auto max-w-4xl text-base leading-relaxed sm:text-lg lg:text-xl">
            Upload your pet&apos;s photo, choose an AI art style, then download
            digital files or order custom merchandise. From canvas prints to
            mugs, we make it easy to celebrate your pet.
          </p>
        </div>

        {/* Journey Steps */}
        <div className="mb-12 grid gap-6 sm:mb-16 sm:gap-8 lg:mb-20 lg:grid-cols-3 lg:gap-12">
          {journeySteps.map((step, index) => (
            <JourneyStepCard
              key={step.step}
              stepData={step}
              isActive={index === 1} // Highlight middle step
            />
          ))}
        </div>

        {/* Success Stories Preview */}
        <div className="border-border bg-muted/10 mb-12 rounded-xl border p-6 sm:mb-16 sm:p-8">
          <div className="space-y-4 text-center sm:space-y-6">
            <div className="flex items-center justify-center gap-2">
              <Star className="fill-primary text-primary h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-foreground text-base font-semibold sm:text-lg">
                What Happens Next?
              </span>
              <Star className="fill-primary text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <div className="grid gap-6 text-center sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              <div className="space-y-2 sm:space-y-3">
                <div className="bg-primary/10 border-primary/20 mx-auto flex h-10 w-10 items-center justify-center rounded-full border sm:h-12 sm:w-12">
                  <Camera className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  &quot;I uploaded Luna&apos;s photo and couldn&apos;t believe
                  the Van Gogh result!&quot;
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="bg-primary/10 border-primary/20 mx-auto flex h-10 w-10 items-center justify-center rounded-full border sm:h-12 sm:w-12">
                  <Palette className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  &quot;The anime style made my Corgi look like a Studio Ghibli
                  character!&quot;
                </p>
              </div>

              <div className="space-y-2 sm:col-span-2 sm:space-y-3 lg:col-span-1">
                <div className="bg-primary/10 border-primary/20 mx-auto flex h-10 w-10 items-center justify-center rounded-full border sm:h-12 sm:w-12">
                  <Gift className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  &quot;Ordered prints for the whole family — best Christmas
                  gifts ever!&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-6 text-center sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-foreground text-2xl font-bold sm:text-3xl">
              Ready to try it?
            </h3>
            <p className="text-muted-foreground mx-auto max-w-2xl text-sm leading-relaxed sm:text-base">
              Takes 30 seconds. Try it free.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 h-12 px-6 text-base font-medium shadow-lg transition-all hover:shadow-xl sm:h-14 sm:px-8 sm:text-lg"
              asChild
            >
              <Link href="/ai-studio">
                <Upload className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sm:hidden">Start Now</span>
                <span className="hidden sm:inline">Start with Step 1</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="hover:bg-accent h-12 border-2 px-6 text-base font-medium sm:h-14 sm:px-8 sm:text-lg"
              asChild
            >
              <Link href="/gallery">
                <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sm:hidden">View Examples</span>
                <span className="hidden sm:inline">See Examples First</span>
              </Link>
            </Button>
          </div>

          <div className="text-muted-foreground flex flex-col items-center justify-center gap-4 text-xs sm:flex-row sm:gap-6 sm:text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>90 seconds total</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="text-primary h-3 w-3 fill-current sm:h-4 sm:w-4" />
              <span>Instant results</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>50+ art styles</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
