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
import { Folder, File, Eye, Edit, Download, Share } from "lucide-react";
import { formatDate } from "~/lib/file-utils";

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

export default function SharedWithMePage() {
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
      <div className="container mx-auto max-w-6xl p-6">
        <div className="text-center">Loading shared items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-6xl p-6">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  const hasSharedItems = sharedFiles.length > 0 || sharedFolders.length > 0;

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Shared with me
        </h1>
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
                        <Badge
                          variant="outline"
                          className={`${
                            folder.permission === "edit"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-blue-200 bg-blue-50 text-blue-700"
                          }`}
                        >
                          {folder.permission === "edit" ? (
                            <>
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </>
                          ) : (
                            <>
                              <Eye className="mr-1 h-3 w-3" />
                              View
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleFolderOpen(folder)}
                          className="flex-1"
                        >
                          <Folder className="mr-1 h-4 w-4" />
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
              <div className="space-y-3">
                {sharedFiles.map((file) => (
                  <Card
                    key={file.id}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <File className="h-8 w-8 text-gray-500" />
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-medium text-gray-900">
                              {file.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Shared by {getOwnerName(file.owner)} •{" "}
                              {formatFileSize(file.size)} • {file.mimeType}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(file.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${
                              file.permission === "edit"
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-blue-200 bg-blue-50 text-blue-700"
                            }`}
                          >
                            {file.permission === "edit" ? (
                              <>
                                <Edit className="mr-1 h-3 w-3" />
                                Edit
                              </>
                            ) : (
                              <>
                                <Eye className="mr-1 h-3 w-3" />
                                View
                              </>
                            )}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFileDownload(file)}
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Download
                          </Button>
                        </div>
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
  );
}
