"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Users,
  CreditCard,
  Upload,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

// This type is also used by lib/admin/stats.ts
export interface AdminStats {
  users: {
    total: number;
    verified: number; // count(sql`CASE WHEN ${users.emailVerified} = true THEN 1 END`)

    admins: number; // count(sql`CASE WHEN ${users.role} IN ('admin', 'super_admin') THEN 1 END`)
  };
  subscriptions: {
    total: number;
    active: number; // count(sql`CASE WHEN ${subscriptions.status} = 'active' THEN 1 END`)

    canceled: number; // count(sql`CASE WHEN ${subscriptions.status} = 'canceled' THEN 1 END`)
  };
  payments: {
    total: number;
    totalRevenue: number;
    successful: number; // count(sql`CASE WHEN ${payments.status} = 'succeeded' THEN 1 END`)
  };
  uploads: {
    total: number;
    totalSize: number;
  };
}

interface AdminStatsCardsProps {
  initialStats: AdminStats;
}

export function AdminStatsCards({ initialStats }: AdminStatsCardsProps) {
  const [stats, setStats] = useState<AdminStats | null>(initialStats);
  const [loading, setLoading] = useState(!initialStats); // Set loading based on initialStats
  const [error, setError] = useState<string | null>(null);

  // useEffect to handle cases where initialStats might be null or undefined initially
  // and then fetched, or if we want to allow re-fetching on some other trigger later.
  // For now, if initialStats is provided, we don't fetch.
  useEffect(() => {
    if (!initialStats) {
      setLoading(true);
      async function fetchAdminStats() {
        try {
          const response = await fetch("/api/admin/stats", {
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch stats: ${response.status}`);
          }

          const data = await response.json();
          setStats(data);
        } catch (err) {
          console.error("Error fetching admin stats:", err);
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      }
      fetchAdminStats();
    } else {
      setStats(initialStats);
      setLoading(false);
    }
  }, [initialStats]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="bg-muted h-4 w-20 animate-pulse rounded" />
              <div className="bg-muted h-4 w-4 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="bg-muted h-8 w-16 animate-pulse rounded" />
              <div className="bg-muted mt-2 h-4 w-24 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-destructive flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Failed to load statistics: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount / 100); // Assuming amount is in cents
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.users.total.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {stats.users.verified} verified
            </Badge>
            <Badge variant="outline" className="text-xs">
              {stats.users.admins} admins
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Subscriptions
          </CardTitle>
          <Shield className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.subscriptions.active.toLocaleString()}
          </div>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <TrendingUp className="h-3 w-3 text-emerald-600" />
            {stats.subscriptions.total} total • {stats.subscriptions.canceled}{" "}
            canceled
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <CreditCard className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.payments.totalRevenue)}
          </div>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <TrendingUp className="h-3 w-3 text-emerald-600" />
            {stats.payments.successful} successful payments
          </p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">File Uploads</CardTitle>
          <Upload className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.uploads.total.toLocaleString()}
          </div>
          <p className="text-muted-foreground text-xs">
            {formatFileSize(stats.uploads.totalSize)} total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
