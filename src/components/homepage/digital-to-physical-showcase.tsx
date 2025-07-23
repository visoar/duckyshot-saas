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
  Home,
  Gift,
  CheckCircle,
  Truck
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
    description: "Transform your space with professional canvas prints and framed artwork",
    icon: Frame,
    color: "from-blue-500 to-purple-600",
    products: [
      { name: "Canvas Prints", description: "Museum-quality canvas with premium frames", popular: true },
      { name: "Framed Prints", description: "Classic frames in various sizes and finishes" },
      { name: "Metal Prints", description: "Modern aluminum prints with vibrant colors" },
      { name: "Poster Prints", description: "High-quality paper prints for any space" }
    ],
    useCases: ["Living room centerpiece", "Bedroom decor", "Office wall art", "Memorial displays"]
  },
  {
    id: "apparel",
    name: "Custom Apparel",
    description: "Wear your pet's artwork with pride on premium clothing and accessories",
    icon: Shirt,
    color: "from-green-500 to-teal-600",
    products: [
      { name: "T-Shirts", description: "Soft cotton tees with vibrant prints", popular: true },
      { name: "Hoodies", description: "Cozy hooded sweatshirts for all seasons" },
      { name: "Tank Tops", description: "Lightweight summer wear with your pet's art" },
      { name: "Tote Bags", description: "Eco-friendly bags for everyday use" }
    ],
    useCases: ["Pet owner gifts", "Family reunions", "Memorial wear", "Casual everyday"]
  },
  {
    id: "drinkware",
    name: "Drinkware & Kitchen",
    description: "Start every day with your pet's smiling face on premium drinkware",
    icon: Coffee,
    color: "from-orange-500 to-red-600",
    products: [
      { name: "Coffee Mugs", description: "Ceramic mugs perfect for morning coffee", popular: true },
      { name: "Travel Mugs", description: "Insulated mugs for coffee on the go" },
      { name: "Water Bottles", description: "Stainless steel bottles for hydration" },
      { name: "Coasters", description: "Protect your furniture in style" }
    ],
    useCases: ["Morning coffee ritual", "Office desk accessories", "Housewarming gifts", "Daily reminders"]
  },
  {
    id: "stationery",
    name: "Cards & Stationery",
    description: "Share your pet's beauty with greeting cards and personalized stationery",
    icon: Calendar,
    color: "from-pink-500 to-rose-600",
    products: [
      { name: "Greeting Cards", description: "Premium cards for any occasion", popular: true },
      { name: "Thank You Cards", description: "Express gratitude with your pet's portrait" },
      { name: "Postcards", description: "Share memories with friends and family" },
      { name: "Stickers", description: "Fun stickers for laptops, phones, and more" }
    ],
    useCases: ["Birthday wishes", "Sympathy cards", "Holiday greetings", "Thank you notes"]
  }
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
    color: "from-purple-500 to-indigo-500"
  },
  {
    step: 2,
    title: "Select Products",
    description: "Choose from canvas prints, apparel, mugs, and more",
    icon: Package,
    color: "from-blue-500 to-cyan-500"
  },
  {
    step: 3,
    title: "We Print & Ship",
    description: "Professional printing and fast shipping to your door",
    icon: Truck,
    color: "from-green-500 to-emerald-500"
  }
];

function ProductCategoryCard({ category }: { category: ProductCategory }) {
  const IconComponent = category.icon;
  
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg group hover:scale-[1.02] bg-card">
      <div className="absolute inset-0 bg-muted/5 group-hover:bg-muted/10 transition-colors duration-300" />
      
      <div className="relative p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-3 sm:space-y-4">
          <div className={`inline-flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
            <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              {category.name}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-xs sm:text-sm font-semibold text-foreground">Popular Products:</h4>
          <div className="grid gap-1 sm:gap-2">
            {category.products.map((product, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium text-foreground">{product.name}</span>
                    {product.popular && (
                      <Badge variant="secondary" className="text-xs">Popular</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="text-xs sm:text-sm font-semibold text-foreground">Perfect For:</h4>
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
    <div className="text-center space-y-4">
      <div className="relative mx-auto">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br ${step.color} shadow-lg flex items-center justify-center`}>
          <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">{step.step}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-foreground">
          {step.title}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function DigitalToPhysicalShowcase() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-muted/5" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 sm:mb-16 lg:mb-20 max-w-4xl text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 sm:px-4 py-1.5 sm:py-2">
            <Package className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">
              From Digital Art to Physical Products
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            Turn AI Pet Art Into
            <span className="block text-primary">
              Custom Merchandise
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Don't just admire your pet's AI artwork on screen. Transform it into beautiful physical products 
            you can touch, display, and gift. From canvas wall art to custom apparel and drinkware.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              How It Works
            </h3>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Three simple steps from pet photo to custom products delivered to your door
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <ProcessStepCard step={step} />
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 sm:top-10 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-muted-foreground mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Categories */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Custom Products for Every Need
            </h3>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Whether you want to decorate your home, create meaningful gifts, or wear your pet's art with pride, 
              we have the perfect products for every occasion and space.
            </p>
          </div>
          
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 xl:grid-cols-4">
            {productCategories.map((category) => (
              <ProductCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="border border-border rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 bg-muted/20 mb-16 sm:mb-20">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-base sm:text-lg font-semibold text-foreground">
                  Why Choose Our Custom Products?
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                Premium Quality, Fast Delivery
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 sm:mb-4">
                  <Printer className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">Professional Printing</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Museum-quality materials and commercial-grade printing</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 sm:mb-4">
                  <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">Fast Shipping</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Quick turnaround with tracked delivery worldwide</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 sm:mb-4">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">Quality Guarantee</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">100% satisfaction guarantee or money back</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 sm:mb-4">
                  <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base text-foreground mb-2">Gift Ready</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Beautiful packaging perfect for gifting</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
              Ready to Create Custom Pet Products?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Start with AI art creation, then browse our full product catalog. 
              Transform your pet's personality into something you can hold, display, and treasure forever.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg bg-primary hover:bg-primary/90 shadow-lg"
              asChild
            >
              <Link href="/ai-studio">
                <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Create AI Art First
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg border-2" asChild>
              <Link href="/gallery">
                <Package className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                See Product Examples
              </Link>
            </Button>
          </div>
          
          <p className="text-xs sm:text-sm text-muted-foreground">
            Free AI art creation • Professional printing • Worldwide shipping
          </p>
        </div>
      </div>
    </section>
  );
}