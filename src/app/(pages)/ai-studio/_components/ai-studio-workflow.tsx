"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Palette, Wand2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { EnhancedUploadZone } from "./enhanced-upload-zone";
import { StyleExplorerGrid } from "./style-explorer-grid";
import { ImmersiveGenerationViewer } from "./immersive-generation-viewer";
import { SpectacularResultsShowcase } from "./spectacular-results-showcase";
import type { AIStyle } from "@/lib/ai/styles";

export type WorkflowStep =
  | "upload"
  | "explore"
  | "generate"
  | "results";

export interface GenerationSettings {
  numImages: number;
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

interface UploadedImageFile {
  uploadId: string; // UUID from database
  url: string;
  key: string;
  file: File;
  size: number;
  contentType: string;
  fileName: string;
  qualityScore?: number;
  suggestions?: string[];
}

interface WorkflowState {
  currentStep: WorkflowStep;
  uploadedImages?: UploadedImageFile[];
  selectedStyle?: AIStyle;
  generationSettings?: GenerationSettings;
  results?: ArtworkResult[];
  isGenerating: boolean;
  generationProgress: number;
}

export function AIStudioWorkflow() {
  const { data: session } = useSession();
  const router = useRouter();

  const [state, setState] = useState<WorkflowState>({
    currentStep: "upload",
    isGenerating: false,
    generationProgress: 0,
  });

  const [userCredits, setUserCredits] = useState({ remaining: 0, total: 0 });

  // Load user credits function (extracted for reuse)
  const loadUserCredits = useCallback(async () => {
    // Only load credits if user is logged in
    if (!session?.user) {
      setUserCredits({ remaining: 0, total: 0 });
      return;
    }

    try {
      const response = await fetch("/api/ai/credits");
      if (response.ok) {
        const data = await response.json();
        setUserCredits({
          remaining: data.remainingCredits || 0,
          total: data.totalCredits || 0,
        });
      }
    } catch (error) {
      console.error("Failed to load user credits:", error);
      setUserCredits({ remaining: 0, total: 0 });
    }
  }, [session?.user]);

  // Load user credits on component mount
  useEffect(() => {
    loadUserCredits();
  }, [loadUserCredits]);

  // Navigation handlers
  const goToStep = useCallback((step: WorkflowStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  // Workflow handlers
  const handleImagesUpload = useCallback((images: UploadedImageFile[]) => {
    setState((prev) => ({
      ...prev,
      uploadedImages: images,
      currentStep: "explore",
    }));
  }, []);


  const handleStartGeneration = useCallback(
    async (settings: GenerationSettings) => {
      if (!state.uploadedImages || state.uploadedImages.length === 0) return;

      // Check if user is logged in before starting generation
      if (!session?.user) {
        // Redirect to login with callback to return to AI Studio
        const callbackUrl = encodeURIComponent("/ai-studio");
        router.push(`/login?callbackUrl=${callbackUrl}`);
        return;
      }

      setState((prev) => ({
        ...prev,
        generationSettings: settings,
        currentStep: "generate",
        isGenerating: true,
        generationProgress: 0,
      }));

      try {
        // Use the first uploaded image
        const primaryImage = state.uploadedImages[0];
        setState((prev) => ({ ...prev, generationProgress: 10 }));

        // Since images are already uploaded, we can use the upload ID
        // from the database record created during upload
        const uploadId = primaryImage.uploadId;

        setState((prev) => ({ ...prev, generationProgress: 30 }));

        // Then call the AI generation API
        const generateResponse = await fetch("/api/ai/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uploadId: uploadId,
            styleId: settings.style.id,
            numImages: settings.numImages,
            petDescription: "", // Could be enhanced to get from user input
          }),
        });

        setState((prev) => ({ ...prev, generationProgress: 60 }));

        if (!generateResponse.ok) {
          const errorData = await generateResponse.json();
          throw new Error(errorData.error || "AI generation failed");
        }

        const generationData = await generateResponse.json();
        setState((prev) => ({ ...prev, generationProgress: 90 }));

        // Convert API response to ArtworkResult format
        const results: ArtworkResult[] =
          generationData.images?.map((imageUrl: string, i: number) => ({
            id: `${generationData.artworkId}-${i}`,
            url: imageUrl,
            originalImageUrl: primaryImage.url,
            style: settings.style,
            settings,
            createdAt: new Date(),
          })) || [];

        setState((prev) => ({
          ...prev,
          results,
          isGenerating: false,
          generationProgress: 100,
          currentStep: "results",
        }));

        // Reload user credits after successful generation
        await loadUserCredits();
      } catch (error) {
        console.error("Generation failed:", error);
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          generationProgress: 0,
        }));

