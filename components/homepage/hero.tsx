
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Star, Users, Zap, CheckCircle, Shield, Sparkles, BowArrow } from "lucide-react";
import { APP_DESCRIPTION, GITHUB_URL } from "@/constants";
import { Link } from "next-view-transitions";

export function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Status Badge */}
            <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm backdrop-blur-sm">
              <Sparkles className="mr-2 h-3 w-3 text-primary" />
              <span className="text-muted-foreground">Trusted by 10,000+ developers</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Build & Launch Your 
                <span className="block text-primary">SaaS in Days</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                {APP_DESCRIPTION}
                Everything you need to go from idea to revenue.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Production Ready</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Lightning Fast</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="group h-12 px-8 text-base font-medium"
                asChild
              >
                <Link href="/signup">
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="group h-12 px-8 text-base font-medium border-border hover:bg-accent"
                asChild
              >
                <Link href={GITHUB_URL} target="_blank">
                   <Github className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                   View on GitHub
                 </Link>
               </Button>
             </div>

             {/* Social Proof */}
             <div className="flex items-center gap-4 text-sm text-muted-foreground">
               <div className="flex items-center gap-2">
                 <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                 <span className="font-medium">4.9/5</span>
               </div>
               <div className="h-4 w-px bg-border" />
               <div className="flex items-center gap-2">
                 <Users className="h-4 w-4" />
                 <span>10,000+ developers</span>
               </div>
             </div>
           </div>

           {/* Right Visual */}
           <div className="relative lg:order-last">
             <div className="relative mx-auto max-w-lg">
               {/* Main Dashboard Preview */}
               <div className="relative rounded-xl border border-border bg-background/50 p-6 shadow-xl backdrop-blur-sm mr-6">
                 <div className="space-y-4">
                   {/* Header */}
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BowArrow className="h-4 w-4 text-primary" />
                       </div>
                       <div>
                         <div className="h-3 w-20 rounded bg-foreground/10" />
                         <div className="mt-1 h-2 w-16 rounded bg-muted-foreground/30" />
                       </div>
                     </div>
                     <div className="h-8 w-8 rounded-full bg-primary/20" />
                   </div>

                   {/* Stats Grid */}
                   <div className="grid grid-cols-2 gap-4">
                     <div className="rounded-lg border border-border/50 bg-background/30 p-3">
                       <div className="h-2 w-12 rounded bg-emerald-500/20 mb-2" />
                       <div className="h-4 w-16 rounded bg-foreground/10" />
                     </div>
                     <div className="rounded-lg border border-border/50 bg-background/30 p-3">
                       <div className="h-2 w-12 rounded bg-blue-500/20 mb-2" />
                       <div className="h-4 w-16 rounded bg-foreground/10" />
                     </div>
                   </div>

                   {/* Chart Area */}
                   <div className="rounded-lg border border-border/50 bg-background/30 p-4">
                     <div className="flex items-end gap-2 h-20">
                       {[40, 60, 45, 80, 55, 70, 85].map((height, i) => (
                         <div
                           key={i}
                           className="bg-primary/20 rounded-sm flex-1"
                           style={{ height: `${height}%` }}
                         />
                       ))}
                     </div>
                   </div>
                 </div>
               </div>

               {/* Floating Elements */}
               <div className="absolute -top-4 right-0 rounded-lg border border-border bg-background p-3 shadow-lg">
                 <div className="flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-emerald-500" />
                   <span className="text-xs font-medium">Live</span>
                 </div>
               </div>

               <div className="absolute -bottom-4 -left-4 rounded-lg border border-border bg-background p-3 shadow-lg">
                 <div className="flex items-center gap-2">
                   <Zap className="h-3 w-3 text-yellow-500" />
                   <span className="text-xs font-medium">Fast Deploy</span>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>
   );
 }
