"use client";

import React, {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
  memo,
} from "react";
import {
  Upload,
  X,
  FileIcon,
  ImageIcon,
  Loader2,
  FileText,
  FileArchive,
  FileAudio,
  FileVideo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Progress } from "./progress";
import { Alert, AlertDescription } from "./alert";
import {
  UPLOAD_CONFIG,
  formatFileSize,
  isFileTypeAllowed,
  isFileSizeAllowed,
} from "@/lib/config/upload";
import { useAnnouncement } from "@/hooks/use-announcement";
import {
  generateA11yId,
  createUploadInstructions,
  handleActivationKey,
  UPLOAD_MESSAGES,
} from "@/lib/utils/accessibility";

// --- 类型定义 ---
interface FileWithPreview extends File {
  preview?: string;
  _id?: string;
}

interface UploadedFile {
  url: string;
  key: string;
  size: number;
  contentType: string;
  fileName: string;
}

interface FileUploadState {
  file: FileWithPreview;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  uploadedFile?: UploadedFile;
  id: string;
}

interface ProcessedFileResult {
  file: File;
  preview?: string;
}

// --- 辅助函数与组件 ---

const getFileTypeIcon = (contentType: string): React.ReactNode => {
  if (contentType.startsWith("image/"))
    return <ImageIcon className="h-8 w-8 text-gray-500" />;
  if (contentType.startsWith("video/"))
    return <FileVideo className="h-8 w-8 text-gray-500" />;
  if (contentType.startsWith("audio/"))
    return <FileAudio className="h-8 w-8 text-gray-500" />;
  if (
    contentType.startsWith("application/zip") ||
    contentType.includes("compressed")
  )
    return <FileArchive className="h-8 w-8 text-gray-500" />;
  if (contentType === "application/pdf" || contentType.startsWith("text/"))
    return <FileText className="h-8 w-8 text-gray-500" />;
  return <FileIcon className="h-8 w-8 text-gray-500" />;
};

const FilePreview = memo(
  ({ file }: { file: FileWithPreview }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      setHasError(false);
    }, [file._id]);

    const handleImageError = useCallback(() => {
      setHasError(true);
    }, []);

    if (!file.preview || hasError) {
      return (
        <div className="text-muted-foreground flex h-12 w-12 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
          {getFileTypeIcon(file.type)}
        </div>
      );
    }

    return (
      <img
        src={file.preview}
        alt={file.name}
        className="h-12 w-12 rounded object-contain"
        onError={handleImageError}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.file._id === nextProps.file._id &&
      prevProps.file.preview === nextProps.file.preview
    );
  },
);
FilePreview.displayName = "FilePreview";

