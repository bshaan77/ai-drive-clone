"use client";

import type React from "react";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ChevronRight,
  Plus,
  Upload,
  X,
  AlertCircle,
  Folder,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { useFileUpload } from "~/hooks/use-file-upload";
import { useFileSelection } from "~/hooks/useFileSelection";
import { UploadModal } from "~/components/upload-modal";
import { BulkActionsToolbar } from "~/components/file-display/BulkActionsToolbar";
import { RenameDialog } from "~/components/file-display/RenameDialog";
import { BulkContextMenu } from "~/components/file-display/BulkContextMenu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import type { FileRecord } from "~/types/file";
import { CreateFolderDialog } from "~/components/file-display/CreateFolderDialog";
import { FolderCard } from "~/components/file-display/FolderCard";
import { FileCard } from "~/components/file-display/FileCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SearchBar } from "~/components/search-bar";

interface MainContentProps {
  currentFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

export function MainContent({
  currentFolderId,
  onFolderSelect,
}: MainContentProps) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [sortField, setSortField] = useState<
    "name" | "size" | "createdAt" | "category"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [renameDialog, setRenameDialog] = useState<{
    isOpen: boolean;
    file: FileRecord | null;
  }>({ isOpen: false, file: null });
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState<{
    isOpen: boolean;
    fileIds: string[];
  }>({ isOpen: false, fileIds: [] });
  const [createFolderDialog, setCreateFolderDialog] = useState(false);
  const [folders, setFolders] = useState<
    Array<{
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      parentId?: string;
    }>
  >([]);
  const [folderPath, setFolderPath] = useState<
    Array<{
      id: string;
      name: string;
    }>
  >([]);

  const { uploadFiles, isUploading, uploadProgress, uploadError, clearError } =
    useFileUpload();

  // File selection hook
  const { selection, handleSelect, clearSelection } = useFileSelection(
    useMemo(() => files.map((f) => f.id), [files]),
  );

  // Fetch files from database
  const fetchFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = currentFolderId
        ? `/api/files?folderId=${currentFolderId}&sortBy=${sortField}&sortOrder=${sortOrder}`
        : `/api/files?sortBy=${sortField}&sortOrder=${sortOrder}`;

      const response = await fetch(url);
      const data = (await response.json()) as {
        success: boolean;
        files?: FileRecord[];
        error?: string;
      };

