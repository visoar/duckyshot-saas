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
  Star
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
      "Action shot mid-play"
    ]
  },
  {
    step: 2,
    title: "Pick Style",
    subtitle: "Choose from 50+ art styles",
    description: "Van Gogh, Anime, Oil Painting, Watercolor. Pick what you like.",
    emotion: "Wonder & Amazement",
    icon: Wand2,
    color: "from-purple-500 to-indigo-500",
    time: "30 seconds of magic",
    experience: "Experience the thrill of creation",
    examples: [
      "Van Gogh's swirling energy",
      "Watercolor's soft beauty",
      "Anime's playful charm",
      "Renaissance nobility"
    ]
  },
  {
    step: 3,
    title: "Get & Order Products",
    subtitle: "Digital art plus custom merchandise",
    description: "Download high-resolution files instantly. Order custom canvas prints, apparel, mugs, and more.",
    emotion: "Joy & Fulfillment",
    icon: Heart,
    color: "from-emerald-500 to-teal-500",
    time: "Instant download + fast shipping",
    experience: "Turn digital art into treasured keepsakes",
    examples: [
      "Canvas wall art",
      "Custom coffee mugs",
      "Personalized t-shirts",
      "Greeting cards & stickers"
    ]
  }
];

function JourneyStepCard({ stepData, isActive }: { stepData: JourneyStep; isActive: boolean }) {
  const IconComponent = stepData.icon;
  
  return (
    <Card className={`relative overflow-hidden transition-all duration-500 ${
      isActive ? 'scale-105 shadow-xl ring-2 ring-primary' : 'hover:scale-102 hover:shadow-lg'
    }`}>
      <div className="absolute inset-0 bg-primary/5" />
      
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Step Number & Icon */}
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-xl bg-primary shadow-lg">
            <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary-foreground" />
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="text-xs font-medium">
              Step {stepData.step}
            </Badge>
            <div className="text-xs text-muted-foreground mt-1">
              {stepData.time}
            </div>
          </div>
        </div>

        {/* Title & Emotion */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            {stepData.title}
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            {stepData.subtitle}
          </p>
          <Badge variant="outline" className="text-xs">
            {stepData.emotion}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {stepData.description}
        </p>

        {/* Experience Highlight */}
        <div className="border border-border rounded-lg p-3 sm:p-4 bg-muted/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-foreground">
              {stepData.experience}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs text-muted-foreground">
            {stepData.examples.map((example, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-primary/60 shrink-0" />
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
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Clean Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-muted/10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 sm:mb-16 lg:mb-20 max-w-4xl text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 sm:px-4 py-1.5 sm:py-2">
            <Clock className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              From Pet Photo to Custom Products in Minutes
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            Simple 3-Step Process to
            <span className="block text-primary">
              Custom Pet Products
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
            Upload your pet's photo, choose an AI art style, then download digital files or order custom merchandise. 
            From canvas prints to mugs, we make it easy to celebrate your pet.
          </p>
        </div>

        {/* Journey Steps */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3 lg:gap-12 mb-12 sm:mb-16 lg:mb-20">
            {journeySteps.map((step, index) => (
              <JourneyStepCard 
                key={step.step} 
                stepData={step} 
                isActive={index === 1} // Highlight middle step
              />
            ))}
          </div>

        {/* Success Stories Preview */}
        <div className="border border-border rounded-xl p-6 sm:p-8 bg-muted/10 mb-12 sm:mb-16">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center gap-2">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" />
              <span className="text-base sm:text-lg font-semibold text-foreground">
                What Happens Next?
              </span>
              <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &quot;I uploaded Luna&apos;s photo and couldn&apos;t believe the Van Gogh result!&quot;
                </p>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &quot;The anime style made my Corgi look like a Studio Ghibli character!&quot;
                </p>
              </div>
              
              <div className="space-y-2 sm:space-y-3 sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &quot;Ordered prints for the whole family — best Christmas gifts ever!&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
              Ready to try it?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Takes 30 seconds. Try it free.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
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
              className="px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg font-medium border-2 hover:bg-accent"
              asChild
            >
              <Link href="/gallery">
                <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sm:hidden">View Examples</span>
                <span className="hidden sm:inline">See Examples First</span>
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>90 seconds total</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 fill-current text-primary" />
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