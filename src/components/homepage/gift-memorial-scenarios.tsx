import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Gift,
  Calendar,
  Home,
  Coffee,
  Shirt,
  Frame,
  BookOpen,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react";
import Link from "next/link";

interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  occasion: string;
  icon: React.ComponentType<{ className?: string }>;
  products: {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }[];
  story: {
    name: string;
    pet: string;
    quote: string;
    rating: number;
  };
  popular: boolean;
}

const scenarios: Scenario[] = [
  {
    id: "memorial",
    title: "Forever Memories",
    subtitle: "Honor your beloved companion",
    description:
      "Create a lasting tribute that celebrates the joy and love your pet brought to your life. These artworks become treasured keepsakes that keep their memory alive in your heart and home.",
    occasion: "Memorial & Remembrance",
    icon: Heart,
    products: [
      {
        name: "Canvas Prints",
        icon: Frame,
        description: "Museum-quality canvas for your wall",
      },
      {
        name: "Photo Books",
        icon: BookOpen,
        description: "Artistic memory books to cherish",
      },
      {
        name: "Memorial Cards",
        icon: Heart,
        description: "Share beautiful memories with others",
      },
    ],
    story: {
      name: "Maria S.",
      pet: "Golden Retriever Max",
      quote:
        "Max's Van Gogh portrait hangs in our living room now. Every guest comments on how beautiful it is, and it brings me comfort knowing his spirit lives on through art.",
      rating: 5,
    },
    popular: true,
  },
  {
    id: "celebration",
    title: "Birthday Magic",
    subtitle: "Celebrate your pet's special day",
    description:
      "Make your pet's birthday unforgettable with custom artwork that captures their personality. Create gifts for the whole family or party decorations that show how much they mean to you.",
    occasion: "Birthdays & Celebrations",
    icon: Gift,
    products: [
      {
        name: "Custom Mugs",
        icon: Coffee,
        description: "Start every morning with their smile",
      },
      {
        name: "T-Shirts",
        icon: Shirt,
        description: "Wear their art with pride",
      },
      {
        name: "Greeting Cards",
        icon: Calendar,
        description: "Share birthday joy with friends",
      },
    ],
    story: {
      name: "David L.",
      pet: "French Bulldog Pierre",
      quote:
        "Pierre's anime-style birthday portrait was the hit of his birthday party! We ordered mugs for all the guests and everyone still talks about it.",
      rating: 5,
    },
    popular: false,
  },
  {
    id: "family-gifts",
    title: "Perfect Gifts",
    subtitle: "Give something truly meaningful",
    description:
      "When words aren't enough, let art speak. These personalized gifts show pet lovers in your life that you understand how special their furry family member is to them.",
    occasion: "Holidays & Special Occasions",
    icon: Sparkles,
    products: [
      {
        name: "Canvas Gallery",
        icon: Frame,
        description: "Professional gallery-style displays",
      },
      {
        name: "Custom Apparel",
        icon: Shirt,
        description: "Unique clothing they'll treasure",
      },
      {
        name: "Home Décor",
        icon: Home,
        description: "Beautiful pieces for any room",
      },
    ],
    story: {
      name: "Jennifer K.",
      pet: "Rescue Cat Luna",
      quote:
        "I gave my mom Luna's watercolor portrait for Mother's Day. She cried happy tears and immediately hung it in her kitchen. Best gift I've ever given!",
      rating: 5,
    },
    popular: true,
  },
  {
    id: "home-decor",
    title: "Home Gallery",
    subtitle: "Transform your space with love",
    description:
      "Turn your home into a gallery that celebrates your pets. Create a cohesive collection that showcases your furry family members as the works of art they truly are.",
    occasion: "Home Decoration & Design",
    icon: Home,
    products: [
      {
        name: "Matching Sets",
        icon: Frame,
        description: "Coordinated artwork collections",
      },
      {
        name: "Various Sizes",
        icon: Sparkles,
        description: "From small prints to wall murals",
      },
      {
        name: "Style Themes",
        icon: Gift,
        description: "Curated artistic style collections",
      },
    ],
    story: {
      name: "Robert M.",
      pet: "Three Cats - Mimi, Coco & Bella",
      quote:
        "Our hallway is now a 'Cat Gallery' with all three cats in Renaissance style. It's become the most photographed spot in our house!",
      rating: 5,
    },
    popular: false,
  },
];

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const IconComponent = scenario.icon;

  return (
    <Card className="group bg-card relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      {scenario.popular && (
        <div className="absolute top-3 right-3 z-10 sm:top-4 sm:right-4">
          <Badge className="bg-primary text-primary-foreground shadow-lg">
            <Star className="mr-1 h-3 w-3 fill-current" />
            Most Popular
          </Badge>
        </div>
      )}

      <div className="bg-muted/5 group-hover:bg-muted/10 absolute inset-0 transition-colors duration-300" />

      <div className="relative space-y-4 p-4 sm:space-y-6 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-primary inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
            <IconComponent className="text-primary-foreground h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {scenario.occasion}
            </Badge>
            <h3 className="text-foreground text-lg font-bold sm:text-xl lg:text-2xl">
              {scenario.title}
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              {scenario.subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
          {scenario.description}
        </p>

        {/* Products */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-foreground text-xs font-semibold sm:text-sm">
            Perfect Products:
          </h4>
          <div className="grid gap-1 sm:gap-2">
            {scenario.products.map((product, index) => {
              const ProductIcon = product.icon;
              return (
                <div
                  key={index}
                  className="bg-muted/30 hover:bg-muted/50 flex items-center gap-2 rounded-lg p-2 transition-colors sm:gap-3"
                >
                  <ProductIcon className="text-primary h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground text-xs font-medium sm:text-sm">
                      {product.name}
                    </div>
                    <div className="text-muted-foreground line-clamp-1 text-xs">
                      {product.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Story */}
        <div className="border-border bg-muted/20 rounded-lg border p-3 sm:rounded-xl sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8">
                <Heart className="text-primary-foreground h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium sm:text-sm">
                  {scenario.story.name}
                </div>
                <div className="text-muted-foreground line-clamp-1 text-xs">
                  {scenario.story.pet}
                </div>
              </div>
              <div className="flex shrink-0">
                {Array.from({ length: scenario.story.rating }).map((_, i) => (
                  <Star key={i} className="fill-primary text-primary h-3 w-3" />
                ))}
              </div>
            </div>
            <blockquote className="text-muted-foreground text-xs leading-relaxed italic sm:text-sm">
              &ldquo;{scenario.story.quote}&rdquo;
            </blockquote>
          </div>
        </div>

        {/* CTA */}
        <Button
          className="group/btn h-10 w-full text-sm sm:h-12 sm:text-base"
          variant="outline"
          asChild
        >
          <Link href="/ai-studio">
            <span className="sm:hidden">Create Art</span>
            <span className="hidden sm:inline">
              Create for {scenario.title}
            </span>
            <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1 sm:h-4 sm:w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export function GiftMemorialScenarios() {
  return (
    <section className="bg-background relative overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Clean Background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-muted/10 absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-15" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-4xl space-y-4 text-center sm:mb-16 sm:space-y-6 lg:mb-20">
          <div className="border-primary/20 bg-primary/5 inline-flex items-center rounded-full border px-3 py-1.5 sm:px-4 sm:py-2">
            <Gift className="text-primary mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-primary text-xs font-medium sm:text-sm">
              Perfect for Every Occasion
            </span>
          </div>

          <h2 className="text-foreground text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Every Moment Deserves
            <span className="text-primary block">To Be Celebrated</span>
          </h2>

          <p className="text-muted-foreground mx-auto max-w-3xl text-base leading-relaxed sm:text-lg lg:text-xl">
            Whether you&apos;re honoring a cherished memory, celebrating a
            special milestone, or creating the perfect gift, your pet&apos;s
            artwork fits every meaningful moment in your life.
          </p>
        </div>

        {/* Scenarios Grid */}
        <div className="mb-12 grid gap-4 sm:mb-16 sm:gap-6 lg:mb-20 lg:grid-cols-2 lg:gap-8">
          {scenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      </div>
    </section>
  );
}
