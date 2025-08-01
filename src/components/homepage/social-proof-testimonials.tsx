import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Quote,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
} from "lucide-react";

const testimonials = [
  {
    id: 1,
    content:
      "DuckyShot transformed my golden retriever Max into the most beautiful watercolor portrait. The AI quality is incredible and I ordered it on a canvas print for our living room.",
    author: {
      name: "Sarah Chen",
      role: "Pet Parent",
      company: "San Francisco",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      initials: "SC",
    },
    rating: 5,
    featured: true,
  },
  {
    id: 2,
    content:
      "My rescue cat Luna looked amazing in the anime style! The AI captured her personality perfectly. I've ordered custom mugs for my whole family.",
    author: {
      name: "Marcus Rodriguez",
      role: "Cat Dad",
      company: "Austin, TX",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      initials: "MR",
    },
    rating: 5,
    featured: false,
  },
  {
    id: 3,
    content:
      "The variety of art styles is amazing! I tried oil painting and pixel art for my Corgi Buddy. Both turned out fantastic and shipping was super fast.",
    author: {
      name: "Emily Watson",
      role: "Dog Mom",
      company: "Seattle, WA",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      initials: "EW",
    },
    rating: 5,
    featured: false,
  },
  {
    id: 4,
    content:
      "Lost my beloved German Shepherd Rex last year. DuckyShot helped me create a beautiful memorial portrait in Van Gogh style. It brings me comfort every day.",
    author: {
      name: "David Kim",
      role: "Pet Parent",
      company: "Denver, CO",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      initials: "DK",
    },
    rating: 5,
    featured: true,
  },
  {
    id: 5,
    content:
      "My French Bulldog Pepper in cyberpunk style is now my phone wallpaper! The AI art quality exceeded my expectations and the t-shirt print looks professional.",
    author: {
      name: "Lisa Thompson",
      role: "Frenchie Owner",
      company: "Miami, FL",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      initials: "LT",
    },
    rating: 5,
    featured: false,
  },
  {
    id: 6,
    content:
      "Created AI art of both my cats in Studio Ghibli style for Christmas gifts. My family was amazed by the quality and creativity. Best pet gift ever!",
    author: {
      name: "Alex Johnson",
      role: "Multi-Cat Parent",
      company: "Portland, OR",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      initials: "AJ",
    },
    rating: 5,
    featured: false,
  },
];

const stats = [
  {
    icon: Users,
    value: "25,000+",
    label: "Pet Parents",
    description: "Creating AI art worldwide",
  },
  {
    icon: TrendingUp,
    value: "150,000+",
    label: "AI Artworks",
    description: "Generated and loved",
  },
  {
    icon: Award,
    value: "50+",
    label: "Art Styles",
    description: "From classic to modern",
  },
  {
    icon: CheckCircle,
    value: "4.8/5",
    label: "Rating",
    description: "From satisfied pet parents",
  },
];

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  return (
    <Card
      className={`h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        testimonial.featured
          ? "border-primary/30 from-primary/10 via-primary/5 to-background ring-primary/20 bg-gradient-to-br shadow-lg ring-1"
          : "border-border hover:border-primary/20 from-background to-muted/30 bg-gradient-to-br hover:shadow-lg"
      }`}
    >
      <CardContent>
        {/* Quote Icon */}
        <div className="mb-3 sm:mb-4">
          <Quote className="text-primary/60 h-6 w-6 sm:h-8 sm:w-8" />
        </div>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1 sm:mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              className="fill-primary text-primary h-3 w-3 sm:h-4 sm:w-4"
            />
          ))}
        </div>

        {/* Content */}
        <blockquote className="text-muted-foreground mb-4 text-sm leading-relaxed sm:mb-6 sm:text-base">
          &quot;{testimonial.content}&quot;
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Avatar className="h-8 w-8 shrink-0 sm:h-10 sm:w-10">
            <AvatarImage
              src={testimonial.author.avatar}
              alt={testimonial.author.name}
            />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium sm:text-sm">
              {testimonial.author.initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="text-foreground truncate text-xs font-medium sm:text-sm">
              {testimonial.author.name}
            </div>
            <div className="text-muted-foreground line-clamp-1 text-xs">
              {testimonial.author.role} at {testimonial.author.company}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ stat }: { stat: (typeof stats)[0] }) {
  const IconComponent = stat.icon;

  return (
    <div className="space-y-1 text-center sm:space-y-2">
      <div className="bg-primary/10 border-primary/20 mx-auto flex h-10 w-10 items-center justify-center rounded-lg border sm:h-12 sm:w-12">
        <IconComponent className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <div className="text-foreground text-xl font-bold sm:text-2xl">
        {stat.value}
      </div>
      <div className="text-foreground text-xs font-medium sm:text-sm">
        {stat.label}
      </div>
      <div className="text-muted-foreground line-clamp-2 text-xs">
        {stat.description}
      </div>
    </div>
  );
}

export function SocialProofUnified() {
  return (
    <section className="bg-muted/20 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="mb-8 space-y-3 text-center sm:mb-12 sm:space-y-4">
            <Badge variant="secondary" className="mb-2 sm:mb-4">
              <TrendingUp className="mr-2 h-3 w-3" />
              Trusted Worldwide
            </Badge>
            <h2 className="text-foreground text-2xl font-bold sm:text-3xl md:text-4xl">
              Join thousands of pet parents
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
              Creating beautiful AI artwork of their beloved pets
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center sm:mb-12 sm:space-y-4">
            <Badge variant="secondary" className="mb-2 sm:mb-4">
              <Users className="mr-2 h-3 w-3" />
              Customer Stories
            </Badge>

            <h3 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Loved by pet parents worldwide
            </h3>

            <p className="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed sm:text-lg">
              See what our community has to say about their pet AI artwork
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Pet Parent Community Section */}
        <div className="text-center">
          <p className="text-muted-foreground mx-auto mb-6 max-w-3xl text-base leading-relaxed sm:mb-8 sm:text-lg">
            Featured in pet communities, social media, and gift blogs worldwide
          </p>
          <div className="bg-primary/5 border-primary/20 mx-auto max-w-2xl rounded-lg border p-6 sm:rounded-xl sm:p-8">
            <p className="text-muted-foreground text-sm leading-relaxed italic sm:text-base">
              &ldquo;DuckyShot has revolutionized how pet parents celebrate
              their furry friends. The AI quality and custom merchandise options
              make it the perfect gift for any pet lover.&rdquo;
            </p>
            <p className="text-foreground mt-3 text-sm font-medium sm:mt-4">
              - Featured in Pet Parent Magazine
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center sm:mt-16">
          <p className="text-muted-foreground text-sm sm:text-base">
            Want to share your pet&apos;s AI artwork story?
            <a
              href="mailto:hello@duckyshot.com"
              className="text-primary ml-1 font-medium hover:underline"
            >
              Get in touch
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
