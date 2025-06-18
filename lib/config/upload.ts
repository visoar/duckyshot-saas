// Global upload configuration
export const UPLOAD_CONFIG = {
  // Maximum file size in bytes (50MB)
  MAX_FILE_SIZE: 50 * 1024 * 1024,

  // Maximum file size in MB for display
  MAX_FILE_SIZE_MB: 50,

  // Allowed file types
  ALLOWED_FILE_TYPES: [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",

    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Text files
    "text/plain",
    "text/csv",

    // Archives
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
  ],

  // Presigned URL expiration time in seconds (15 minutes)
  PRESIGNED_URL_EXPIRATION: 15 * 60,
} as const;

// Helper function to check if file type is allowed
export function isFileTypeAllowed(contentType: string): boolean {
  return UPLOAD_CONFIG.ALLOWED_FILE_TYPES.includes(
    contentType as (typeof UPLOAD_CONFIG.ALLOWED_FILE_TYPES)[number],
  );
}

// Helper function to check if file size is within limits
export function isFileSizeAllowed(size: number): boolean {
  return size <= UPLOAD_CONFIG.MAX_FILE_SIZE;
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Helper function to get file extension from content type
export function getFileExtension(contentType: string): string {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "text/plain": "txt",
    "text/csv": "csv",
    "application/zip": "zip",
    "application/x-rar-compressed": "rar",
    "application/x-7z-compressed": "7z",
  };

  return mimeToExt[contentType] || "bin";
}
