"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "next-view-transitions";

export function CallToAction() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative">
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 backdrop-blur-sm flex items-center justify-center">
            <Logo 
              className="h-10 w-10 text-primary" 
              variant="icon-only"
            />
          </div>
          
          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Ready to ship your SaaS?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join 10,000+ developers building successful products with our starter kit
            </p>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Production Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>7-Day Free Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span>Lifetime Updates</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="group h-14 px-8 text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link href="/pricing">
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 text-lg font-medium border-2 hover:bg-accent/50 transition-all duration-300"
              asChild
            >
              <Link href="/features">
                Explore Features
              </Link>
            </Button>
          </div>
          
          {/* Bottom Text */}
          {/* <p className="text-sm text-muted-foreground pt-4">
            No setup fees • Cancel anytime • Trusted by 2,500+ developers
          </p> */}
        </div>
      </div>
    </section>
  );
}