        // Reload user credits after failed generation (credits should be refunded)
        await loadUserCredits();

        // You could add error handling UI here
        alert(
          `Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    },
    [
      state.uploadedImages,
      session?.user,
      router,
      loadUserCredits,
    ],
  );

  const handleRestart = useCallback(async () => {
    setState({
      currentStep: "upload",
      isGenerating: false,
      generationProgress: 0,
    });

    // Reload user credits when restarting to ensure fresh data
    await loadUserCredits();
  }, [loadUserCredits]);

  // Step progress indicator
  const renderStepIndicator = () => {
    const steps = [
      { key: "upload", label: "Upload", icon: Upload },
      { key: "explore", label: "Explore", icon: Palette },
      { key: "generate", label: "Generate", icon: Wand2 },
      { key: "results", label: "Results", icon: Sparkles },
    ];

    const currentIndex = steps.findIndex(
      (step) => step.key === state.currentStep,
    );

    return (
      <div className="mb-6 flex items-center justify-center space-x-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.key === state.currentStep;
          const isCompleted = index < currentIndex;
          const isAccessible =
            index <= currentIndex ||
            (state.uploadedImages && index <= 1) ||
            (state.selectedStyle && index <= 2);

          return (
            <div key={step.key} className="flex items-center">
              <Button
                variant={
                  isActive ? "default" : isCompleted ? "secondary" : "outline"
                }
                size="sm"
                className={cn(
                  "h-10 w-10 rounded-full p-0 transition-all",
                  isActive && "ring-primary ring-2 ring-offset-2",
                  !isAccessible && "cursor-not-allowed opacity-50",
                )}
                onClick={() =>
                  isAccessible && goToStep(step.key as WorkflowStep)
                }
                disabled={!isAccessible}
              >
                <Icon className="h-4 w-4" />
              </Button>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 w-8 transition-colors",
                    isCompleted ? "bg-primary" : "bg-muted",
                  )}
                />
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
      case "upload":
        return (
          <EnhancedUploadZone
            onImagesUpload={handleImagesUpload}
            maxFiles={5}
            showExamples={true}
          />
        );

      case "explore":
        return (
          <StyleExplorerGrid
            uploadedImages={state.uploadedImages!}
            onBack={() => goToStep("upload")}
            onStartGeneration={handleStartGeneration}
            userCredits={userCredits}
          />
        );

      case "generate":
        return (
          <ImmersiveGenerationViewer
            progress={state.generationProgress}
            selectedStyle={state.generationSettings!.style}
            generationSettings={state.generationSettings!}
            uploadedImageUrl={state.uploadedImages![0].url}
            onCancel={() => goToStep("explore")}
          />
        );

      case "results":
        return (
          <SpectacularResultsShowcase
            results={state.results!}
            originalImage={{
              url: state.uploadedImages![0].url,
              file: state.uploadedImages![0].file,
            }}
            onRestart={handleRestart}
            onBack={() => goToStep("explore")}
            onRemixStyle={(baseResult) => {
              // Navigate back to style selection with remix suggestion
              setState((prev) => ({ 
                ...prev, 
                currentStep: "explore",
                selectedStyle: baseResult.style 
              }));
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced step indicator */}
      {renderStepIndicator()}

      {/* Main content with better spacing */}
      <div className="min-h-[600px]">{renderStepContent()}</div>
    </div>
  );
}
