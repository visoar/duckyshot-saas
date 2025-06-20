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
import { userRoleEnum } from "@/database/schema";
import type { UserRole } from "@/lib/auth/permissions";
import type { User } from "better-auth";

interface UserWithSubscription extends User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  subscriptions: {
    subscriptionId: string;
    status: string;
  }[];
}

interface UsersResponse {
  users: UserWithSubscription[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function UserManagementTable() {
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [editingUser, setEditingUser] = useState<UserWithSubscription | null>(
    null,
  );
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
      const { users: fetchedUsers, pagination } = data;
      setUsers(
        fetchedUsers.map((user) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        })),
      );
      setCurrentPage(pagination.page);
      setTotalPages(pagination.totalPages);
      setTotalUsers(pagination.total);
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
  };

  const handleEditUser = (user: UserWithSubscription) => {
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
      render: (user: UserWithSubscription) => (
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
      render: (user: UserWithSubscription) => (
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {user.role.replace("_", " ").toUpperCase()}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Email Status",
      render: (user: UserWithSubscription) => (
        <Badge variant={user.emailVerified ? "outline" : "secondary"}>
          {user.emailVerified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      key: "subscription",
      label: "Subscriptions",
      render: (user: UserWithSubscription) =>
        user.subscriptions.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {user.subscriptions.map((subscription) => (
              <Badge
                key={subscription.subscriptionId}
                variant={
                  subscription.status === "active"
                    ? "default"
                    : subscription.status === "past_due"
                      ? "destructive"
                      : "secondary"
                }
                className="text-xs"
              >
                {subscription.status.toUpperCase()}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">None</span>
        ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (user: UserWithSubscription) => (
        <span className="text-sm">{formatDate(user.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user: UserWithSubscription) => (
        <div className="flex items-center justify-start space-x-2">
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
                        {role
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
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
