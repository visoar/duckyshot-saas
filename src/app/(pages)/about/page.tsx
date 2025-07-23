import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Globe, Award, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { COMPANY_NAME } from "@/lib/config/constants";
import { BackgroundPattern } from "@/components/ui/background-pattern";

export const metadata = createMetadata({
  title: "About Us",
  description:
    "Learn about DuckyShot's mission to help pet parents create magical AI artwork and custom merchandise of their beloved pets.",
});

const teamMembers = [
  {
    name: "Alex Chen",
    role: "CEO & Founder",
    bio: "Former tech lead at major SaaS companies. Passionate about developer tools.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?fit=crop&crop=face",
  },
  {
    name: "Sarah Johnson",
    role: "CTO",
    bio: "Full-stack engineer with 10+ years building scalable applications.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?fit=crop&crop=face",
  },
  {
    name: "Mike Rodriguez",
    role: "Head of Product",
    bio: "Product strategist focused on developer experience and user success.",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?fit=crop&crop=face",
  },
];

const values = [
  {
    icon: Heart,
    title: "Pet-Centered",
    description:
      "Every decision we make puts pets and their well-being first, celebrating the unique bond between pets and their families.",
  },
  {
    icon: Sparkles,
    title: "Creative Innovation",
    description:
      "We harness cutting-edge AI technology to transform ordinary pet photos into extraordinary artistic masterpieces.",
  },
  {
    icon: Target,
    title: "Quality Focused",
    description:
      "We're committed to delivering high-quality artwork and merchandise that pet parents treasure for years to come.",
  },
  {
    icon: Globe,
    title: "Community Driven",
    description:
      "Building a global community of pet lovers who celebrate their companions through beautiful, personalized art.",
  },
];

const milestones = [
  {
    year: "2023",
    title: "DuckyShot Born",
    description: "Founded with a mission to celebrate pets through AI-powered artwork",
  },
  {
    year: "2024",
    title: "10K Pet Artworks",
    description: "Reached our first milestone of beautiful pet art creations",
  },
  {
    year: "2024",
    title: "25K Pet Parents",
    description: "Built a thriving community of pet lovers worldwide",
  },
  {
    year: "2024",
    title: "Custom Merchandise",
    description: "Launched personalized products to bring pet art into everyday life",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-background relative overflow-hidden py-24">
        <BackgroundPattern />

        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="border-border bg-background/50 mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm backdrop-blur-sm">
              <Heart className="text-pink-500 mr-2 h-3 w-3 fill-current" />
              <span className="text-muted-foreground">
                Celebrating the bond between pets and their families
              </span>
            </div>

            <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              About <span className="text-primary">{COMPANY_NAME}</span>
            </h1>

            <p className="text-muted-foreground mb-8 text-xl leading-relaxed">
              We&apos;re passionate about helping pet parents celebrate their furry, 
              feathered, and scaly companions through beautiful AI-generated artwork 
              and custom merchandise. Every pet deserves to be immortalized as art.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/careers">Join Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Our Values
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              The principles that guide our mission to celebrate pets through art
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center shadow-sm">
                  <CardContent>
                    <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                      <Icon className="text-primary h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {value.description}
                    </p>
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
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              The passionate individuals behind {COMPANY_NAME}
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent>
                  <div className="bg-muted mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={150}
                      height={150}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <h3 className="mb-1 font-semibold">{member.name}</h3>
                  <p className="text-primary mb-3 text-sm">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Our Journey
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Key milestones in our journey to celebrate pets through AI artwork
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
                      <Award className="text-primary-foreground h-5 w-5" />
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="bg-border mt-4 h-16 w-px" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="mb-2 flex items-center gap-3">
                      <Badge variant="secondary">{milestone.year}</Badge>
                      <h3 className="font-semibold">{milestone.title}</h3>
                    </div>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
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
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Ready to Transform Your Pet Into Art?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of pet parents who are already creating beautiful 
              AI artwork and custom merchandise of their beloved companions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/dashboard">Start Creating Art</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
