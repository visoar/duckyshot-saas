"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, HardDrive, FileText, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UploadStats {
  total: number;
  totalSize: number;
  totalSizeFormatted: string;
  averageSize: number;
  averageSizeFormatted: string;
  topFileTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  recentUploads: number; // uploads in last 24 hours
}

export function UploadStatsCards() {
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/uploads/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch upload statistics");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
              <div className="bg-muted mb-1 h-8 w-16 animate-pulse rounded" />
              <div className="bg-muted h-3 w-24 animate-pulse rounded" />
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
            <span>Failed to load upload statistics</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Uploads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
          <Upload className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.total.toLocaleString()}
          </div>
          <p className="text-muted-foreground text-xs">
            {stats.recentUploads} in last 24h
          </p>
        </CardContent>
      </Card>

      {/* Total Storage Used */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          <HardDrive className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSizeFormatted}</div>
          <p className="text-muted-foreground text-xs">
            Avg: {stats.averageSizeFormatted} per file
          </p>
        </CardContent>
      </Card>

      {/* Top File Type */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top File Type</CardTitle>
          <FileText className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.topFileTypes[0]?.type || "N/A"}
          </div>
          <p className="text-muted-foreground text-xs">
            {stats.topFileTypes[0]?.count || 0} files (
            {stats.topFileTypes[0]?.percentage || 0}%)
          </p>
        </CardContent>
      </Card>

      {/* File Types Distribution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">File Types</CardTitle>
          <FileText className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {stats.topFileTypes.slice(0, 3).map((type) => (
              <div
                key={type.type}
                className="flex items-center justify-between"
              >
                <Badge variant="outline" className="text-xs">
                  {type.type}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {type.count}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
