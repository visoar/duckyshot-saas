"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Eye, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminTableBase } from "@/components/admin/admin-table-base";
import { UserAvatarCell } from "@/components/admin/user-avatar-cell";
import { formatFileSize } from "@/lib/config/upload";
import { useAdminTable } from "@/hooks/use-admin-table";

interface Upload {
  id: string;
  userId: string;
  fileKey: string;
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

interface UploadManagementTableProps {
  initialData: Upload[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function UploadManagementTable({
  initialData,
  initialPagination,
}: UploadManagementTableProps) {
  const router = useRouter();
  const {
    data: uploads,
    loading,
    error,
    pagination,
    searchTerm,
    filter: fileTypeFilter,
    setSearchTerm: handleSearch,
    setFilter: handleFileTypeFilter,
    setCurrentPage,
  } = useAdminTable<Upload>({
    apiEndpoint: "/api/admin/uploads",
    dataKey: "uploads",
    filterKey: "fileType",
    initialData,
    initialPagination,
  });

  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [uploadToDelete, setUploadToDelete] = useState<Upload | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUploads, setSelectedUploads] = useState<Set<string>>(
    new Set(),
  );
  const [isBatchDeleteConfirmOpen, setIsBatchDeleteConfirmOpen] =
    useState(false);

  const confirmDeleteUpload = async () => {
    if (!uploadToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/uploads/${uploadToDelete.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete upload");
      toast.success("Upload deleted successfully");
      setUploadToDelete(null);
      router.refresh(); // Refresh page data to update stats
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete upload",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedUploads.size === 0) return;
    setIsDeleting(true);
    try {
      const response = await fetch("/api/admin/uploads/batch-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadIds: Array.from(selectedUploads) }),
      });
      if (!response.ok) throw new Error("Failed to delete uploads");

      const result = await response.json();
      if (result.failedDeletions > 0) {
        toast.warning(
          `Deleted ${result.deletedCount} files, ${result.failedDeletions} failed.`,
        );
      } else {
        toast.success(`Successfully deleted ${result.deletedCount} files`);
      }
      setSelectedUploads(new Set());
      setIsBatchDeleteConfirmOpen(false);
      router.refresh(); // Refresh page data to update stats
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete uploads",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectUpload = (uploadId: string, checked: boolean) => {
    setSelectedUploads((prev) => {
      const newSelected = new Set(prev);
      if (checked) newSelected.add(uploadId);
      else newSelected.delete(uploadId);
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedUploads(new Set(uploads.map((u) => u.id)));
    else setSelectedUploads(new Set());
  };

  const isAllSelected =
    uploads.length > 0 && selectedUploads.size === uploads.length;
  const isPartiallySelected =
    selectedUploads.size > 0 && selectedUploads.size < uploads.length;

  const columns: Array<{
    key: string;
    label: ReactNode;
    render: (item: Upload) => ReactNode;
  }> = [
      {
        key: "select",
        label: (
          <Checkbox
            checked={isAllSelected || (isPartiallySelected && "indeterminate")}
            onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
          />
        ),
        render: (upload) => (
          <Checkbox
            checked={selectedUploads.has(upload.id)}
            onCheckedChange={(checked) =>
              handleSelectUpload(upload.id, Boolean(checked))
            }
          />
        ),
      },
      {
        key: "user",
        label: "User",
        render: (upload) => (
          <UserAvatarCell
            name={upload.user.name}
            email={upload.user.email}
            image={upload.user.image}
          />
        ),
      },
      {
        key: "fileName",
        label: "File",
        render: (upload) => (
          <div>
            <p className="max-w-xs truncate font-medium">{upload.fileName}</p>
            <p className="text-muted-foreground text-xs">
              {formatFileSize(upload.fileSize)}
            </p>
          </div>
        ),
      },
      {
        key: "createdAt",
        label: "Uploaded",
        render: (upload) => (
          <p className="text-sm">
            {new Date(upload.createdAt).toLocaleDateString()}
          </p>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (upload) => (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedUpload(upload);
                setIsViewDialogOpen(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(upload.url, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setUploadToDelete(upload)}
              disabled={isDeleting}
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
      {selectedUploads.size > 0 && (
        <div className="bg-muted/50 mb-4 flex items-center justify-between rounded-lg border p-3">
          <span className="text-sm font-medium">
            {selectedUploads.size} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsBatchDeleteConfirmOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}
      <AdminTableBase<Upload>
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
        pagination={pagination}
        onPageChange={setCurrentPage}
        searchPlaceholder="Search by filename, user email..."
        emptyMessage="No uploads found"
      />

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Details</DialogTitle>
          </DialogHeader>
          {selectedUpload && (
            <div className="space-y-4 py-4">
              {selectedUpload.contentType.startsWith("image/") && (
                <img
                  src={selectedUpload.url}
                  alt={selectedUpload.fileName}
                  className="max-h-64 w-full rounded-md object-contain"
                />
              )}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <Label>File Name</Label>
                <p className="truncate text-sm">{selectedUpload.fileName}</p>
                <Label>Size</Label>
                <p className="text-sm">
                  {formatFileSize(selectedUpload.fileSize)}
                </p>
                <Label>User</Label>
                <p className="truncate text-sm">{selectedUpload.user.email}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Single Delete Confirmation Dialog */}
      <Dialog
        open={!!uploadToDelete}
        onOpenChange={(isOpen) => !isOpen && setUploadToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action is
              irreversible.
              <div className="group hover:bg-gray-100 rounded-md cursor-pointer">
                <p className="mt-2 font-medium max-w-md truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:text-clip">
                  this-is-another-super-long-file-name-that-will-be-truncated-by-default.zip
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteUpload}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Delete Confirmation Dialog */}
      <Dialog
        open={isBatchDeleteConfirmOpen}
        onOpenChange={setIsBatchDeleteConfirmOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Batch Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUploads.size} selected
              file(s)? This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBatchDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBatchDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}