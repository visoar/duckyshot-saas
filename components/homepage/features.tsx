"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Database,
  Palette,
  Rocket,
  Shield,
  BarChart3,
  ArrowRight,
  Sparkles,
  CreditCard
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

const features: Feature[] = [
  {
    title: "Authentication & Users",
    description: "Complete auth system with OAuth, magic links, and user management. Role-based access control included.",
    icon: Shield,
    category: "Security"
  },
  {
    title: "Payments & Billing",
    description: "Stripe integration with subscriptions, invoicing, and tax handling. Revenue tracking built-in.",
    icon: CreditCard,
    category: "Payments"
  },
  {
    title: "Database & API",
    description: "Type-safe database with Drizzle ORM. RESTful APIs and real-time subscriptions ready.",
    icon: Database,
    category: "Backend"
  },
  {
    title: "Analytics & Insights",
    description: "User behavior tracking, conversion metrics, and beautiful dashboards for data-driven decisions.",
    icon: BarChart3,
    category: "Analytics"
  },
  {
    title: "Modern UI/UX",
    description: "Beautiful, responsive design with dark mode. Accessible components and smooth animations.",
    icon: Palette,
    category: "Design"
  },
  {
    title: "Production Deploy",
    description: "One-click deployment to Vercel, AWS, or Docker. CI/CD pipelines and monitoring included.",
    icon: Rocket,
    category: "DevOps"
  }
];

function FeatureCard({ feature }: { feature: Feature; index: number }) {
  const IconComponent = feature.icon;
  
  return (
    <Card className="group relative overflow-hidden p-6 transition-all duration-300 hover:shadow-md">
      <div className="space-y-4">
        {/* Icon and Category */}
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20">
            <IconComponent className="h-6 w-6" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {feature.category}
          </Badge>
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
      
      {/* Hover Arrow */}
      <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </Card>
  );
}

export function Features() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-2 h-3 w-3" />
            Everything Included
          </Badge>
          
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to
            <span className="block text-primary">build and scale</span>
          </h2>
          
          <p className="mt-6 text-lg text-muted-foreground">
            Skip months of development. Our starter includes all the essential features 
            you need to launch your SaaS product successfully.
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
            <div className="text-2xl font-bold text-foreground">50+</div>
            <div className="text-sm text-muted-foreground">Components</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">10+</div>
            <div className="text-sm text-muted-foreground">Integrations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">100%</div>
            <div className="text-sm text-muted-foreground">Type Safe</div>
          </div>
        </div>
      </div>
    </section>
  );
}
