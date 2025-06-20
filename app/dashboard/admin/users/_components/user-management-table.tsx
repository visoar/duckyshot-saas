"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminTableBase } from "@/components/admin/admin-table-base";
import { UserAvatarCell } from "@/components/admin/user-avatar-cell";
import { userRoleEnum } from "@/database/schema";
import type { UserRole } from "@/lib/auth/permissions";
import { useAdminTable } from "@/hooks/use-admin-table";
import type { UserWithSubscription } from "@/types/billing";

interface UserManagementTableProps {
  initialData: UserWithSubscription[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function UserManagementTable({
  initialData,
  initialPagination,
}: UserManagementTableProps) {
  const router = useRouter();
  const {
    data: users,
    loading,
    error,
    pagination,
    searchTerm,
    filter: roleFilter,
    setSearchTerm: handleSearch,
    setFilter: handleRoleFilter,
    setCurrentPage: handlePageChange,
  } = useAdminTable<UserWithSubscription>({
    apiEndpoint: "/api/admin/users",
    dataKey: "users",
    filterKey: "role",
    initialFilter: "all",
    initialData,
    initialPagination,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithSubscription | null>(
    null,
  );

  const handleEditUser = (user: UserWithSubscription) => {
    setEditingUser({ ...user });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingUser.name,
          role: editingUser.role,
          emailVerified: editingUser.emailVerified,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }
      toast.success("User updated successfully");
      setEditingUser(null);
      router.refresh(); // Refresh page data to update stats
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: Array<{
    key: keyof UserWithSubscription | string;
    label: string;
    render?: (item: UserWithSubscription) => ReactNode;
  }> = [
    {
      key: "user",
      label: "User",
      render: (user) => (
        <UserAvatarCell
          name={user.name}
          email={user.email}
          image={user.image ?? undefined}
        />
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <Badge
          className="capitalize"
          variant={
            user.role === "admin" || user.role === "super_admin"
              ? "default"
              : "outline"
          }
        >
          {user.role}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Email Status",
      render: (user) => (
        <Badge variant={user.emailVerified ? "outline" : "default"}>
          {user.emailVerified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (user) => formatDate(user.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const roleFilterOptions = [
    { value: "all", label: "All Roles" },
    ...userRoleEnum.enumValues.map((role) => ({
      value: role,
      label: role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    })),
  ];

  return (
    <>
      <AdminTableBase<UserWithSubscription>
        columns={columns}
        data={users}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        filterValue={roleFilter}
        onFilterChange={handleRoleFilter}
        filterOptions={roleFilterOptions}
        filterPlaceholder="Filter by role"
        pagination={pagination}
        onPageChange={handlePageChange}
        searchPlaceholder="Search users by name or email..."
        emptyMessage="No users found"
      />
      <Dialog
        open={!!editingUser}
        onOpenChange={(isOpen) => !isOpen && setEditingUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingUser.name ?? ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value: UserRole) =>
                    setEditingUser({ ...editingUser, role: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoleEnum.enumValues.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.replace("_", " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="verified"
                  checked={!!editingUser.emailVerified}
                  onCheckedChange={(checked) =>
                    setEditingUser({ ...editingUser, emailVerified: checked })
                  }
                />
                <Label htmlFor="verified">Email Verified</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
