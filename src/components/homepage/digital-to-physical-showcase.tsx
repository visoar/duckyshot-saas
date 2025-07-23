import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Package,
  Printer,
  Shirt,
  Coffee,
  Frame,
  Calendar,
  Sparkles,
  ArrowRight,
  Heart,
  // Home,
  Gift,
  CheckCircle,
  Truck,
} from "lucide-react";
import Link from "next/link";

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  products: {
    name: string;
    description: string;
    popular?: boolean;
  }[];
  color: string;
  useCases: string[];
}

const productCategories: ProductCategory[] = [
  {
    id: "wall-art",
    name: "Wall Art & Decor",
    description:
      "Transform your space with professional canvas prints and framed artwork",
    icon: Frame,
    color: "from-blue-500 to-purple-600",
    products: [
      {
        name: "Canvas Prints",
        description: "Museum-quality canvas with premium frames",
        popular: true,
      },
      {
        name: "Framed Prints",
        description: "Classic frames in various sizes and finishes",
      },
      {
        name: "Metal Prints",
        description: "Modern aluminum prints with vibrant colors",
      },
      {
        name: "Poster Prints",
        description: "High-quality paper prints for any space",
      },
    ],
    useCases: [
      "Living room centerpiece",
      "Bedroom decor",
      "Office wall art",
      "Memorial displays",
    ],
  },
  {
    id: "apparel",
    name: "Custom Apparel",
    description:
      "Wear your pet&apos;s artwork with pride on premium clothing and accessories",
    icon: Shirt,
    color: "from-green-500 to-teal-600",
    products: [
      {
        name: "T-Shirts",
        description: "Soft cotton tees with vibrant prints",
        popular: true,
      },
      {
        name: "Hoodies",
        description: "Cozy hooded sweatshirts for all seasons",
      },
      {
        name: "Tank Tops",
        description: "Lightweight summer wear with your pet&apos;s art",
      },
      { name: "Tote Bags", description: "Eco-friendly bags for everyday use" },
    ],
    useCases: [
      "Pet owner gifts",
      "Family reunions",
      "Memorial wear",
      "Casual everyday",
    ],
  },
  {
    id: "drinkware",
    name: "Drinkware & Kitchen",
    description:
      "Start every day with your pet&apos;s smiling face on premium drinkware",
    icon: Coffee,
    color: "from-orange-500 to-red-600",
    products: [
      {
        name: "Coffee Mugs",
        description: "Ceramic mugs perfect for morning coffee",
        popular: true,
      },
      {
        name: "Travel Mugs",
        description: "Insulated mugs for coffee on the go",
      },
      {
        name: "Water Bottles",
        description: "Stainless steel bottles for hydration",
      },
      { name: "Coasters", description: "Protect your furniture in style" },
    ],
    useCases: [
      "Morning coffee ritual",
      "Office desk accessories",
      "Housewarming gifts",
      "Daily reminders",
    ],
  },
  {
    id: "stationery",
    name: "Cards & Stationery",
    description:
      "Share your pet&apos;s beauty with greeting cards and personalized stationery",
    icon: Calendar,
    color: "from-pink-500 to-rose-600",
    products: [
      {
        name: "Greeting Cards",
        description: "Premium cards for any occasion",
        popular: true,
      },
      {
        name: "Thank You Cards",
        description: "Express gratitude with your pet&apos;s portrait",
      },
      {
        name: "Postcards",
        description: "Share memories with friends and family",
      },
      {
        name: "Stickers",
        description: "Fun stickers for laptops, phones, and more",
      },
    ],
    useCases: [
      "Birthday wishes",
      "Sympathy cards",
      "Holiday greetings",
      "Thank you notes",
    ],
  },
];

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Create AI Art",
    description: "Upload your pet photo and choose from 50+ artistic styles",
    icon: Sparkles,
    color: "from-purple-500 to-indigo-500",
  },
  {
    step: 2,
    title: "Select Products",
    description: "Choose from canvas prints, apparel, mugs, and more",
    icon: Package,
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: 3,
    title: "We Print & Ship",
    description: "Professional printing and fast shipping to your door",
    icon: Truck,
    color: "from-green-500 to-emerald-500",
  },
];

