"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Eye,
  Lightbulb,
  Heart,
  Camera,
  Layers,
  Activity,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { AIStyle } from "@/lib/ai/styles";
import type { GenerationSettings } from "./ai-studio-workflow";
import { isStylePremium } from "@/lib/ai/utils";

interface ImmersiveGenerationViewerProps {
  progress: number;
  selectedStyle: AIStyle;
  generationSettings: GenerationSettings;
  uploadedImageUrl: string;
  onCancel?: () => void;
}

// Enhanced generation stages with more granular steps
const GENERATION_STAGES = [
  {
    name: "Analyzing Pet",
    description: "Understanding your pet's unique features and characteristics",
    icon: Brain,
    range: [0, 15],
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    details: ["Detecting facial features", "Analyzing pose and composition", "Understanding lighting"],
  },
  {
    name: "Preparing Canvas",
    description: "Setting up the artistic foundation",
    icon: Layers,
    range: [15, 30],
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    details: ["Creating base layers", "Preparing color palette", "Setting composition guides"],
  },
  {
    name: "Applying Style",
    description: "Transforming with artistic techniques",
    icon: Palette,
    range: [30, 70],
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    details: ["Applying brush techniques", "Blending colors", "Creating texture"],
  },
  {
    name: "Adding Details",
    description: "Refining and enhancing the artwork",
    icon: Eye,
    range: [70, 90],
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    details: ["Sharpening features", "Adding highlights", "Perfecting shadows"],
  },
  {
    name: "Final Touches",
    description: "Polishing the masterpiece",
    icon: Sparkles,
    range: [90, 100],
    color: "text-pink-500", 
    bgColor: "bg-pink-500/10",
    details: ["Final color grading", "Adding artistic flourishes", "Quality optimization"],
  },
];

// Motivational messages that rotate during generation
const MOTIVATIONAL_MESSAGES = [
  "Every great artwork starts with a single brushstroke... 🎨",
  "Your pet is being transformed by AI magic... ✨",
  "Creating something beautiful takes time and care... 💖",
  "Art is not what you see, but what you make others see... 👁️",
  "The best is yet to come, hang in there! 🌟",
  "Masterpieces are never rushed, they're crafted with love... 💝",
  "Your patience is creating something extraordinary... 🚀",
  "Great art captures the soul - we're capturing your pet's... 🎭",
];

// Style-specific enhancement messages
const getStyleSpecificMessage = (styleName: string) => {
  const styleMessages: Record<string, string[]> = {
    "Oil Painting": [
      "Mixing virtual oil paints on the digital palette... 🎨",
      "Creating rich, textured brushstrokes... 🖌️",
      "Building layers like the masters did... 🏛️",
    ],
    "Watercolor": [
      "Letting digital watercolors flow naturally... 💧",
      "Creating soft, dreamy washes of color... ☁️",
      "Embracing the beauty of controlled chaos... 🌈",
    ],
    "Van Gogh Style": [
      "Channeling Van Gogh's passionate brushwork... 🌻",
      "Creating those iconic swirling patterns... 🌀",
      "Adding post-impressionist magic... ✨",
    ],
    "Anime": [
      "Drawing in kawaii style with big, expressive eyes... 👁️",
      "Creating those perfect anime proportions... 📐",
      "Adding that special anime sparkle... ⭐",
    ],
    "Cyberpunk": [
      "Charging up the neon lights... ⚡",
      "Adding futuristic glowing effects... 🌆",
      "Creating that dystopian sci-fi atmosphere... 🤖",
    ],
    "Studio Ghibli": [
      "Channeling Miyazaki's magical world... 🧚",
      "Creating that soft, dreamy Ghibli glow... 🌙",
      "Adding whimsical fantasy elements... 🦋",
    ],
  };

  const messages = styleMessages[styleName] || MOTIVATIONAL_MESSAGES;
  return messages[Math.floor(Math.random() * messages.length)];
};

export function ImmersiveGenerationViewer({
  progress,
  selectedStyle,
  generationSettings,
  uploadedImageUrl,
  onCancel,
}: ImmersiveGenerationViewerProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [styleMessage, setStyleMessage] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentDetail, setCurrentDetail] = useState(0);

  // Get current stage based on progress
  const currentStage = useMemo(() => {
    return (
      GENERATION_STAGES.find(
        (stage) => progress >= stage.range[0] && progress <= stage.range[1],
      ) || GENERATION_STAGES[GENERATION_STAGES.length - 1]
    );
  }, [progress]);

  // Rotate through motivational messages every 4 seconds
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
    }, 4000);

    return () => clearInterval(messageInterval);
  }, []);

  // Update style-specific message every 6 seconds
  useEffect(() => {
    const updateStyleMessage = () => {
      setStyleMessage(getStyleSpecificMessage(selectedStyle.name));
    };

    updateStyleMessage(); // Set initial message

    const styleMessageInterval = setInterval(updateStyleMessage, 6000);
    return () => clearInterval(styleMessageInterval);
  }, [selectedStyle.name]);

  // Rotate through current stage details
  useEffect(() => {
    if (currentStage?.details) {
      const detailInterval = setInterval(() => {
        setCurrentDetail((prev) => (prev + 1) % currentStage.details.length);
      }, 2500);

      return () => clearInterval(detailInterval);
    }
  }, [currentStage]);

  // Track elapsed time
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const estimatedTotal = 30;
  const estimatedRemaining = Math.max(0, estimatedTotal - timeElapsed);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Simplified Progress */}
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <Wand2 className="h-12 w-12 text-primary animate-pulse" />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Creating Your Artwork
          </h2>

          <div className="space-y-3">
            <Progress value={progress} className="h-3" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{progress}% complete</span>
              <span>
                {estimatedRemaining > 0
                  ? `~${Math.floor(estimatedRemaining / 60)}:${(estimatedRemaining % 60).toString().padStart(2, '0')} remaining`
                  : "Almost ready!"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Stage */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <currentStage.icon className="text-primary h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{currentStage.name}</h3>
              <p className="text-muted-foreground text-sm">
                {currentStage.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{progress}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simple motivational message */}
      <div className="text-center">
        <p className="text-muted-foreground animate-pulse">
          {MOTIVATIONAL_MESSAGES[currentMessage]}
        </p>
      </div>

      {/* Cancel Button (Optional) */}
      {onCancel && progress < 90 && (
        <div className="text-center">
          <Button variant="outline" onClick={onCancel} className="gap-2">
            <X className="h-4 w-4" />
            Cancel Generation
          </Button>
        </div>
      )}
    </div>
  );
}