"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
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
import type { UploadedImageFile } from "@/lib/types/upload";

export type WorkflowStep = "upload" | "explore" | "generate" | "results";

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

interface WorkflowState {
  currentStep: WorkflowStep;
  uploadedImages?: UploadedImageFile[];
  selectedStyle?: AIStyle;
  generationSettings?: GenerationSettings;
  results?: ArtworkResult[];
  isGenerating: boolean;
  generationProgress: number;
  generationError?: string;
  pendingGeneration?: GenerationSettings; // Store generation settings for post-login execution
}

export function AIStudioWorkflow() {
  const { data: session } = useSession();
  const router = useRouter();
  const workflowRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<WorkflowState>({
    currentStep: "upload",
    isGenerating: false,
    generationProgress: 0,
  });

  const [userCredits, setUserCredits] = useState({ remaining: 0, total: 0 });
  const prevStepRef = useRef<WorkflowStep>("upload");
  const handleStartGenerationRef = useRef<((settings: GenerationSettings) => Promise<void>) | null>(null);

  // Save workflow state to localStorage for persistence across login
  const saveWorkflowState = useCallback((workflowState: Partial<WorkflowState>) => {
    if (typeof window !== 'undefined') {
      const stateToSave = {
        uploadedImages: workflowState.uploadedImages,
        selectedStyle: workflowState.selectedStyle,
        pendingGeneration: workflowState.pendingGeneration,
        currentStep: workflowState.currentStep,
      };
      localStorage.setItem('aiStudioWorkflowState', JSON.stringify(stateToSave));
    }
  }, []);

  // Load workflow state from localStorage
  const loadWorkflowState = useCallback(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('aiStudioWorkflowState');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          setState(prev => ({
            ...prev,
            ...parsedState,
            isGenerating: false,
            generationProgress: 0,
            generationError: undefined,
          }));
          return parsedState;
        } catch (error) {
          console.error('Failed to load workflow state:', error);
          localStorage.removeItem('aiStudioWorkflowState');
        }
      }
    }
    return null;
  }, []);

  // Clear saved workflow state
  const clearWorkflowState = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aiStudioWorkflowState');
    }
  }, []);

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

  // Load workflow state on component mount
  useEffect(() => {
    loadWorkflowState();
  }, [loadWorkflowState]);

  // Handle pending generation after user logs in
  useEffect(() => {
    if (session?.user && state.pendingGeneration && state.uploadedImages && state.uploadedImages.length > 0) {
      // User just logged in and has pending generation
      const pendingSettings = state.pendingGeneration;
      
      // Clear saved state and pending generation
      clearWorkflowState();
      setState(prev => ({
        ...prev,
        pendingGeneration: undefined,
      }));
      
      // Trigger the generation using the ref
      if (handleStartGenerationRef.current) {
        handleStartGenerationRef.current(pendingSettings);
      }
    }
  }, [session?.user, state.pendingGeneration, state.uploadedImages, clearWorkflowState]);

  // Auto-scroll to workflow top when step actually changes (not on initial mount)
  useEffect(() => {
    if (prevStepRef.current !== state.currentStep && workflowRef.current) {
      // Add small delay to ensure DOM has updated after state change
      requestAnimationFrame(() => {
        workflowRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      });
    }
    prevStepRef.current = state.currentStep;
  }, [state.currentStep]);

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
        // Update state with pending generation
        setState(prev => {
          const newState = {
            ...prev,
            pendingGeneration: settings,
            selectedStyle: settings.style,
          };
          // Save the state for post-login execution
          saveWorkflowState(newState);
          return newState;
        });
        
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

        // Start progress simulation while waiting for API
        const progressInterval = setInterval(() => {
          setState((prev) => {
            if (prev.generationProgress < 85) {
              return {
                ...prev,
                generationProgress: prev.generationProgress + 1,
              };
            }
            return prev;
          });
        }, 500); // Update every 500ms

        try {
          // Create an AbortController for timeout handling
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

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
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          clearInterval(progressInterval);
          setState((prev) => ({ ...prev, generationProgress: 90 }));

          if (!generateResponse.ok) {
            const errorData = await generateResponse.json();
            throw new Error(errorData.error || "AI generation failed");
          }

          const generationData = await generateResponse.json();

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
        } catch (apiError) {
          clearInterval(progressInterval);

          // Handle specific error types
          if (apiError instanceof Error) {
            if (apiError.name === "AbortError") {
              throw new Error(
                "AI generation timed out after 2 minutes. Please try again.",
              );
            } else if (apiError.message.includes("fetch")) {
              throw new Error(
                "Network error occurred. Please check your connection and try again.",
              );
            }
          }

          throw apiError;
        }

        // Reload user credits after successful generation
        await loadUserCredits();
      } catch (error) {
        console.error("Generation failed:", error);

        // Note: progressInterval is already cleared in the try-catch block above

        setState((prev) => ({
          ...prev,
          isGenerating: false,
          generationProgress: 0,
        }));

        // Reload user credits after failed generation (credits should be refunded)
        await loadUserCredits();

        // Set error state instead of alert
        setState((prev) => ({
          ...prev,
          generationError:
            error instanceof Error ? error.message : "Unknown error occurred",
        }));
      }
    },
    [state.uploadedImages, session?.user, router, loadUserCredits, saveWorkflowState],
  );

  // Update the ref whenever the function changes
  useEffect(() => {
    handleStartGenerationRef.current = handleStartGeneration;
  }, [handleStartGeneration]);

  const handleRestart = useCallback(async () => {
    setState({
      currentStep: "upload",
      isGenerating: false,
      generationProgress: 0,
    });

    // Clear saved workflow state
    clearWorkflowState();

    // Reload user credits when restarting to ensure fresh data
    await loadUserCredits();
  }, [loadUserCredits, clearWorkflowState]);

  // Clean step progress indicator
  const renderStepIndicator = () => {
    const steps = [
      { key: "upload", label: "Upload", icon: Upload },
      { key: "explore", label: "Style", icon: Palette },
      { key: "generate", label: "Generate", icon: Wand2 },
      { key: "results", label: "Results", icon: Sparkles },
    ];

    const currentIndex = steps.findIndex(
      (step) => step.key === state.currentStep,
    );

    return (
      <div className="mb-8 flex items-center justify-center">
        <div className="flex items-center space-x-2">
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
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant={
                      isActive
                        ? "default"
                        : isCompleted
                          ? "secondary"
                          : "outline"
                    }
                    size="sm"
                    className={cn(
                      "h-8 w-8 rounded-full p-0 transition-all",
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
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-4 h-px w-8 transition-colors",
                      isCompleted ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
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
            error={state.generationError}
            onRetry={() => {
              setState((prev) => ({ ...prev, generationError: undefined }));
              handleStartGeneration(state.generationSettings!);
            }}
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
          />
        );

      default:
        return null;
    }
  };

  return (
    <div ref={workflowRef} className="space-y-6">
      {/* Clean step indicator */}
      {renderStepIndicator()}

      {/* Main content */}
      <div className="min-h-[500px]">{renderStepContent()}</div>
    </div>
  );
}