const FileItem = memo(
  ({
    fileState,
    onRemove,
    announce,
  }: {
    fileState: FileUploadState;
    onRemove: (fileId: string) => void;
    announce: (message: string, priority?: "polite" | "assertive") => void;
  }) => {
    const handleRemove = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        announce(UPLOAD_MESSAGES.fileRemoved(fileState.file.name));
        onRemove(fileState.id);
      },
      [fileState.id, fileState.file.name, onRemove, announce],
    );

    React.useEffect(() => {
      if (fileState.status === "completed") {
        announce(UPLOAD_MESSAGES.uploadSuccess(fileState.file.name));
      } else if (fileState.status === "error" && fileState.error) {
        announce(
          UPLOAD_MESSAGES.uploadError(fileState.file.name, fileState.error),
          "assertive",
        );
      }
    }, [fileState.status, fileState.file.name, fileState.error, announce]);

    const progressId = useMemo(() => generateA11yId("progress"), []);
    const statusId = useMemo(() => generateA11yId("status"), []);

    return (
      <div
        className="bg-background flex items-center space-x-4 rounded-lg border p-4"
        role="listitem"
        aria-describedby={`${progressId} ${statusId}`}
      >
        <FilePreview file={fileState.file} />
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm font-medium"
            aria-label={`File: ${fileState.file.name}`}
          >
            {fileState.file.name}
          </p>
          <p
            className="text-muted-foreground text-xs"
            aria-label={`Size: ${formatFileSize(fileState.file.size)}, Type: ${fileState.file.type}`}
          >
            {formatFileSize(fileState.file.size)} • {fileState.file.type}
          </p>
          {fileState.status === "uploading" && (
            <div className="mt-2">
              <Progress
                value={fileState.progress}
                className="h-2"
                aria-labelledby={progressId}
              />
              <div id={progressId} className="sr-only">
                Upload progress: {fileState.progress}%
              </div>
            </div>
          )}
          <div className="mt-1 flex items-center space-x-2" id={statusId}>
            {fileState.status === "uploading" && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                <span
                  className="text-muted-foreground text-xs"
                  aria-live="polite"
                >
                  Uploading... {fileState.progress}%
                </span>
              </>
            )}
            {fileState.status === "completed" && (
              <span
                className="text-xs text-green-600"
                role="status"
                aria-live="polite"
              >
                ✓ Uploaded successfully
              </span>
            )}
            {fileState.status === "error" && (
              <span
                className="text-xs text-red-600"
                role="alert"
                aria-live="assertive"
              >
                ✗ {fileState.error}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={fileState.status === "uploading"}
          className="flex-shrink-0"
          aria-label={`Remove ${fileState.file.name}`}
          title={`Remove ${fileState.file.name}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.fileState.id === nextProps.fileState.id &&
      prevProps.fileState.status === nextProps.fileState.status &&
      prevProps.fileState.progress === nextProps.fileState.progress &&
      prevProps.fileState.error === nextProps.fileState.error
    );
  },
);
FileItem.displayName = "FileItem";

// --- 主组件 ---

interface FileUploaderProps {
  acceptedFileTypes?: readonly string[];
  maxFileSize?: number;
  maxFiles?: number;
  onUploadComplete?: (files: UploadedFile[]) => void;
  className?: string;
  disabled?: boolean;
  enableImageCompression?: boolean;
  imageCompressionQuality?: number;
  imageCompressionMaxWidth?: number;
  imageCompressionMaxHeight?: number;
}

function FileUploaderComponent({
  acceptedFileTypes = UPLOAD_CONFIG.ALLOWED_FILE_TYPES,
  maxFileSize = UPLOAD_CONFIG.MAX_FILE_SIZE,
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
  const objectUrlsRef = useRef<Set<string>>(new Set());
  const { announce, announcementRef } = useAnnouncement();
  const uploadInstructionsId = useMemo(
    () => generateA11yId("upload-instructions"),
    [],
  );
  const dropZoneId = useMemo(() => generateA11yId("drop-zone"), []);

  useEffect(() => {
    const urlsToCleanup = objectUrlsRef.current;
    return () => {
      urlsToCleanup.forEach(URL.revokeObjectURL);
      urlsToCleanup.clear();
    };
  }, []);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (acceptedFileTypes && !acceptedFileTypes.includes(file.type)) {
        return `File type ${file.type} is not allowed.`;
      }
      if (!isFileTypeAllowed(file.type)) {
        return `File type ${file.type} is not supported.`;
      }
      if (file.size > maxFileSize) {
        return `File size ${formatFileSize(file.size)} exceeds limit of ${formatFileSize(maxFileSize)}.`;
      }
      if (!isFileSizeAllowed(file.size)) {
        return `File size exceeds the application's maximum limit of ${formatFileSize(UPLOAD_CONFIG.MAX_FILE_SIZE)}.`;
      }
      return null;
    },
    [acceptedFileTypes, maxFileSize],
  );
  
  const processAndPreviewFile = useCallback(
    (file: File): Promise<ProcessedFileResult> => {
      return new Promise((resolve) => {
        const isImage = file.type.startsWith("image/");
        const isCompressible =
          isImage && enableImageCompression && file.type !== "image/svg+xml";

        // Case 1: Compressible image
        if (isCompressible) {
          const img = new window.Image();
          const objectUrl = URL.createObjectURL(file);

          img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const canvas = document.createElement("canvas");
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
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              // Handle potential null context
              resolve({ file });
              return;
            }
            ctx.drawImage(img, 0, 0, width, height);

            // Generate a reliable Data URL for the preview
            const preview = canvas.toDataURL(
              file.type,
              imageCompressionQuality,
            );

            canvas.toBlob(
              (blob) => {
                const compressedFile = blob
                  ? new File([blob], file.name, {
                      type: file.type,
                      lastModified: Date.now(),
                    })
                  : file;
                resolve({ file: compressedFile, preview });
              },
              file.type,
              imageCompressionQuality,
            );
          };
          img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve({ file }); // Resolve with original file if image fails to load
          };
          img.src = objectUrl;
          return;
        }

        // Case 2: Non-compressible image or other file types
        if (isImage) {
          // For SVG, use FileReader to get a reliable Data URL
          if (file.type === "image/svg+xml") {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({ file, preview: reader.result as string });
            };
            reader.onerror = () => resolve({ file });
            reader.readAsDataURL(file);
          } else {
            // For other non-compressed images, create an Object URL
            const objectUrl = URL.createObjectURL(file);
            objectUrlsRef.current.add(objectUrl);
            resolve({ file, preview: objectUrl });
          }
        } else {
          // For non-image files, no preview is generated
          resolve({ file });
        }
      });
    },
    [
      enableImageCompression,
      imageCompressionQuality,
      imageCompressionMaxWidth,
      imageCompressionMaxHeight,
    ],
  );

  const handleFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      setGlobalError(null);
      const fileArray = Array.from(newFiles);

      if (files.length + fileArray.length > maxFiles) {
        setGlobalError(`Maximum ${maxFiles} file(s) allowed`);
        announce(UPLOAD_MESSAGES.fileLimitExceeded(maxFiles), "assertive");
        return;
      }

      const preparedFiles: FileUploadState[] = [];
      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          setGlobalError(error);
          announce(
            UPLOAD_MESSAGES.validationError(file.name, error),
            "assertive",
          );
          return; // Stop processing on first validation error
        }

        const { file: processedFile, preview } =
          await processAndPreviewFile(file);
        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const fileWithPreview: FileWithPreview = Object.assign(processedFile, {
          preview,
          _id: fileId,
        });

        preparedFiles.push({
          file: fileWithPreview,
          progress: 0,
          status: "pending",
          id: fileId,
        });
      }

      setFiles((prev) => [...prev, ...preparedFiles]);
    },
    [files.length, maxFiles, validateFile, processAndPreviewFile, announce],
  );

  // This useEffect remains largely the same, handling the upload queue.
  useEffect(() => {
    const uploadFile = async (
      fileState: FileUploadState,
    ): Promise<UploadedFile | null> => {
      const { id, file } = fileState;
      try {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: "uploading" } : f)),
        );
        announce(UPLOAD_MESSAGES.uploadStart(file.name));

        const response = await fetch("/api/upload/presigned-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get upload URL");
        }

        const { presignedUrl, publicUrl, key } = await response.json();
        const xhr = new XMLHttpRequest();
        let lastAnnouncedProgress = 0;

        const uploadPromise = new Promise<UploadedFile>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setFiles((prev) =>
                prev.map((f) => (f.id === id ? { ...f, progress } : f)),
              );
              if (progress >= lastAnnouncedProgress + 25 && progress < 100) {
                lastAnnouncedProgress = progress;
                announce(UPLOAD_MESSAGES.uploadProgress(file.name, progress));
              }
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const uploadedFile: UploadedFile = {
                url: publicUrl,
                key,
                size: file.size,
                contentType: file.type,
                fileName: file.name,
              };
              resolve(uploadedFile);
            } else {
              reject(
                new Error(`Upload failed: ${xhr.statusText || "Server error"}`),
              );
            }
          });
          xhr.addEventListener("error", () =>
            reject(new Error("Upload failed: Network error")),
          );
          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });

        const uploadedFile = await uploadPromise;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, status: "completed", uploadedFile, progress: 100 }
              : f,
          ),
        );
        return uploadedFile;
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, status: "error", error: (error as Error).message }
              : f,
          ),
        );
        return null;
      }
    };

    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length > 0) {
      Promise.all(pendingFiles.map(uploadFile)).then((results) => {
        const successfulUploads = results.filter(
          (r): r is UploadedFile => r !== null,
        );
        if (onUploadComplete && successfulUploads.length > 0) {
          onUploadComplete(successfulUploads);
        }
      });
    }
  }, [files, onUploadComplete, announce]);

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.file.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.file.preview);
        objectUrlsRef.current.delete(fileToRemove.file.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  }, []);

  const openFileDialog = useCallback(() => {
    if (!disabled) fileInputRef.current?.click();
  }, [disabled]);
  const acceptAttribute = useMemo(
    () =>
      Array.isArray(acceptedFileTypes)
        ? acceptedFileTypes.join(",")
        : undefined,
    [acceptedFileTypes],
  );
  const uploadInstructions = useMemo(
    () =>
      createUploadInstructions({
        maxFiles,
        maxFileSize,
        acceptedFileTypes: acceptedFileTypes as string[],
      }),
    [maxFiles, maxFileSize, acceptedFileTypes],
  );
  const handleDropZoneKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      handleActivationKey(e, () => {
        if (!disabled) openFileDialog();
      });
    },
    [disabled, openFileDialog],
  );
  const handleDragOverWithAnnouncement = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!isDragOver) {
        setIsDragOver(true);
        announce(UPLOAD_MESSAGES.dragEnter);
      }
    },
    [isDragOver, announce],
  );
  const handleDragLeaveWithAnnouncement = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      announce(UPLOAD_MESSAGES.dragLeave);
    },
    [announce],
  );
  const handleDropWithAnnouncement = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled || !e.dataTransfer.files) return;
      announce(UPLOAD_MESSAGES.filesSelected(e.dataTransfer.files.length));
      handleFiles(e.dataTransfer.files);
    },
    [disabled, announce, handleFiles],
  );
  const handleFileInputChangeWithAnnouncement = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        announce(UPLOAD_MESSAGES.filesSelected(e.target.files.length));
        handleFiles(e.target.files);
      }
      e.target.value = "";
    },
    [announce, handleFiles],
  );

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={announcementRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={acceptAttribute}
        onChange={handleFileInputChangeWithAnnouncement}
        className="hidden"
        disabled={disabled}
        aria-describedby={uploadInstructionsId}
        aria-label={`File upload input. ${uploadInstructions}`}
      />
      <div id={uploadInstructionsId} className="sr-only">
        {uploadInstructions}
      </div>
      <div
        id={dropZoneId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`File drop zone. ${uploadInstructions} Press Enter or Space to select files.`}
        aria-describedby={uploadInstructionsId}
        onDragOver={handleDragOverWithAnnouncement}
        onDragLeave={handleDragLeaveWithAnnouncement}
        onDrop={handleDropWithAnnouncement}
        onClick={openFileDialog}
        onKeyDown={handleDropZoneKeyDown}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors",
          "hover:border-primary/50 hover:bg-muted/50 focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:outline-none",
          isDragOver && "border-primary bg-primary/5",
          disabled && "cursor-not-allowed opacity-50",
          files.length === 0 &&
            "flex min-h-[200px] items-center justify-center",
        )}
      >
        {files.length === 0 ? (
          <div className="text-center">
            <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="mb-2 text-lg font-medium">
              Drop files here or click to upload
            </p>
            <p className="text-muted-foreground text-sm">
              {maxFiles > 1 ? `Up to ${maxFiles} files, ` : ""}max{" "}
              {formatFileSize(maxFileSize)}.
            </p>
          </div>
        ) : (
          <div className="space-y-4" role="list" aria-label="Selected files">
            {files.map((fileState) => (
              <FileItem
                key={fileState.id}
                fileState={fileState}
                onRemove={removeFile}
                announce={announce}
              />
            ))}
            {files.length < maxFiles && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                disabled={disabled}
                className="w-full"
                aria-label={`Add ${files.length > 0 ? "more " : ""}files for upload`}
              >
                <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
                Add {files.length > 0 ? "More " : ""}Files
              </Button>
            )}
          </div>
        )}
      </div>
      {globalError && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export const FileUploader = memo(FileUploaderComponent);