'use client';

import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, FileIcon, ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Progress } from './progress';
import { Alert, AlertDescription } from './alert';
import { formatFileSize, isFileTypeAllowed, isFileSizeAllowed } from '@/lib/config/upload';

interface FileWithPreview extends File {
  preview?: string;
}

interface UploadedFile {
  url: string;
  key: string;
  size: number;
  contentType: string;
  fileName: string;
}

interface FileUploaderProps {
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  onUploadComplete?: (files: UploadedFile[]) => void;
  className?: string;
  disabled?: boolean;
  // Image compression options
  enableImageCompression?: boolean;
  imageCompressionQuality?: number; // 0.1 to 1.0
  imageCompressionMaxWidth?: number;
  imageCompressionMaxHeight?: number;
}

interface FileUploadState {
  file: FileWithPreview;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  uploadedFile?: UploadedFile;
}

export function FileUploader({
  acceptedFileTypes,
  maxFileSize,
  maxFiles = 1,
  onUploadComplete,
  className,
  disabled = false,
  enableImageCompression = false,
  imageCompressionQuality = 0.8,
  imageCompressionMaxWidth = 1920,
  imageCompressionMaxHeight = 1080,
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileUploadState[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (acceptedFileTypes && !acceptedFileTypes.includes(file.type)) {
        return `File type ${file.type} is not allowed`;
      }
      if (!isFileTypeAllowed(file.type)) {
        return `File type ${file.type} is not supported`;
      }

      // Check file size
      const sizeLimit = maxFileSize || 10 * 1024 * 1024; // Default 10MB
      if (file.size > sizeLimit) {
        return `File size ${formatFileSize(file.size)} exceeds limit of ${formatFileSize(sizeLimit)}`;
      }
      if (!isFileSizeAllowed(file.size)) {
        return `File size ${formatFileSize(file.size)} exceeds maximum allowed size`;
      }

      return null;
    },
    [acceptedFileTypes, maxFileSize]
  );

  const createPreview = useCallback((file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  }, []);

  // Image compression function
  const compressImage = useCallback(
    (file: File): Promise<File> => {
      return new Promise((resolve) => {
        if (!enableImageCompression || !file.type.startsWith('image/')) {
          resolve(file);
          return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          // Calculate new dimensions
          let { width, height } = img;
          
          if (width > imageCompressionMaxWidth) {
            height = (height * imageCompressionMaxWidth) / width;
            width = imageCompressionMaxWidth;
          }
          
          if (height > imageCompressionMaxHeight) {
            width = (width * imageCompressionMaxHeight) / height;
            height = imageCompressionMaxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            file.type,
            imageCompressionQuality
          );
        };

        img.onerror = () => resolve(file);
        img.src = URL.createObjectURL(file);
      });
    },
    [enableImageCompression, imageCompressionQuality, imageCompressionMaxWidth, imageCompressionMaxHeight]
  );

  // Test network connectivity
  const testNetworkConnectivity = async () => {
    try {
      const response = await fetch('/api/upload/test-cors', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Network test response:', response.status, await response.text());
      return response.ok;
    } catch (error) {
      console.error('Network connectivity test failed:', error);
      return false;
    }
  };

  const uploadFile = useCallback(async (fileState: FileUploadState, index: number) => {
    try {
      setFiles(prev => 
        prev.map((f, i) => 
          i === index ? { ...f, status: 'uploading' as const, progress: 0 } : f
        )
      );

      // Test network connectivity first
      const isConnected = await testNetworkConnectivity();
      if (!isConnected) {
        throw new Error('Network connectivity test failed. Please check your internet connection.');
      }

      // Prepare request data
      const requestData = {
        fileName: fileState.file.name,
        contentType: fileState.file.type,
        size: fileState.file.size,
      };
      
      // Debug log
      console.log('Uploading file:', {
        name: fileState.file.name,
        type: fileState.file.type,
        size: fileState.file.size,
        requestData,
      });
      
      // Validate request data before sending
      if (!requestData.fileName || !requestData.contentType || !requestData.size) {
        throw new Error(`Invalid file data: ${JSON.stringify(requestData)}`);
      }

      // Get presigned URL
      const response = await fetch('/api/upload/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to get upload URL. Server response:", errorData);
        let errorMessage = errorData.error || 'Failed to get upload URL';
        if (errorData.details) {
          errorMessage += ` Details: ${JSON.stringify(errorData.details)}`;
        }
        throw new Error(errorMessage);
      }

      const { presignedUrl, publicUrl, key } = await response.json();

      // Upload file to R2
      console.log('Uploading to presigned URL:', presignedUrl);
      
      let uploadResponse;
      try {
        uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: fileState.file,
          headers: {
            'Content-Type': fileState.file.type,
          },
        });
      } catch (fetchError) {
        console.error('Network error during upload:', fetchError);
        throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      }

      console.log('Upload response status:', uploadResponse.status);
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text().catch(() => 'Unable to read error response');
        console.error('Upload failed with status:', uploadResponse.status, 'Response:', errorText);
        throw new Error(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
      }

      const uploadedFile: UploadedFile = {
        url: publicUrl,
        key,
        size: fileState.file.size,
        contentType: fileState.file.type,
        fileName: fileState.file.name,
      };

      setFiles(prev => 
        prev.map((f, i) => 
          i === index 
            ? { 
                ...f, 
                status: 'completed' as const, 
                progress: 100,
                uploadedFile,
              } 
            : f
        )
      );

      return uploadedFile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setFiles(prev => 
        prev.map((f, i) => 
          i === index 
            ? { 
                ...f, 
                status: 'error' as const, 
                error: errorMessage,
              } 
            : f
        )
      );
      throw error;
    }
  }, []);

  const handleFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      setGlobalError(null);
      
      const fileArray = Array.from(newFiles);
      
      // Check max files limit
      if (files.length + fileArray.length > maxFiles) {
        setGlobalError(`Maximum ${maxFiles} file(s) allowed`);
        return;
      }

      // Validate and prepare files
      const validFiles: FileUploadState[] = [];
      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          setGlobalError(error);
          return;
        }

        // Compress image if enabled
        const processedFile = await compressImage(file);
        
        const fileWithPreview: FileWithPreview = Object.assign(processedFile, {
          preview: createPreview(processedFile),
        });

        validFiles.push({
          file: fileWithPreview,
          progress: 0,
          status: 'pending',
        });
      }

      // Add files to state
      setFiles(prev => [...prev, ...validFiles]);

      // Start uploading
      const uploadPromises = validFiles.map(async (fileState, relativeIndex) => {
        const absoluteIndex = files.length + relativeIndex;
        return uploadFile(fileState, absoluteIndex);
      });

      try {
        const uploadedFiles = await Promise.all(uploadPromises);
        onUploadComplete?.(uploadedFiles);
      } catch (error) {
        console.error('Upload error:', error);
      }
    },
    [files.length, maxFiles, validateFile, createPreview, compressImage, uploadFile, onUploadComplete]
  );

  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Revoke object URL to prevent memory leaks
      const fileToRemove = prev[index];
      if (fileToRemove.file.preview) {
        URL.revokeObjectURL(fileToRemove.file.preview);
      }
      return newFiles;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      if (disabled) return;
      
      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    },
    [disabled, handleFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        handleFiles(selectedFiles);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    },
    [handleFiles]
  );

  const openFileDialog = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8" />;
    }
    return <FileIcon className="h-8 w-8" />;
  };

  const acceptAttribute = acceptedFileTypes?.join(',') || undefined;

  return (
    <div className={cn('w-full', className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={acceptAttribute}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          'hover:border-primary/50 hover:bg-muted/50',
          isDragOver && 'border-primary bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed',
          files.length === 0 && 'min-h-[200px] flex items-center justify-center'
        )}
      >
        {files.length === 0 ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
            <p className="text-sm text-muted-foreground">
              {acceptedFileTypes
                ? `Accepted types: ${acceptedFileTypes.join(', ')}`
                : 'All file types accepted'}
            </p>
            {maxFileSize && (
              <p className="text-sm text-muted-foreground">
                Maximum size: {formatFileSize(maxFileSize)}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((fileState, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 border rounded-lg bg-background"
              >
                {/* File preview/icon */}
                <div className="flex-shrink-0">
                  {fileState.file.preview ? (
                    <img
                      src={fileState.file.preview}
                      alt={fileState.file.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center text-muted-foreground">
                      {getFileIcon(fileState.file.type)}
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileState.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(fileState.file.size)} • {fileState.file.type}
                  </p>
                  
                  {/* Progress bar */}
                  {fileState.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={fileState.progress} className="h-2" />
                    </div>
                  )}
                  
                  {/* Status */}
                  <div className="mt-1 flex items-center space-x-2">
                    {fileState.status === 'uploading' && (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-xs text-muted-foreground">Uploading...</span>
                      </>
                    )}
                    {fileState.status === 'completed' && (
                      <span className="text-xs text-green-600">✓ Uploaded</span>
                    )}
                    {fileState.status === 'error' && (
                      <span className="text-xs text-red-600">✗ {fileState.error}</span>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  disabled={fileState.status === 'uploading'}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {/* Add more files button */}
            {files.length < maxFiles && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                disabled={disabled}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Add {files.length > 0 ? 'More ' : ''}Files
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Global error */}
      {globalError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}