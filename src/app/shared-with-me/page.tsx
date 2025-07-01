/**
 * Shared with Me Page
 *
 * Displays files and folders that have been shared with the current user
 * Shows owner information and permission levels
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Folder, File, Eye, Download, Share } from "lucide-react";
import { formatDate } from "~/lib/file-utils";
import { AppSidebar } from "~/components/app-sidebar";
import { Header } from "~/components/header";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";

interface SharedFile {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  blobUrl: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  permission: "view" | "edit";
}

interface SharedFolder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  permission: "view" | "edit";
}

function SharedWithMeContent() {
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [sharedFolders, setSharedFolders] = useState<SharedFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSharedItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch shared files
      const filesResponse = await fetch("/api/files/shared-with-me");
      const filesData = (await filesResponse.json()) as {
        success: boolean;
        files?: SharedFile[];
        error?: string;
      };

      // Fetch shared folders
      const foldersResponse = await fetch("/api/folders/shared-with-me");
      const foldersData = (await foldersResponse.json()) as {
        success: boolean;
        folders?: SharedFolder[];
        error?: string;
      };

      if (filesResponse.ok && filesData.success) {
        setSharedFiles(filesData.files ?? []);
      }

      if (foldersResponse.ok && foldersData.success) {
        setSharedFolders(foldersData.folders ?? []);
      }

      if (!filesResponse.ok || !foldersResponse.ok) {
        setError("Failed to fetch shared items");
      }
    } catch (err) {
      setError("Failed to fetch shared items");
      console.error("Fetch shared items error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSharedItems();
  }, [fetchSharedItems]);

  const handleFileDownload = (file: SharedFile) => {
    try {
      const link = document.createElement("a");
      link.href = file.blobUrl;
      link.download = file.originalName;
      link.click();
    } catch (error) {
      console.error("Download error:", error);
      setError("Failed to download file");
    }
  };

  const handleFolderOpen = (folder: SharedFolder) => {
    // TODO: Navigate to shared folder view
    console.log("Opening shared folder:", folder.id);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getOwnerName = (owner: {
    firstName?: string;
    lastName?: string;
    email: string;
  }) => {
    if (owner.firstName && owner.lastName) {
      return `${owner.firstName} ${owner.lastName}`;
    }
    return owner.email;
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-auto">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="animate-pulse text-gray-600">
              Loading shared items...
            </p>
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
              <Share className="h-full w-full" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Error Loading Shared Items
            </h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => void fetchSharedItems()}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const hasSharedItems = sharedFiles.length > 0 || sharedFolders.length > 0;

  return (
    <main className="flex-1 overflow-auto">
      <div className="space-y-6 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Share className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Shared with me</h1>
          </div>
          <p className="text-gray-600">
            Files and folders that others have shared with you
          </p>
        </div>

        {!hasSharedItems ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Share className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No shared items yet
              </h3>
              <p className="text-gray-600">
                When others share files or folders with you, they&apos;ll appear
                here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Shared Folders */}
            {sharedFolders.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Shared Folders
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sharedFolders.map((folder) => (
                    <Card
                      key={folder.id}
                      className="transition-shadow hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Folder className="h-8 w-8 text-blue-500" />
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate font-medium text-gray-900">
                                {folder.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Shared by {getOwnerName(folder.owner)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatDate(folder.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                folder.permission === "edit"
                                  ? "default"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {folder.permission}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleFolderOpen(folder)}
                            className="flex-1"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Open
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Shared Files */}
            {sharedFiles.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Shared Files
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sharedFiles.map((file) => (
                    <Card
                      key={file.id}
                      className="transition-shadow hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <File className="h-8 w-8 text-gray-500" />
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate font-medium text-gray-900">
                                {file.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Shared by {getOwnerName(file.owner)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatFileSize(file.size)} •{" "}
                                {formatDate(file.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                file.permission === "edit"
                                  ? "default"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {file.permission}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFileDownload(file)}
                            className="flex-1"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SharedWithMePage() {
  const isMobile = useIsMobile();

  const handleFolderSelect = () => {
    // No-op for shared-with-me page since it doesn't use folder navigation
  };

  const handleCreateFolder = () => {
    // For shared-with-me page, navigate to the main drive page
    window.location.href = "/";
  };

  const handleUploadFiles = () => {
    // For shared-with-me page, navigate to the main drive page
    window.location.href = "/";
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gray-50 transition-all duration-300 ease-in-out">
        <AppSidebar
          currentFolderId={null}
          onFolderSelect={handleFolderSelect}
          onCreateFolder={handleCreateFolder}
          onUploadFiles={handleUploadFiles}
        />
        <SidebarInset className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
          <Header />
          <SharedWithMeContent />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
