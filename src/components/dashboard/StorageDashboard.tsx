/**
 * Storage Dashboard Component
 *
 * Displays storage usage analytics, recent files, and storage quota information
 * Provides insights into file activity and storage patterns
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  HardDrive,
  File,
  Folder,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Upload,
  Share2,
  Eye,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { FileRecord } from "~/types/file";

interface StorageStats {
  totalFiles: number;
  totalFolders: number;
  totalSize: number;
  usedStorage: number;
  storageLimit: number;
  recentActivity: Array<{
    id: string;
    type: "upload" | "download" | "share" | "delete" | "view";
    fileName: string;
    timestamp: string;
    fileSize?: number;
  }>;
  fileTypeDistribution: Record<string, number>;
  storageTrend: Array<{
    date: string;
    size: number;
  }>;
}

interface StorageDashboardProps {
  files: FileRecord[];
  folders: Array<{
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    parentId?: string;
  }>;
  className?: string;
}

export function StorageDashboard({
  files,
  folders,
  className,
}: StorageDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StorageStats | null>(null);

  // Calculate storage statistics
  const calculateStats = useMemo((): StorageStats => {
    const totalFiles = files.length;
    const totalFolders = folders.length;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    // Storage limit (15GB for demo - in production this would come from user plan)
    const storageLimit = 15 * 1024 * 1024 * 1024; // 15GB
    const usedStorage = totalSize;

    // File type distribution
    const fileTypeDistribution = files.reduce(
      (acc, file) => {
        const category = file.category ?? "unknown";
        acc[category] = (acc[category] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Recent activity (simulated - in production this would come from activity logs)
    const recentActivity = files.slice(0, 10).map((file, index) => ({
      id: file.id,
      type: ["upload", "view", "share"][index % 3] as
        | "upload"
        | "view"
        | "share",
      fileName: file.name,
      timestamp: new Date(Date.now() - index * 3600000).toISOString(), // Simulate recent activity
      fileSize: file.size,
    }));

    // Storage trend (simulated weekly data)
    const storageTrend = Array.from({ length: 7 }, (_, i) => {
      const daysAgo = 6 - i;
      const baseSize = Math.max(totalSize, 1024 * 1024); // Minimum 1MB
      // Add more visible variation for demo
      const randomFactor = 0.5 + Math.random(); // 0.5x to 1.5x
      const trend = baseSize * (1 + i * 0.15) * randomFactor;
      return {
        date:
          new Date(Date.now() - daysAgo * 24 * 3600000)
            .toISOString()
            .split("T")[0] ?? "",
        size: trend,
      };
    });

    return {
      totalFiles,
      totalFolders,
      totalSize,
      usedStorage,
      storageLimit,
      recentActivity,
      fileTypeDistribution,
      storageTrend,
    };
  }, [files, folders]);

  // Update stats when files/folders change
  useEffect(() => {
    setStats(calculateStats);
    setIsLoading(false);
  }, [calculateStats]);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="h-4 w-4 text-green-500" />;
      case "download":
        return <Download className="h-4 w-4 text-blue-500" />;
      case "share":
        return <Share2 className="h-4 w-4 text-purple-500" />;
      case "view":
        return <Eye className="h-4 w-4 text-orange-500" />;
      case "delete":
        return <Trash2 className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get storage usage percentage
  const storageUsagePercentage = stats
    ? (stats.usedStorage / stats.storageLimit) * 100
    : 0;

  // Get storage status color
  const getStorageStatusColor = (percentage: number) => {
    if (percentage < 70) return "text-green-600";
    if (percentage < 90) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 rounded bg-gray-200"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 rounded bg-gray-200"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Storage Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <HardDrive className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(stats.usedStorage)}
            </div>
            <p className="text-muted-foreground text-xs">
              of {formatFileSize(stats.storageLimit)} used
            </p>
            <Progress value={storageUsagePercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <File className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <p className="text-muted-foreground text-xs">
              <TrendingUp className="inline h-3 w-3 text-green-500" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Folders</CardTitle>
            <Folder className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFolders}</div>
            <p className="text-muted-foreground text-xs">
              <TrendingUp className="inline h-3 w-3 text-green-500" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Storage Status
            </CardTitle>
            <BarChart3 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                getStorageStatusColor(storageUsagePercentage),
              )}
            >
              {storageUsagePercentage.toFixed(1)}%
            </div>
            <p className="text-muted-foreground text-xs">
              {storageUsagePercentage < 70
                ? "Good"
                : storageUsagePercentage < 90
                  ? "Warning"
                  : "Critical"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Storage Usage and Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* File Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              File Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.fileTypeDistribution)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {type}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">{count} files</span>
                  </div>
                ))}
              {Object.keys(stats.fileTypeDistribution).length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No files uploaded yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  {getActivityIcon(activity.type)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {activity.fileName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {activity.type.charAt(0).toUpperCase() +
                        activity.type.slice(1)}
                      {activity.fileSize &&
                        ` • ${formatFileSize(activity.fileSize)}`}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              ))}
              {stats.recentActivity.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
