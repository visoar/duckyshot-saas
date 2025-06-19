"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
// Select components removed as they're now handled by AdminTableBase
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Eye, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { AdminTableBase } from "@/components/admin/admin-table-base";
import { UserAvatarCell } from "@/components/admin/user-avatar-cell";

interface Upload {
  id: string;
  userId: string;
  fileKey: string;
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface UploadsResponse {
  uploads: Upload[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function UploadManagementTable() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUploads, setTotalUploads] = useState(0);
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUpload, setDeletingUpload] = useState<Upload | null>(null);
  const [selectedUploads, setSelectedUploads] = useState<Set<string>>(
    new Set(),
  );
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  const fetchUploads = async (page = 1, search = "", fileType = "all") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
        ...(fileType !== "all" && { fileType }),
      });

      const response = await fetch(`/api/admin/uploads?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch uploads");
      }

      const data: UploadsResponse = await response.json();
      setUploads(data.uploads);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setTotalUploads(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads(currentPage, searchTerm, fileTypeFilter);
  }, [currentPage, searchTerm, fileTypeFilter]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFileTypeFilter = (value: string) => {
    setFileTypeFilter(value);
    setCurrentPage(1);
  };

  const handleDeleteUpload = async (upload: Upload) => {
    try {
      const response = await fetch(`/api/admin/uploads/${upload.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete upload");
      }

      toast.success(`File "${upload.fileName}" deleted successfully`);
      fetchUploads(currentPage, searchTerm, fileTypeFilter);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete upload",
      );
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingUpload(null);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedUploads.size === 0) return;

    setIsBatchDeleting(true);
    try {
      const response = await fetch("/api/admin/uploads/batch-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uploadIds: Array.from(selectedUploads),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete uploads");
      }

      const result = await response.json();

      if (result.failedDeletions > 0) {
        toast.warning(
          `Deleted ${result.deletedCount} files successfully, ${result.failedDeletions} failed`,
        );
      } else {
        toast.success(`Successfully deleted ${result.deletedCount} files`);
      }

      setSelectedUploads(new Set());
      fetchUploads(currentPage, searchTerm, fileTypeFilter);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete uploads",
      );
    } finally {
      setIsBatchDeleting(false);
      setIsBatchDeleteDialogOpen(false);
    }
  };

  const handleSelectUpload = (uploadId: string, checked: boolean) => {
    const newSelected = new Set(selectedUploads);
    if (checked) {
      newSelected.add(uploadId);
    } else {
      newSelected.delete(uploadId);
    }
    setSelectedUploads(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUploads(new Set(uploads.map((upload) => upload.id)));
    } else {
      setSelectedUploads(new Set());
    }
  };

  const isAllSelected =
    uploads.length > 0 && selectedUploads.size === uploads.length;
  const isPartiallySelected =
    selectedUploads.size > 0 && selectedUploads.size < uploads.length;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeFromMime = (contentType: string): string => {
    if (contentType.startsWith("image/")) return "Image";
    if (contentType.startsWith("video/")) return "Video";
    if (contentType.startsWith("audio/")) return "Audio";
    if (contentType.includes("pdf")) return "PDF";
    if (contentType.includes("text/")) return "Text";
    if (contentType.includes("application/")) {
      if (contentType.includes("zip") || contentType.includes("rar"))
        return "Archive";
      if (contentType.includes("json") || contentType.includes("xml"))
        return "Data";
    }
    return "Other";
  };

  const getFileTypeBadgeVariant = (contentType: string) => {
    const type = getFileTypeFromMime(contentType);
    switch (type) {
      case "Image":
        return "default";
      case "Video":
        return "secondary";
      case "Audio":
        return "outline";
      case "PDF":
        return "destructive";
      default:
        return "outline";
    }
  };

  const columns = [
    {
      key: "select",
      label: (
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={handleSelectAll}
          aria-label="Select all uploads"
          className={
            isPartiallySelected
              ? "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              : ""
          }
        />
      ),
      render: (upload: Upload) => (
        <Checkbox
          checked={selectedUploads.has(upload.id)}
          onCheckedChange={(checked) =>
            handleSelectUpload(upload.id, checked as boolean)
          }
          aria-label={`Select upload ${upload.fileName}`}
        />
      ),
    },
    {
      key: "user",
      label: "User",
      render: (upload: Upload) => (
        <UserAvatarCell
          name={upload.user.name}
          email={upload.user.email}
          image={upload.user.image}
        />
      ),
    },
    {
      key: "fileName",
      label: "File Name",
      render: (upload: Upload) => (
        <div className="max-w-[200px]">
          <div className="truncate font-medium">{upload.fileName}</div>
          <div className="text-muted-foreground truncate text-sm">
            {upload.fileKey}
          </div>
        </div>
      ),
    },
    {
      key: "contentType",
      label: "Type",
      render: (upload: Upload) => (
        <Badge variant={getFileTypeBadgeVariant(upload.contentType)}>
          {getFileTypeFromMime(upload.contentType)}
        </Badge>
      ),
    },
    {
      key: "fileSize",
      label: "Size",
      render: (upload: Upload) => (
        <span className="font-mono text-sm">
          {formatFileSize(upload.fileSize)}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Uploaded",
      render: (upload: Upload) => (
        <div className="text-sm">
          {new Date(upload.createdAt).toLocaleDateString()}
          <div className="text-muted-foreground text-xs">
            {new Date(upload.createdAt).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (upload: Upload) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedUpload(upload);
              setIsViewDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(upload.url, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const link = document.createElement("a");
              link.href = upload.url;
              link.download = upload.fileName;
              link.click();
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDeletingUpload(upload);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="text-destructive h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filterOptions = [
    { value: "all", label: "All Types" },
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
    { value: "audio", label: "Audio" },
    { value: "pdf", label: "PDF" },
    { value: "text", label: "Text" },
    { value: "archive", label: "Archives" },
    { value: "other", label: "Other" },
  ];

  return (
    <>
      {/* Batch Actions */}
      {selectedUploads.size > 0 && (
        <div className="bg-muted/50 mb-4 flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {selectedUploads.size} upload{selectedUploads.size > 1 ? "s" : ""}{" "}
              selected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedUploads(new Set())}
            >
              Clear Selection
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsBatchDeleteDialogOpen(true)}
              disabled={isBatchDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <AdminTableBase
        data={uploads}
        columns={columns}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        filterValue={fileTypeFilter}
        onFilterChange={handleFileTypeFilter}
        filterOptions={filterOptions}
        filterPlaceholder="Filter by type"
        pagination={{
          page: currentPage,
          limit: 20,
          total: totalUploads,
          totalPages: totalPages,
        }}
        onPageChange={setCurrentPage}
        searchPlaceholder="Search by filename, user email..."
        emptyMessage="No uploads found"
      />

      {/* View Upload Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Details</DialogTitle>
            <DialogDescription>
              View detailed information about this upload
            </DialogDescription>
          </DialogHeader>
          {selectedUpload && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">File Name</Label>
                  <p className="text-muted-foreground text-sm break-all">
                    {selectedUpload.fileName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">File Size</Label>
                  <p className="text-muted-foreground text-sm">
                    {formatFileSize(selectedUpload.fileSize)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Content Type</Label>
                  <p className="text-muted-foreground text-sm">
                    {selectedUpload.contentType}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Uploaded</Label>
                  <p className="text-muted-foreground text-sm">
                    {new Date(selectedUpload.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">User</Label>
                  <p className="text-muted-foreground text-sm">
                    {selectedUpload.user.name} ({selectedUpload.user.email})
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">File Key</Label>
                  <p className="text-muted-foreground text-sm break-all">
                    {selectedUpload.fileKey}
                  </p>
                </div>
              </div>

              {/* Preview for images */}
              {selectedUpload.contentType.startsWith("image/") && (
                <div>
                  <Label className="text-sm font-medium">Preview</Label>
                  <div className="bg-muted/50 mt-2 rounded-lg border p-4">
                    <img
                      src={selectedUpload.url}
                      alt={selectedUpload.fileName}
                      className="mx-auto max-h-64 max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                selectedUpload && window.open(selectedUpload.url, "_blank")
              }
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open File
            </Button>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Upload</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this upload? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {deletingUpload && (
            <div className="space-y-2">
              <p className="text-sm">
                <strong>File:</strong> {deletingUpload.fileName}
              </p>
              <p className="text-sm">
                <strong>User:</strong> {deletingUpload.user.name} (
                {deletingUpload.user.email})
              </p>
              <p className="text-sm">
                <strong>Size:</strong> {formatFileSize(deletingUpload.fileSize)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deletingUpload && handleDeleteUpload(deletingUpload)
              }
            >
              Delete Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Delete Confirmation Dialog */}
      <Dialog
        open={isBatchDeleteDialogOpen}
        onOpenChange={setIsBatchDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Multiple Uploads</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUploads.size} upload
              {selectedUploads.size > 1 ? "s" : ""}? This action cannot be
              undone and will permanently remove the files from both the
              database and storage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Selected uploads ({selectedUploads.size}):
            </p>
            <div className="max-h-32 space-y-1 overflow-x-hidden overflow-y-auto">
              {uploads
                .filter((upload) => selectedUploads.has(upload.id))
                .map((upload) => (
                  <div
                    key={upload.id}
                    className="text-muted-foreground flex max-w-md items-center justify-between text-sm"
                  >
                    <span className="max-w-sm truncate">{upload.fileName}</span>
                    <span className="text-xs">
                      {formatFileSize(upload.fileSize)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBatchDeleteDialogOpen(false)}
              disabled={isBatchDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBatchDelete}
              disabled={isBatchDeleting}
            >
              {isBatchDeleting
                ? "Deleting..."
                : `Delete ${selectedUploads.size} Upload${selectedUploads.size > 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
