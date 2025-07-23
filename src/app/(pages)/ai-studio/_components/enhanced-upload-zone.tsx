"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Camera,
  Image as ImageIcon,
  X,
  RotateCw,
  Crop,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Zap,
  Heart,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface EnhancedUploadZoneProps {
  onImagesUpload: (files: UploadedImageFile[]) => void;
  maxFiles?: number;
  showExamples?: boolean;
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

interface ImagePreview {
  file: File;
  url: string;
  id: string;
  uploading: boolean;
  progress: number;
  qualityScore?: number;
  suggestions?: string[];
  uploadId?: string; // Added after successful upload
  key?: string; // Added after successful upload
}

const EXAMPLE_PHOTOS = [
  {
    id: "example1",
    url: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=400&fit=crop&crop=face",
    caption: "Perfect lighting, clear details",
    quality: "Excellent",
  },
  {
    id: "example2", 
    url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=face",
    caption: "Simple background, good focus",
    quality: "Great",
  },
  {
    id: "example3",
    url: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400&h=400&fit=crop&crop=face", 
    caption: "Natural pose, full pet visible",
    quality: "Good",
  },
  {
    id: "example4",
    url: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=400&fit=crop&crop=face",
    caption: "High resolution, sharp details", 
    quality: "Excellent",
  },
];

const PHOTO_TIPS = [
  { icon: Camera, text: "Use natural lighting when possible" },
  { icon: Crop, text: "Keep your pet centered in the frame" },
  { icon: CheckCircle, text: "Ensure the photo is sharp and in focus" },
  { icon: Heart, text: "Capture your pet's personality!" },
];

export function EnhancedUploadZone({ 
  onImagesUpload, 
  maxFiles = 5,
  showExamples = true 
}: EnhancedUploadZoneProps) {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photo quality analysis (simplified version)
  const analyzePhotoQuality = (file: File): Promise<{ score: number; suggestions: string[] }> => {
    return new Promise((resolve) => {
      const suggestions: string[] = [];
      let score = 85; // Base score

      // Simple heuristics based on file properties
      if (file.size < 100 * 1024) { // Less than 100KB
        suggestions.push("Consider using a higher resolution image for better results");
        score -= 15;
      }
      if (file.size > 10 * 1024 * 1024) { // Greater than 10MB
        suggestions.push("Large file - we'll optimize it for you");
        score -= 5;
      }

      // Simulate analysis delay for better UX
      setTimeout(() => {
        resolve({ score, suggestions });
      }, 1500);
    });
  };

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).slice(0, maxFiles - images.length);
    const newImages: ImagePreview[] = [];

    for (const file of fileArray) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        continue;
      }

      // Validate file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 20MB`);
        continue;
      }

      const id = `${Date.now()}-${Math.random()}`;
      const url = URL.createObjectURL(file);

      newImages.push({
        file,
        url,
        id,
        uploading: true,
        progress: 0,
      });
    }

    setImages(prev => [...prev, ...newImages]);

    // Process each image
    for (const imagePreview of newImages) {
      let progressInterval: NodeJS.Timeout | undefined;
      try {
        // Start upload simulation
        progressInterval = setInterval(() => {
          setImages(prev => prev.map(img => 
            img.id === imagePreview.id 
              ? { ...img, progress: Math.min(img.progress + 10, 90) }
              : img
          ));
        }, 200);

        // Analyze photo quality
        const analysis = await analyzePhotoQuality(imagePreview.file);

        // Upload to server
        const formData = new FormData();
        formData.append("files", imagePreview.file);

        const response = await fetch("/api/upload/server-upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0 && data.results[0].success) {
            const uploadResult = data.results[0];
            
            setImages(prev => prev.map(img => 
              img.id === imagePreview.id 
                ? { 
                    ...img, 
                    uploading: false, 
                    progress: 100,
                    qualityScore: analysis.score,
                    suggestions: analysis.suggestions,
                    uploadId: uploadResult.uploadId,
                    key: uploadResult.key
                  }
                : img
            ));

            // Create uploaded file object
            const uploadedFile: UploadedImageFile = {
              uploadId: uploadResult.uploadId,
              url: uploadResult.url,
              key: uploadResult.key,
              file: imagePreview.file,
              size: uploadResult.size,
              contentType: uploadResult.contentType,
              fileName: uploadResult.fileName,
              qualityScore: analysis.score,
              suggestions: analysis.suggestions,
            };

            toast.success(`${imagePreview.file.name} uploaded successfully!`);
          } else {
            throw new Error(data.results?.[0]?.error || "Upload failed");
          }
        } else {
          throw new Error(`Upload failed with status ${response.status}`);
        }
      } catch (error) {
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        console.error("Upload error:", error);
        
        setImages(prev => prev.filter(img => img.id !== imagePreview.id));
        
        const errorMessage = error instanceof Error ? error.message : "Upload failed";
        toast.error(`Failed to upload ${imagePreview.file.name}: ${errorMessage}`);
      }
    }
  }, [images.length, maxFiles]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter === 1) {
      setIsDragging(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const completedImages = images.filter(img => !img.uploading && img.progress === 100);
  const canProceed = completedImages.length > 0;

  const handleProceed = () => {
    // This function should only be called when files are properly uploaded
    // and have their uploadId from the server response
    const uploadedFiles: UploadedImageFile[] = completedImages
      .filter(img => img.uploadId) // Only include images with valid uploadId
      .map(img => ({
        uploadId: img.uploadId!,
        url: img.url,
        key: img.key || `temp-${img.id}`,
        file: img.file,
        size: img.file.size,
        contentType: img.file.type,
        fileName: img.file.name,
        qualityScore: img.qualityScore,
        suggestions: img.suggestions,
      }));
    
    onImagesUpload(uploadedFiles);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI Magic Awaits</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Upload Your Pet's Photos
        </h2>
        <p className="text-muted-foreground text-lg">
          Drop your photos here and watch the magic happen. Multiple photos = more artistic possibilities!
        </p>
      </div>

      {/* Main Upload Area */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Zone */}
          <Card
            className={cn(
              "relative border-2 border-dashed transition-all duration-300",
              isDragging 
                ? "border-primary bg-primary/5 scale-[1.02]" 
                : "border-muted-foreground/25 hover:border-primary/50",
              images.length === 0 && "min-h-[300px]"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <CardContent className="p-8">
              {images.length === 0 ? (
                // Empty state
                <div
                  className="text-center cursor-pointer space-y-6"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="relative">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 mx-auto flex h-24 w-24 items-center justify-center rounded-2xl">
                      <Upload className={cn(
                        "h-12 w-12 transition-all duration-300",
                        isDragging ? "text-primary scale-110" : "text-primary/80"
                      )} />
                    </div>
                    {isDragging && (
                      <div className="absolute inset-0 rounded-2xl bg-primary/10 animate-pulse" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-2">
                      {isDragging ? "Drop your photos here!" : "Drag & Drop Photos"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      or click to browse your files
                    </p>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        JPG, PNG, WEBP
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                        Up to {maxFiles} photos
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                        Max 20MB each
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                // Images grid
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      Your Photos ({completedImages.length}/{maxFiles})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={images.length >= maxFiles}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add More
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={image.url}
                            alt="Uploaded photo"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Remove button */}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(image.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>

                        {/* Upload progress */}
                        {image.uploading && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col items-center justify-center text-white">
                            <Zap className="h-6 w-6 mb-2 animate-pulse" />
                            <Progress value={image.progress} className="w-16 mb-1" />
                            <span className="text-xs">{image.progress}%</span>
                          </div>
                        )}

                        {/* Quality score */}
                        {!image.uploading && image.qualityScore && (
                          <div className="absolute bottom-2 left-2">
                            <Badge 
                              variant={image.qualityScore >= 80 ? "default" : "secondary"}
                              className={cn(
                                "text-xs",
                                image.qualityScore >= 80 && "bg-green-500 hover:bg-green-600",
                                image.qualityScore < 80 && image.qualityScore >= 60 && "bg-yellow-500 hover:bg-yellow-600",
                                image.qualityScore < 60 && "bg-red-500 hover:bg-red-600"
                              )}
                            >
                              {image.qualityScore >= 80 ? "Great!" : 
                               image.qualityScore >= 60 ? "Good" : "OK"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Quality suggestions */}
                  {completedImages.some(img => img.suggestions && img.suggestions.length > 0) && (
                    <Card className="bg-blue-50/50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 mb-2">Photo Tips</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              {completedImages
                                .filter(img => img.suggestions && img.suggestions.length > 0)
                                .map(img => img.suggestions!)
                                .flat()
                                .slice(0, 2)
                                .map((suggestion, i) => (
                                  <li key={i}>• {suggestion}</li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Proceed button */}
                  <Button
                    onClick={handleProceed}
                    disabled={!canProceed}
                    className="w-full h-12 text-base gap-2"
                    size="lg"
                  >
                    <ArrowRight className="h-5 w-5" />
                    Continue to Style Selection ({completedImages.length} photo{completedImages.length !== 1 ? 's' : ''})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Photo Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photo Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {PHOTO_TIPS.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <tip.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{tip.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Example Photos */}
          {showExamples && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Perfect Photo Examples
                </CardTitle>
                <CardDescription>
                  These types of photos work best with our AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {EXAMPLE_PHOTOS.map((example) => (
                    <div key={example.id} className="group relative">
                      <div className="aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={example.url}
                          alt={example.caption}
                          width={150}
                          height={150}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-2 left-2 right-2">
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-xs mb-1",
                              example.quality === "Excellent" && "bg-green-500 text-white",
                              example.quality === "Great" && "bg-blue-500 text-white",
                              example.quality === "Good" && "bg-yellow-500 text-white"
                            )}
                          >
                            {example.quality}
                          </Badge>
                          <p className="text-white text-xs font-medium leading-tight">
                            {example.caption}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}