      if (response.ok && data.success) {
        setFiles(data.files ?? []);
      } else {
        setError(data.error ?? "Failed to fetch files");
      }
    } catch (_err) {
      setError("Failed to fetch files");
      console.error("Failed to fetch files", _err);
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId, sortField, sortOrder]);

  // Load files on component mount
  useEffect(() => {
    void fetchFiles();
  }, [fetchFiles]);

  // Fetch folders for current location
  const fetchFolders = useCallback(async () => {
    try {
      const url = currentFolderId
        ? `/api/folders?parentId=${currentFolderId}`
        : "/api/folders";

      const response = await fetch(url);
      const data = (await response.json()) as {
        success: boolean;
        folders?: Array<{
          id: string;
          name: string;
          createdAt: string;
          updatedAt: string;
          parentId?: string;
        }>;
        error?: string;
      };

      if (response.ok && data.success) {
        setFolders(data.folders ?? []);
      } else {
        console.error("Failed to fetch folders:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  }, [currentFolderId]);

  // Load folders when current folder changes
  useEffect(() => {
    void fetchFolders();
  }, [fetchFolders]);

  // Build breadcrumb path when current folder changes
  const buildBreadcrumbPath = useCallback(async (folderId: string | null) => {
    if (!folderId) {
      setFolderPath([]);
      return;
    }

    try {
      const path: Array<{ id: string; name: string }> = [];
      let currentId: string | null = folderId;

      while (currentId) {
        const response = await fetch(`/api/folders/${currentId}`);
        const data = (await response.json()) as {
          success: boolean;
          folder?: {
            id: string;
            name: string;
            parentId?: string;
          };
          error?: string;
        };

        if (response.ok && data.success && data.folder) {
          path.unshift({ id: data.folder.id, name: data.folder.name });
          currentId = data.folder.parentId ?? null;
        } else {
          break;
        }
      }

      setFolderPath(path);
    } catch (error) {
      console.error("Failed to build breadcrumb path:", error);
      setFolderPath([]);
    }
  }, []);

  // Update breadcrumb path when current folder changes
  useEffect(() => {
    void buildBreadcrumbPath(currentFolderId);
  }, [currentFolderId, buildBreadcrumbPath]);

  // Handle file upload completion
  const handleUploadComplete = useCallback(async () => {
    // Refresh the file list after upload
    await fetchFiles();
  }, [fetchFiles]);

  // Handle file selection
  const handleFileSelect = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      try {
        await uploadFiles(fileArray, currentFolderId);
        await handleUploadComplete();
      } catch (error) {
        console.error("Upload failed:", error);
      }
    },
    [uploadFiles, handleUploadComplete, currentFolderId],
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        void handleFileSelect(files);
      }
    },
    [handleFileSelect],
  );

  // File input handler
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        void handleFileSelect(files);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [handleFileSelect],
  );

  // File actions handlers
  const handleFileDownload = useCallback(
    (fileId: string) => {
      console.log("Download called for file:", fileId);
      const file = files.find((f) => f.id === fileId);
      if (file) {
        console.log(
          "Opening file in new tab:",
          file.originalName,
          "URL:",
          file.blobUrl,
        );

        // Try to open in new tab first
        try {
          const newWindow = window.open(
            file.blobUrl,
            "_blank",
            "noopener,noreferrer",
          );
          if (!newWindow) {
            console.log("Popup blocked, trying alternative method");
            // Fallback: create a link and click it
            const link = document.createElement("a");
            link.href = file.blobUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.download = file.originalName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (error) {
          console.error("Error opening file:", error);
          // Final fallback: direct download
          const link = document.createElement("a");
          link.href = file.blobUrl;
          link.download = file.originalName;
          link.click();
        }
      } else {
        console.error("File not found:", fileId);
      }
    },
    [files],
  );

  const handleFileShare = useCallback((fileId: string) => {
    console.log("Share file:", fileId);
    // TODO: Implement file sharing
  }, []);

  const handleFileRename = useCallback(
    async (fileId: string, newName: string) => {
      console.log("Rename called for file:", fileId, "to:", newName);
      try {
        const response = await fetch(`/api/files/${fileId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        });

        console.log("Rename response status:", response.status);

        if (!response.ok) {
          const error = (await response.json()) as { error?: string };
          throw new Error(error.error ?? "Failed to rename file");
        }

        console.log("Rename successful, refreshing files");
        // Refresh the file list
        await fetchFiles();
      } catch (error) {
        console.error("Rename error:", error);
        throw error;
      }
    },
    [fetchFiles],
  );

  const handleFileMove = useCallback((fileId: string, folderId: string) => {
    console.log("Move file:", fileId, "to folder:", folderId);
    // TODO: Implement file moving
  }, []);

  const handleFileDelete = useCallback(
    async (fileId: string) => {
      console.log("Delete called for file:", fileId);
      try {
        const response = await fetch(`/api/files/${fileId}`, {
          method: "DELETE",
        });

        console.log("Delete response status:", response.status);

        if (!response.ok) {
          const error = (await response.json()) as { error?: string };
          throw new Error(error.error ?? "Failed to delete file");
        }

        console.log("Delete successful, refreshing files");
        // Refresh the file list
        await fetchFiles();
      } catch (error) {
        console.error("Delete error:", error);
        setError(
          error instanceof Error ? error.message : "Failed to delete file",
        );
      }
    },
    [fetchFiles],
  );

  // Bulk actions handlers
  const handleBulkDownload = useCallback(async () => {
    const selectedFileIds = Array.from(selection.selectedFiles);
    if (selectedFileIds.length === 0) return;

    try {
      const response = await fetch("/api/files/bulk-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileIds: selectedFileIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to create bulk download");
      }

      // Create a blob from the response and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bulk-download-${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      clearSelection();
    } catch (error) {
      console.error("Bulk download error:", error);
      setError("Failed to download files");
    }
  }, [selection.selectedFiles, clearSelection]);

  const handleBulkShare = useCallback(() => {
    console.log("Bulk share:", Array.from(selection.selectedFiles));
    // TODO: Implement bulk share
  }, [selection.selectedFiles]);

  const handleBulkMove = useCallback(() => {
    console.log("Bulk move:", Array.from(selection.selectedFiles));
    // TODO: Implement bulk move
  }, [selection.selectedFiles]);

  const handleBulkRename = useCallback(() => {
    const selectedFileIds = Array.from(selection.selectedFiles);
    if (selectedFileIds.length === 0) return;

    // For now, just rename the first selected file
    const firstFileId = selectedFileIds[0];
    const firstFile = files.find((f) => f.id === firstFileId);
    if (firstFile) {
      console.log("Bulk rename - renaming first file:", firstFile.name);
      setRenameDialog({ isOpen: true, file: firstFile });
    }
  }, [selection.selectedFiles, files]);

  const handleBulkDelete = useCallback(async () => {
    const selectedFileIds = Array.from(selection.selectedFiles);
    if (selectedFileIds.length === 0) return;

    // Show confirmation dialog instead of deleting immediately
    setBulkDeleteDialog({ isOpen: true, fileIds: selectedFileIds });
  }, [selection.selectedFiles]);

  const confirmBulkDelete = useCallback(async () => {
    const { fileIds } = bulkDeleteDialog;
    if (fileIds.length === 0) return;

    try {
      const response = await fetch("/api/files/bulk", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileIds }),
      });

      if (!response.ok) {
        const error = (await response.json()) as { error?: string };
        throw new Error(error.error ?? "Failed to delete files");
      }

      // Refresh the file list
      await fetchFiles();
      clearSelection();
      setBulkDeleteDialog({ isOpen: false, fileIds: [] });
    } catch (error) {
      console.error("Bulk delete error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete files",
      );
    }
  }, [bulkDeleteDialog, fetchFiles, clearSelection]);

  // Sort handler
  const handleSort = useCallback(
    (field: "name" | "size" | "createdAt" | "category") => {
      if (sortField === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
    },
    [sortField, sortOrder],
  );

  // Handle folder creation
  const handleCreateFolder = useCallback(
    async (folderName: string) => {
      try {
        const response = await fetch("/api/folders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: folderName,
            parentId: currentFolderId,
          }),
        });

        const data = (await response.json()) as {
          success: boolean;
          folder?: {
            id: string;
            name: string;
            createdAt: string;
            updatedAt: string;
            parentId?: string;
          };
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to create folder");
        }

        if (data.success && data.folder) {
          // Add the new folder to the current list
          setFolders((prev) => [...prev, data.folder!]);
          console.log("Folder created successfully:", data.folder.name);
        }
      } catch (error) {
        console.error("Create folder error:", error);
        throw error;
      }
    },
    [currentFolderId],
  );

  // Navigate to a specific folder
  const navigateToFolder = useCallback(
    (folderId: string | null) => {
      onFolderSelect(folderId);
      clearSelection(); // Clear selection when navigating
    },
    [onFolderSelect, clearSelection],
  );

  // Sort folders client-side
  const sortedFolders = useMemo(() => {
    return [...folders].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "size":
          // Folders don't have size, so sort by name as fallback
          comparison = a.name.localeCompare(b.name);
          break;
        case "category":
          // Folders don't have category, so sort by name as fallback
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [folders, sortField, sortOrder]);

  const hasFiles = files.length > 0;
  const hasFolders = folders.length > 0;
  const hasContent = hasFiles || hasFolders;
  const shouldShowUploadZone = !hasContent || isUploading;

  if (isLoading) {
    return (
      <main className="flex-1 overflow-auto">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading your files...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="space-y-6 p-4 lg:p-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-1 text-sm text-gray-600">
          <button
            className="hover:text-gray-900 hover:underline"
            onClick={() => navigateToFolder(null)}
          >
            My Drive
          </button>
          {folderPath.map((folder, index) => (
            <div key={folder.id} className="flex items-center">
              <ChevronRight className="mx-1 h-4 w-4" />
              <button
                className={`hover:text-gray-900 ${
                  index === folderPath.length - 1
                    ? "font-medium text-gray-900"
                    : "hover:underline"
                }`}
                onClick={() => navigateToFolder(folder.id)}
              >
                {folder.name}
              </button>
            </div>
          ))}
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">My Drive</h1>
          <div className="flex items-center gap-2">
            {hasContent && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Sort by:{" "}
                    {sortField === "name"
                      ? "Name"
                      : sortField === "size"
                        ? "Size"
                        : sortField === "category"
                          ? "Type"
                          : "Date"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleSort("name")}>
                    Name{" "}
                    {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("size")}>
                    Size{" "}
                    {sortField === "size" && (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("category")}>
                    Type{" "}
                    {sortField === "category" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                    Date{" "}
                    {sortField === "createdAt" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Upload files
            </Button>
            <Button
              variant="outline"
              onClick={() => setCreateFolderDialog(true)}
            >
              <Folder className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            {hasFiles && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="hidden sm:flex"
              >
                {viewMode === "grid" ? "List view" : "Grid view"}
              </Button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto h-6 w-6 p-0 text-red-700 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{uploadError}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="ml-auto h-6 w-6 p-0 text-red-700 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Upload Zone */}
        {shouldShowUploadZone && (
          <BulkContextMenu
            onUpload={() => setShowUploadModal(true)}
            onNewFolder={() => setCreateFolderDialog(true)}
          >
            <div
              className={`relative rounded-lg border-2 border-dashed transition-all duration-200 ${
                isDragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              } ${isUploading ? "bg-gray-50" : "bg-white"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="p-8 text-center lg:p-12">
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900">
                        Uploading files...
                      </p>
                      {Object.entries(uploadProgress).map(
                        ([fileName, progress]) => (
                          <div key={fileName} className="space-y-1">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span className="max-w-xs truncate">
                                {fileName}
                              </span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-blue-50 p-4">
                        <Upload className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {isDragOver
                          ? "Drop files here"
                          : "Upload files to Drive"}
                      </h3>
                      <p className="text-gray-500">
                        Drag and drop files here, or click to select files
                      </p>
                      <p className="text-sm text-gray-400">
                        Maximum file size: 15MB
                      </p>
                    </div>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() =>
                          document.getElementById("file-input")?.click()
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Select files
                      </Button>
                      <Button variant="outline">
                        <Folder className="mr-2 h-4 w-4" />
                        New folder
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                id="file-input"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
                accept="*/*"
              />
            </div>
          </BulkContextMenu>
        )}

        {/* Files Display */}
        {hasContent && (
          <BulkContextMenu
            onUpload={() => setShowUploadModal(true)}
            onNewFolder={() => setCreateFolderDialog(true)}
            onBulkDownload={handleBulkDownload}
            onBulkShare={handleBulkShare}
            onBulkRename={handleBulkRename}
            onBulkMove={handleBulkMove}
            onBulkDelete={handleBulkDelete}
            hasSelection={selection.selectedFiles.size > 0}
          >
            <div>
              {/* Bulk Actions Toolbar */}
              <BulkActionsToolbar
                selection={selection}
                onClearSelection={clearSelection}
                onBulkDownload={handleBulkDownload}
                onBulkShare={handleBulkShare}
                onBulkMove={handleBulkMove}
                onBulkRename={handleBulkRename}
                onBulkDelete={handleBulkDelete}
              />

              {/* Content Display */}
              {(() => {
                const fileActions = {
                  onDownload: handleFileDownload,
                  onShare: handleFileShare,
                  onRename: handleFileRename,
                  onMove: handleFileMove,
                  onDelete: handleFileDelete,
                  onOpenRenameDialog: (file: FileRecord) => {
                    console.log("Setting rename dialog for file:", file.name);
                    setRenameDialog({ isOpen: true, file });
                  },
                };

                const folderActions = {
                  onOpen: (folderId: string) => {
                    console.log("Opening folder:", folderId);
                    navigateToFolder(folderId);
                  },
                  onRename: (folderId: string, newName: string) => {
                    console.log("Rename folder:", folderId, "to:", newName);
                    // TODO: Implement folder rename
                  },
                  onDelete: (folderId: string) => {
                    console.log("Delete folder:", folderId);
                    // TODO: Implement folder delete
                  },
                  onMove: (folderId: string, newParentId: string) => {
                    console.log("Move folder:", folderId, "to:", newParentId);
                    // TODO: Implement folder move
                  },
                };

                return viewMode === "grid" ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {/* Folders */}
                    {sortedFolders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        isSelected={false} // TODO: Add folder selection
                        onSelect={() => {
                          // TODO: Implement folder selection
                        }}
                        actions={folderActions}
                        viewMode="grid"
                      />
                    ))}
                    {/* Files */}
                    {files.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        isSelected={selection.selectedFiles.has(file.id)}
                        onSelect={handleSelect}
                        actions={fileActions}
                        viewMode="grid"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Folders */}
                    {sortedFolders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        isSelected={false} // TODO: Add folder selection
                        onSelect={() => {
                          // TODO: Implement folder selection
                        }}
                        actions={folderActions}
                        viewMode="list"
                      />
                    ))}
                    {/* Files */}
                    {files.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        isSelected={selection.selectedFiles.has(file.id)}
                        onSelect={handleSelect}
                        actions={fileActions}
                        viewMode="list"
                      />
                    ))}
                  </div>
                );
              })()}
            </div>
          </BulkContextMenu>
        )}

        {/* Create Folder Dialog */}
        <CreateFolderDialog
          isOpen={createFolderDialog}
          onClose={() => setCreateFolderDialog(false)}
          onCreateFolder={handleCreateFolder}
        />
      </div>

      {/* Floating Action Button (Mobile) */}
      <Button
        size="icon"
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 lg:hidden"
        onClick={() => setShowUploadModal(true)}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Upload files</span>
      </Button>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
        folderId={currentFolderId}
      />

      {/* Rename Dialog */}
      <RenameDialog
        isOpen={renameDialog.isOpen}
        onClose={() => setRenameDialog({ isOpen: false, file: null })}
        file={renameDialog.file}
        onRename={handleFileRename}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteDialog.isOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setBulkDeleteDialog({ isOpen: false, fileIds: [] });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete files</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {bulkDeleteDialog.fileIds.length}{" "}
              file
              {bulkDeleteDialog.fileIds.length > 1 ? "s" : ""}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