function ProductCategoryCard({ category }: { category: ProductCategory }) {
  const IconComponent = category.icon;

  return (
    <Card className="group bg-card relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="bg-muted/5 group-hover:bg-muted/10 absolute inset-0 transition-colors duration-300" />

      <div className="relative space-y-4 p-4 sm:space-y-6 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br sm:h-14 sm:w-14 lg:h-16 lg:w-16 ${category.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
          >
            <IconComponent className="h-6 w-6 text-white sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-foreground text-lg font-bold sm:text-xl lg:text-2xl">
              {category.name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
              {category.description}
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-foreground text-xs font-semibold sm:text-sm">
            Popular Products:
          </h4>
          <div className="grid gap-1 sm:gap-2">
            {category.products.map((product, index) => (
              <div
                key={index}
                className="bg-muted/30 hover:bg-muted/50 flex items-center gap-2 rounded-lg p-2 transition-colors sm:gap-3"
              >
                <CheckCircle className="text-primary h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-xs font-medium sm:text-sm">
                      {product.name}
                    </span>
                    {product.popular && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground line-clamp-1 text-xs">
                    {product.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-foreground text-xs font-semibold sm:text-sm">
            Perfect For:
          </h4>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {category.useCases.map((useCase, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {useCase}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ProcessStepCard({ step }: { step: ProcessStep }) {
  const IconComponent = step.icon;

  return (
    <div className="space-y-4 text-center">
      <div className="relative mx-auto">
        <div
          className={`mx-auto h-16 w-16 rounded-full bg-gradient-to-br sm:h-20 sm:w-20 ${step.color} flex items-center justify-center shadow-lg`}
        >
          <IconComponent className="h-8 w-8 text-white sm:h-10 sm:w-10" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-foreground text-lg font-bold sm:text-xl">
          {step.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function DigitalToPhysicalShowcase() {
  return (
    <section className="bg-background relative overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-muted/5 absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-4xl space-y-4 text-center sm:mb-16 sm:space-y-6 lg:mb-20">
          <div className="border-primary/20 bg-primary/5 inline-flex items-center rounded-full border px-3 py-1.5 sm:px-4 sm:py-2">
            <Package className="text-primary mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-primary text-xs font-medium sm:text-sm">
              From Digital Art to Physical Products
            </span>
          </div>

          <h2 className="text-foreground text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Turn AI Pet Art Into
            <span className="text-primary block">Custom Merchandise</span>
          </h2>

          <p className="text-muted-foreground mx-auto max-w-4xl text-base leading-relaxed sm:text-lg lg:text-xl">
            Don&apos;t just admire your pet&apos;s AI artwork on screen.
            Transform it into beautiful physical products you can touch,
            display, and gift. From canvas wall art to custom apparel and
            drinkware.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          <div className="mb-12 text-center sm:mb-16">
            <h3 className="text-foreground mb-4 text-2xl font-bold sm:text-3xl">
              How It Works
            </h3>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg">
              Three simple steps from pet photo to custom products delivered to
              your door
            </p>
          </div>

          <div className="grid gap-8 sm:gap-12 md:grid-cols-3 lg:gap-16">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <ProcessStepCard step={step} />
                {index < processSteps.length - 1 && (
                  <div className="absolute top-8 left-1/2 hidden w-full sm:top-10 md:block">
                    <ArrowRight className="text-muted-foreground mx-auto h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Categories */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          <div className="mb-12 space-y-4 text-center sm:mb-16">
            <h3 className="text-foreground text-2xl font-bold sm:text-3xl lg:text-4xl">
              Custom Products for Every Need
            </h3>
            <p className="text-muted-foreground mx-auto max-w-3xl text-base leading-relaxed sm:text-lg">
              Whether you want to decorate your home, create meaningful gifts,
              or wear your pet&apos;s art with pride, we have the perfect
              products for every occasion and space.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 xl:grid-cols-4">
            {productCategories.map((category) => (
              <ProductCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="border-border bg-muted/20 mb-16 rounded-2xl border p-6 sm:mb-20 sm:p-8 lg:rounded-3xl lg:p-12">
          <div className="space-y-6 text-center sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2">
                <Heart className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-foreground text-base font-semibold sm:text-lg">
                  Why Choose Our Custom Products?
                </span>
              </div>
              <h3 className="text-foreground text-2xl font-bold sm:text-3xl">
                Premium Quality, Fast Delivery
              </h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
              <div className="text-center">
                <div className="bg-primary/10 border-primary/20 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border sm:mb-4 sm:h-16 sm:w-16">
                  <Printer className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h4 className="text-foreground mb-2 text-sm font-semibold sm:text-base">
                  Professional Printing
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Museum-quality materials and commercial-grade printing
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 border-primary/20 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border sm:mb-4 sm:h-16 sm:w-16">
                  <Truck className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h4 className="text-foreground mb-2 text-sm font-semibold sm:text-base">
                  Fast Shipping
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Quick turnaround with tracked delivery worldwide
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 border-primary/20 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border sm:mb-4 sm:h-16 sm:w-16">
                  <CheckCircle className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h4 className="text-foreground mb-2 text-sm font-semibold sm:text-base">
                  Quality Guarantee
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  100% satisfaction guarantee or money back
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 border-primary/20 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border sm:mb-4 sm:h-16 sm:w-16">
                  <Gift className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <h4 className="text-foreground mb-2 text-sm font-semibold sm:text-base">
                  Gift Ready
                </h4>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Beautiful packaging perfect for gifting, ready for a surprise
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-6 text-center sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-foreground text-2xl font-bold sm:text-3xl">
              Ready to Create Custom Pet Products?
            </h3>
            <p className="text-muted-foreground mx-auto max-w-2xl text-sm leading-relaxed sm:text-base">
              Start with AI art creation, then browse our full product catalog.
              Transform your pet&apos;s personality into something you can hold,
              display, and treasure forever.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 h-12 px-6 text-base shadow-lg sm:h-14 sm:px-8 sm:text-lg"
              asChild
            >
              <Link href="/ai-studio">
                <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Create AI Art First
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 border-2 px-6 text-base sm:h-14 sm:px-8 sm:text-lg"
              asChild
            >
              <Link href="/gallery">
                <Package className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                See Product Examples
              </Link>
            </Button>
          </div>

          <p className="text-muted-foreground text-xs sm:text-sm">
            Free AI art creation • Professional printing • Worldwide shipping
          </p>
        </div>
      </div>
    </section>
  );
}
