"use client";

import React, { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Check,
  Sparkles,
  Camera,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface PetPhotoUploadProps {
  onImageUpload: (file: File, url: string) => void;
  onBack: () => void;
}

interface UploadedFile {
  url: string;
  key: string;
  size: number;
  contentType: string;
  fileName: string;
}

export function PetPhotoUpload({ onImageUpload, onBack }: PetPhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file (JPG, PNG, or WEBP)");
      return;
    }

    // Validate file size (20MB limit)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 20MB");
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadComplete = (files: UploadedFile[]) => {
    if (files.length > 0 && selectedFile) {
      setIsUploading(false);
      setUploadProgress(100);
      toast.success("Photo uploaded successfully!");
      onImageUpload(selectedFile, files[0].url);
    }
  };

  const handleUploadError = () => {
    setIsUploading(false);
    setUploadProgress(0);
    toast.error("Upload failed. Please try again.");
  };

  const startUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create form data for upload
      const formData = new FormData();
      formData.append('files', selectedFile);
      
      // Upload to our file upload endpoint
      const response = await fetch('/api/upload/server-upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0 && data.results[0].success) {
          // Convert the response format to match our expected UploadedFile interface
          const uploadedFile = {
            url: data.results[0].url,
            key: data.results[0].key,
            size: data.results[0].size,
            contentType: data.results[0].contentType,
            fileName: data.results[0].fileName,
          };
          handleUploadComplete([uploadedFile]);
        } else {
          throw new Error(data.results?.[0]?.error || 'Upload failed');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(0);
      
      // Show specific error message to user
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(`Upload failed: ${errorMessage}`);
      
      handleUploadError();
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Start
        </Button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold">Upload Your Pet&apos;s Photo</h2>
          <p className="text-muted-foreground">
            Choose a clear, well-lit photo for the best artistic results
          </p>
        </div>
        
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          {!selectedFile ? (
            <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div
                  className="text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileSelect(e.dataTransfer.files);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="space-y-4">
                    <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Upload className="h-10 w-10 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Drop your photo here</h3>
                      <p className="text-muted-foreground mb-4">
                        or click to browse your files
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="secondary">JPG</Badge>
                        <Badge variant="secondary">PNG</Badge>
                        <Badge variant="secondary">WEBP</Badge>
                        <Badge variant="secondary">up to 20MB</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Selected Photo</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Selected pet photo"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{selectedFile.name}</span>
                    <span className="text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                  
                  {isUploading && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="w-full" />
                      <div className="text-xs text-center text-muted-foreground">
                        Uploading... {uploadProgress}%
                      </div>
                    </div>
                  )}
                </div>

                {!isUploading && uploadProgress < 100 && (
                  <div className="space-y-3">
                    <Button
                      onClick={startUpload}
                      className="w-full gap-2"
                      size="lg"
                      disabled={isUploading}
                    >
                      <ArrowRight className="h-4 w-4" />
                      Continue with this photo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearSelection}
                      className="w-full"
                    >
                      Choose different photo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Example Photos */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Example Photos
              </CardTitle>
              <CardDescription>
                Need inspiration? Click any example to see great photo quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 1, desc: "Clear front view, good lighting" },
                  { id: 2, desc: "Simple background, well focused" },
                  { id: 3, desc: "High resolution, sharp details" },
                  { id: 4, desc: "Natural pose, full pet visible" }
                ].map((example) => (
                  <div
                    key={example.id}
                    className="aspect-square rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center p-2 text-center"
                    title={example.desc}
                  >
                    <Camera className="h-8 w-8 text-muted-foreground mb-1" />
                    <div className="text-xs text-muted-foreground font-medium">
                      Example {example.id}
                    </div>
                    <div className="text-xs text-muted-foreground/70 mt-1 leading-tight">
                      {example.desc}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Photo Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">High Resolution</div>
                    <div className="text-sm text-muted-foreground">
                      At least 512x512 pixels for crisp artwork
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Clear Focus</div>
                    <div className="text-sm text-muted-foreground">
                      Your pet should be the main subject and well-lit
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Simple Background</div>
                    <div className="text-sm text-muted-foreground">
                      Avoid busy backgrounds for cleaner results
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Good Lighting</div>
                    <div className="text-sm text-muted-foreground">
                      Natural light works best, avoid flash
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">JPEG/JPG</div>
                    <div className="text-xs text-muted-foreground">Most common format</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">PNG</div>
                    <div className="text-xs text-muted-foreground">High quality</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">WEBP</div>
                    <div className="text-xs text-muted-foreground">Modern format</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    20
                  </div>
                  <div>
                    <div className="font-medium">MB Limit</div>
                    <div className="text-xs text-muted-foreground">Maximum size</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}