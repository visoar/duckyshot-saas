"use client";

import { useEffect, useState, ReactNode } from "react";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { AdminTableBase } from "@/components/admin/admin-table-base";
import { UserAvatarCell } from "@/components/admin/user-avatar-cell";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: "user" | "admin" | "super_admin";
  createdAt: string;
  updatedAt: string;
  subscriptionStatus?: string;
  subscriptionId?: string;
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchUsers = async (page = 1, search = "", role = "all") => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
        ...(role !== "all" && { role }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
      setTotalUsers(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm, roleFilter);
  }, [currentPage, searchTerm, roleFilter]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, searchTerm, roleFilter);
  };

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
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
      setIsEditDialogOpen(false);
      setEditingUser(null);
      fetchUsers(currentPage, searchTerm, roleFilter);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      toast.success("User deleted successfully");
      fetchUsers(currentPage, searchTerm, roleFilter);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "destructive";
      case "admin":
        return "default";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: Array<{
    key: keyof User | string;
    label: string;
    render?: (item: User) => ReactNode;
  }> = [
    {
      key: "user",
      label: "User",
      render: (user: User) => (
        <UserAvatarCell
          name={user.name}
          email={user.email}
          image={user.image}
        />
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user: User) => (
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {user.role.replace("_", " ").toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (user: User) => (
        <Badge variant={user.emailVerified ? "outline" : "secondary"}>
          {user.emailVerified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "subscription",
      label: "Subscription",
      render: (user: User) =>
        user.subscriptionStatus ? (
          <Badge
            variant={
              user.subscriptionStatus === "active" ? "default" : "secondary"
            }
          >
            {user.subscriptionStatus.toUpperCase()}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">None</span>
        ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (user: User) => (
        <span className="text-sm">{formatDate(user.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user: User) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditUser(user)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteUser(user.id, user.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const roleFilterOptions = [
    { value: "all", label: "All Roles" },
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
    { value: "super_admin", label: "Super Admin" },
  ];

  return (
    <>
      <AdminTableBase<User>
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
        pagination={{
          page: currentPage,
          limit: 20, // Assuming a default limit, adjust if necessary
          total: totalUsers,
          totalPages: totalPages,
        }}
        onPageChange={handlePageChange}
        searchPlaceholder="Search users by name or email..."
        emptyMessage="No users found"
      />
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user account. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingUser.name}
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
                  onValueChange={(value: "user" | "admin" | "super_admin") =>
                    setEditingUser({ ...editingUser, role: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="verified" className="text-right">
                  Verified
                </Label>
                <Switch
                  id="verified"
                  checked={editingUser.emailVerified}
                  onCheckedChange={(checked) =>
                    setEditingUser({ ...editingUser, emailVerified: checked })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateUser}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
