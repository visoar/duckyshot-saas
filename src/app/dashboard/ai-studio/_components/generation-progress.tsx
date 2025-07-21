"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Wand2,
  Sparkles,
  Clock,
  Zap,
  Crown,
  Star,
  Palette,
  Brain,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { AIStyle } from "@/lib/ai/styles";
import type { GenerationSettings } from "./ai-studio-workflow";
import { isStylePremium } from "@/lib/ai/utils";
import { formatTime } from "@/lib/utils/time";

interface GenerationProgressProps {
  progress: number;
  selectedStyle: AIStyle;
  generationSettings: GenerationSettings;
}

// Fun facts about AI and pets to show during generation
const PET_FACTS = [
  "Did you know? Dogs can see some colors, but not as many as humans. They see blues and yellows best!",
  "Cats have a third eyelid called a nictitating membrane that protects their eyes.",
  "A group of pugs is called a 'grumble' - how cute is that?",
  "Dogs have about 300 million olfactory receptors, while humans only have 6 million.",
  "Cats can rotate their ears 180 degrees to better locate sounds.",
  "The average dog can learn about 150 words and can count up to 4 or 5.",
  "Cats purr at a frequency that can help heal bones and reduce pain.",
  "Dogs dream about familiar activities like playing outside or chasing their tail.",
  "A cat's brain is 90% similar to a human's brain.",
  "Dogs can be trained to detect diseases like cancer and diabetes through scent.",
];

const GENERATION_STAGES = [
  {
    name: "Analyzing",
    description: "Understanding your pet's unique features",
    icon: Brain,
    range: [0, 25],
  },
  {
    name: "Stylizing", 
    description: "Applying artistic transformations",
    icon: Palette,
    range: [25, 60],
  },
  {
    name: "Rendering",
    description: "Creating high-quality artwork",
    icon: ImageIcon,
    range: [60, 90],
  },
  {
    name: "Finalizing",
    description: "Adding finishing touches",
    icon: Sparkles,
    range: [90, 100],
  },
];

export function GenerationProgress({
  progress,
  selectedStyle,
  generationSettings,
}: GenerationProgressProps) {
  const [currentFact, setCurrentFact] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Rotate through facts every 5 seconds
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % PET_FACTS.length);
    }, 5000);

    return () => clearInterval(factInterval);
  }, []);

  // Track elapsed time
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Get current stage based on progress
  const getCurrentStage = () => {
    return GENERATION_STAGES.find(stage => 
      progress >= stage.range[0] && progress < stage.range[1]
    ) || GENERATION_STAGES[GENERATION_STAGES.length - 1];
  };

  const currentStage = getCurrentStage();
  const estimatedTotal = generationSettings.mode === "fast" ? 30 : 60;
  const estimatedRemaining = Math.max(0, estimatedTotal - timeElapsed);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Main Progress Animation */}
      <div className="text-center space-y-6">
        {/* Magic Wand Animation */}
        <div className="relative flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <Wand2 className="h-16 w-16 text-primary-foreground animate-bounce" />
          </div>
          
          {/* Floating Sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <Sparkles 
                key={i}
                className={cn(
                  "absolute h-4 w-4 text-yellow-400 animate-ping",
                  "opacity-75"
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Creating Your Masterpiece...
          </h2>
          
          <div className="space-y-3">
            <Progress value={progress} className="h-3 w-full" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{progress}% complete</span>
              <span className="text-muted-foreground">
                {estimatedRemaining > 0 ? `~${formatTime(estimatedRemaining)} remaining` : "Almost done!"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Stage */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <currentStage.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{currentStage.name}</h3>
              <p className="text-sm text-muted-foreground">{currentStage.description}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{progress}%</div>
              <div className="text-xs text-muted-foreground">
                {formatTime(timeElapsed)} elapsed
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Style Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Selected Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
                {selectedStyle.previewImageUrl ? (
                  <Image 
                    src={selectedStyle.previewImageUrl}
                    alt={selectedStyle.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Palette className="h-8 w-8 text-primary" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{selectedStyle.name}</span>
                  {isStylePremium(selectedStyle) && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{selectedStyle.category}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span>Images:</span>
                <span className="font-medium">{generationSettings.numImages}</span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <Badge variant="outline" className="text-xs">
                  {generationSettings.mode === "fast" ? (
                    <><Zap className="h-3 w-3 mr-1" />Fast</>
                  ) : (
                    <><Star className="h-3 w-3 mr-1" />Quality</>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Stages */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Generation Stages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {GENERATION_STAGES.map((stage) => {
                const Icon = stage.icon;
                const isCompleted = progress > stage.range[1];
                const isCurrent = progress >= stage.range[0] && progress < stage.range[1];
                const isUpcoming = progress < stage.range[0];

                return (
                  <div 
                    key={stage.name}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-all",
                      isCurrent && "bg-primary/10 border border-primary/20",
                      isCompleted && "opacity-60"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      isCompleted && "bg-green-500 text-white",
                      isCurrent && "bg-primary text-primary-foreground",
                      isUpcoming && "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? (
                        <Sparkles className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={cn(
                        "font-medium text-sm",
                        isCurrent && "text-primary"
                      )}>
                        {stage.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stage.description}
                      </div>
                    </div>
                    {isCurrent && (
                      <div className="text-xs font-medium text-primary">
                        In Progress
                      </div>
                    )}
                    {isCompleted && (
                      <div className="text-xs text-green-600 font-medium">
                        Complete
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fun Facts */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Did You Know?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            {PET_FACTS[currentFact]}
          </p>
          <div className="mt-3 flex justify-center">
            <div className="flex gap-1">
              {PET_FACTS.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentFact ? "bg-blue-600" : "bg-blue-300"
                  )}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}