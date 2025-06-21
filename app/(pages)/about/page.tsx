import React from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Lightbulb, 
  Heart, 
  Globe, 
  Award,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { createMetadata } from "@/lib/metadata";
import { COMPANY_NAME } from "@/constants";
import { BackgroundPattern } from "@/components/ui/background-pattern";

export const metadata = createMetadata({
  title: "About Us",
  description: "Learn about our mission to help developers build and launch SaaS products faster than ever before.",
});

const teamMembers = [
  {
    name: "Alex Chen",
    role: "CEO & Founder",
    bio: "Former tech lead at major SaaS companies. Passionate about developer tools.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?fit=crop&crop=face"
  },
  {
    name: "Sarah Johnson",
    role: "CTO",
    bio: "Full-stack engineer with 10+ years building scalable applications.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?fit=crop&crop=face"
  },
  {
    name: "Mike Rodriguez",
    role: "Head of Product",
    bio: "Product strategist focused on developer experience and user success.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?fit=crop&crop=face"
  }
];

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We&apos;re committed to democratizing SaaS development and making it accessible to everyone."
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We constantly push the boundaries of what&apos;s possible in developer tooling."
  },
  {
    icon: Heart,
    title: "Community Focused",
    description: "Our success is measured by the success of the developers who use our platform."
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Building tools that empower developers worldwide to create amazing products."
  }
];

const milestones = [
  {
    year: "2023",
    title: "Company Founded",
    description: "Started with a vision to simplify SaaS development"
  },
  {
    year: "2024",
    title: "10K+ Developers",
    description: "Reached our first major milestone of active users"
  },
  {
    year: "2024",
    title: "Series A Funding",
    description: "Secured funding to accelerate product development"
  },
  {
    year: "2024",
    title: "Enterprise Launch",
    description: "Launched enterprise features for larger teams"
  }
];

export default function AboutPage() {
  return (
    <>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-24">
          <BackgroundPattern />
          
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm backdrop-blur-sm mb-6">
                <Sparkles className="mr-2 h-3 w-3 text-primary" />
                <span className="text-muted-foreground">Building the future of SaaS development</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                About <span className="text-primary">{COMPANY_NAME}</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                We&apos;re on a mission to democratize SaaS development by providing developers 
                with the tools, templates, and infrastructure they need to build and launch 
                successful products faster than ever before.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Get in Touch
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/careers">
                    Join Our Team
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="text-center shadow-sm">
                    <CardContent className="pt-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The passionate individuals behind {COMPANY_NAME}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Image 
                        src={member.image} 
                        alt={member.name} 
                        width={150}
                        height={150}
                        className="w-full h-full rounded-full object-cover" 
                      />
                    </div>
                    <h3 className="font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Our Journey</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Key milestones in our mission to transform SaaS development
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary-foreground" />
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="w-px h-16 bg-border mt-4" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary">{milestone.year}</Badge>
                        <h3 className="font-semibold">{milestone.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of developers who are already building the next generation of SaaS products.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/pricing">
                    Get Started Today
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">
                    Contact Sales
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}