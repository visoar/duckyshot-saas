"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Palette,
  Wand2,
  Sparkles,
  Star,
  Play,
  History,
  Heart,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PetPhotoUpload } from "./pet-photo-upload";
import { StyleSelection } from "./style-selection";
import { GenerationProgress } from "./generation-progress";
import { ArtworkResults } from "./artwork-results";
import { QuickStart } from "./quick-start";
import type { AIStyle } from "@/lib/ai/styles";

export type WorkflowStep = "start" | "upload" | "style" | "generate" | "results";


export interface GenerationSettings {
  numImages: number;
  mode: "fast" | "quality";
  style: AIStyle;
}

export interface ArtworkResult {
  id: string;
  url: string;
  originalImageUrl: string;
  style: AIStyle;
  settings: GenerationSettings;
  createdAt: Date;
}

interface WorkflowState {
  currentStep: WorkflowStep;
  uploadedImage?: {
    url: string;
    file: File;
  };
  selectedStyle?: AIStyle;
  generationSettings?: GenerationSettings;
  results?: ArtworkResult[];
  isGenerating: boolean;
  generationProgress: number;
}

export function AIStudioWorkflow() {
  const [state, setState] = useState<WorkflowState>({
    currentStep: "start",
    isGenerating: false,
    generationProgress: 0,
  });

  const [userCredits, setUserCredits] = useState({ remaining: 0, total: 0 });

  // Load user credits function (extracted for reuse)
  const loadUserCredits = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/credits');
      if (response.ok) {
        const data = await response.json();
        setUserCredits({
          remaining: data.remainingCredits || 0,
          total: data.totalCredits || 0,
        });
      }
    } catch (error) {
      console.error('Failed to load user credits:', error);
    }
  }, []);

  // Load user credits on component mount
  useEffect(() => {
    loadUserCredits();
  }, [loadUserCredits]);

  // Navigation handlers
  const goToStep = useCallback((step: WorkflowStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);


  // Workflow handlers
  const handleImageUpload = useCallback((file: File, url: string) => {
    setState(prev => ({
      ...prev,
      uploadedImage: { file, url },
      currentStep: "style",
    }));
  }, []);

  const handleStyleSelect = useCallback((style: AIStyle) => {
    setState(prev => ({
      ...prev,
      selectedStyle: style,
    }));
  }, []);

  const handleStartGeneration = useCallback(async (settings: GenerationSettings) => {
    if (!state.uploadedImage || !state.selectedStyle) return;

    setState(prev => ({
      ...prev,
      generationSettings: settings,
      currentStep: "generate",
      isGenerating: true,
      generationProgress: 0,
    }));

    try {
      // First, upload the image to get an upload ID
      setState(prev => ({ ...prev, generationProgress: 10 }));
      
      const formData = new FormData();
      formData.append('files', state.uploadedImage.file);
      
      const uploadResponse = await fetch('/api/upload/server-upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }
      
      const uploadData = await uploadResponse.json();
      
      // Extract uploadId from the first successful upload result
      const successfulUpload = uploadData.results?.find((result: { success: boolean; uploadId?: string }) => result.success);
      if (!successfulUpload?.uploadId) {
        throw new Error('No successful upload found');
      }
      
      setState(prev => ({ ...prev, generationProgress: 30 }));

      // Then call the AI generation API
      const generateResponse = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uploadId: successfulUpload.uploadId,
          styleId: state.selectedStyle.id,
          numImages: settings.numImages,
          petDescription: 'adorable pet', // Could be enhanced to get from user input
        }),
      });

      setState(prev => ({ ...prev, generationProgress: 60 }));

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'AI generation failed');
      }

      const generationData = await generateResponse.json();
      setState(prev => ({ ...prev, generationProgress: 90 }));

      // Convert API response to ArtworkResult format
      const results: ArtworkResult[] = generationData.images?.map((imageUrl: string, i: number) => ({
        id: `${generationData.artworkId}-${i}`,
        url: imageUrl,
        originalImageUrl: state.uploadedImage!.url,
        style: state.selectedStyle!,
        settings,
        createdAt: new Date(),
      })) || [];

      setState(prev => ({
        ...prev,
        results,
        isGenerating: false,
        generationProgress: 100,
        currentStep: "results",
      }));

      // Reload user credits after successful generation
      await loadUserCredits();

    } catch (error) {
      console.error('Generation failed:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        generationProgress: 0,
      }));
      
      // Reload user credits after failed generation (credits should be refunded)
      await loadUserCredits();
      
      // You could add error handling UI here
      alert(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [state.uploadedImage, state.selectedStyle, loadUserCredits]);

  const handleRestart = useCallback(async () => {
    setState({
      currentStep: "start",
      isGenerating: false,
      generationProgress: 0,
    });
    
    // Reload user credits when restarting to ensure fresh data
    await loadUserCredits();
  }, [loadUserCredits]);

  // Step progress indicator
  const renderStepIndicator = () => {
    const steps = [
      { key: "start", label: "Start", icon: Play },
      { key: "upload", label: "Upload", icon: Upload },
      { key: "style", label: "Style", icon: Palette },
      { key: "generate", label: "Generate", icon: Wand2 },
      { key: "results", label: "Results", icon: Sparkles },
    ];

    const currentIndex = steps.findIndex(step => step.key === state.currentStep);

    return (
      <div className="flex items-center justify-center space-x-4 mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === state.currentStep;
          const isCompleted = index < currentIndex;
          const isAccessible = index <= currentIndex || 
            (state.uploadedImage && index <= 2) || 
            (state.selectedStyle && index <= 3);

          return (
            <div key={step.key} className="flex items-center">
              <Button
                variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "h-10 w-10 rounded-full p-0 transition-all",
                  isActive && "ring-2 ring-primary ring-offset-2",
                  !isAccessible && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => isAccessible && goToStep(step.key as WorkflowStep)}
                disabled={!isAccessible}
              >
                <Icon className="h-4 w-4" />
              </Button>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "h-0.5 w-8 mx-2 transition-colors",
                  isCompleted ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Main content renderer
  const renderStepContent = () => {
    switch (state.currentStep) {
      case "start":
        return (
          <QuickStart 
            onGetStarted={() => goToStep("upload")}
            userCredits={userCredits}
          />
        );

      case "upload":
        return (
          <PetPhotoUpload 
            onImageUpload={handleImageUpload}
            onBack={() => goToStep("start")}
          />
        );

      case "style":
        return (
          <StyleSelection
            uploadedImage={state.uploadedImage!}
            selectedStyle={state.selectedStyle}
            onStyleSelect={handleStyleSelect}
            onStartGeneration={handleStartGeneration}
            onBack={() => goToStep("upload")}
            userCredits={userCredits}
          />
        );

      case "generate":
        return (
          <GenerationProgress
            progress={state.generationProgress}
            selectedStyle={state.selectedStyle!}
            generationSettings={state.generationSettings!}
          />
        );

      case "results":
        return (
          <ArtworkResults
            results={state.results!}
            originalImage={state.uploadedImage!}
            onRestart={handleRestart}
            onBack={() => goToStep("style")}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Credits indicator */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="gap-2">
            <Sparkles className="h-3 w-3" />
            {userCredits.remaining} credits remaining
          </Badge>
        </div>

        {/* Quick stats */}
        <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-pink-500" />
            AI-powered pet art
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            Professional quality
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-orange-500" />
            Multiple styles
          </div>
        </div>
      </div>

      {/* Step indicator */}
      {renderStepIndicator()}

      {/* Main content */}
      <div className="min-h-[600px]">
        {renderStepContent()}
      </div>
    </div>
  );
}