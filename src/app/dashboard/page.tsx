/**
 * Dashboard Page
 *
 * Displays comprehensive storage analytics, recent activity, and storage quota information
 * Provides insights into file activity and storage patterns
 *
 * Note: This page uses the user&apos;s files and folders to generate analytics.
 */

"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Activity, HardDrive } from "lucide-react";
import { StorageDashboard } from "~/components/dashboard/StorageDashboard";
import type { FileRecord } from "~/types/file";
import { AppSidebar } from "~/components/app-sidebar";
import { Header } from "~/components/header";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";

interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
}

function DashboardContent() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch files and folders in parallel
      const [filesResponse, foldersResponse] = await Promise.all([
        fetch("/api/files"),
        fetch("/api/folders"),
      ]);

      const filesData = (await filesResponse.json()) as {
        success: boolean;
        files?: FileRecord[];
        error?: string;
      };

      const foldersData = (await foldersResponse.json()) as {
        success: boolean;
        folders?: Folder[];
        error?: string;
      };

      if (filesResponse.ok && filesData.success) {
        setFiles(filesData.files ?? []);
      } else {
        setError(filesData.error ?? "Failed to fetch files");
      }

      if (foldersResponse.ok && foldersData.success) {
        setFolders(foldersData.folders ?? []);
      } else {
        console.error("Failed to fetch folders:", foldersData.error);
      }
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error("Dashboard data fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 overflow-auto">
        <div className="space-y-6 p-4 lg:p-6">
          <div className="mb-8">
            <div className="mb-2 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-96 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded bg-gray-200"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 overflow-auto">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 text-red-500">
              <BarChart3 className="h-full w-full" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Dashboard Error
            </h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => void fetchData()}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="space-y-6 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Monitor your storage usage, track file activity, and manage your
            Drive efficiently.
          </p>
        </div>

        {/* Dashboard Content */}
        <StorageDashboard files={files} folders={folders} />

        {/* Additional Insights */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Storage Tips */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <div className="mb-3 flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Storage Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Regularly clean up unused files</li>
              <li>• Use folders to organize content</li>
              <li>• Compress large files when possible</li>
              <li>• Share files instead of duplicating</li>
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Quick Stats</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Average file size:</span>
                <span className="font-medium">
                  {files.length > 0
                    ? `${(files.reduce((sum, f) => sum + f.size, 0) / files.length / 1024 / 1024).toFixed(1)} MB`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Most common type:</span>
                <span className="font-medium">
                  {(() => {
                    const typeCount = files.reduce(
                      (acc, file) => {
                        const category = file.category ?? "unknown";
                        acc[category] = (acc[category] ?? 0) + 1;
                        return acc;
                      },
                      {} as Record<string, number>,
                    );
                    const mostCommon = Object.entries(typeCount).sort(
                      ([, a], [, b]) => b - a,
                    )[0];
                    return mostCommon ? mostCommon[0] : "N/A";
                  })()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Files this week:</span>
                <span className="font-medium">
                  {
                    files.filter((f) => {
                      const fileDate = new Date(f.createdAt);
                      const weekAgo = new Date(
                        Date.now() - 7 * 24 * 60 * 60 * 1000,
                      );
                      return fileDate > weekAgo;
                    }).length
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Activity Summary</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Today&apos;s uploads:</span>
                <span className="font-medium">
                  {
                    files.filter((f) => {
                      const fileDate = new Date(f.createdAt);
                      const today = new Date();
                      return fileDate.toDateString() === today.toDateString();
                    }).length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shared items:</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span>Last activity:</span>
                <span className="font-medium">
                  {files[0]?.createdAt
                    ? new Date(files[0].createdAt).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  const isMobile = useIsMobile();

  const handleFolderSelect = () => {
    // No-op for dashboard page since it doesn't use folder navigation
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gray-50 transition-all duration-300 ease-in-out">
        <AppSidebar
          currentFolderId={null}
          onFolderSelect={handleFolderSelect}
        />
        <SidebarInset className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
          <Header />
          <DashboardContent />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
