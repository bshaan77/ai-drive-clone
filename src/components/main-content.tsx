"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ChevronRight,
  Folder,
  FileText,
  ImageIcon,
  Video,
  MoreVertical,
  Download,
  Share,
  Star,
  Trash2,
  Plus,
  Upload,
  X,
  AlertCircle,
  File,
  Music,
  Archive,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useFileUpload } from "~/hooks/use-file-upload";
import { UploadModal } from "~/components/upload-modal";
import { getFileIcon, getFileCategory, formatFileSize } from "~/lib/file-utils";

const breadcrumbs = [{ name: "My Drive", href: "/" }];

// Enhanced file type icons mapping using utilities
const getFileIconComponent = (mimeType: string) => {
  const category = getFileCategory(mimeType);

  switch (category) {
    case "image":
      return ImageIcon;
    case "video":
      return Video;
    case "audio":
      return Music;
    case "archive":
      return Archive;
    case "document":
    case "pdf":
    case "text":
      return FileText;
    default:
      return File;
  }
};

// File interface with enhanced metadata
interface FileRecord {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  sizeFormatted: string;
  blobUrl: string;
  category: string;
  icon: string;
  folderId: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
  isDocument: boolean;
  isArchive: boolean;
}

export function MainContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    uploadFiles,
    multiFileProgress,
    isUploading,
    error: uploadError,
    clearError,
  } = useFileUpload();

  // Fetch files from database
  const fetchFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/files");
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
    } catch (err) {
      setError("Failed to fetch files");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load files on component mount
  useEffect(() => {
    void fetchFiles();
  }, [fetchFiles]);

  // Handle file upload completion
  const handleUploadComplete = useCallback(
    async (uploadedFiles: File[]) => {
      // Refresh the file list after upload
      await fetchFiles();
    },
    [fetchFiles],
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      try {
        await uploadFiles(fileArray);
        await handleUploadComplete(fileArray);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    },
    [uploadFiles, handleUploadComplete],
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const hasFiles = files.length > 0;
  const showUploadZone = !hasFiles || isUploading;

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
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.name} className="flex items-center">
              {index > 0 && <ChevronRight className="mx-1 h-4 w-4" />}
              <button
                className={`hover:text-gray-900 ${
                  index === breadcrumbs.length - 1
                    ? "font-medium text-gray-900"
                    : "hover:underline"
                }`}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">My Drive</h1>
          <div className="flex items-center gap-2">
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
        {showUploadZone && (
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
                    {Object.entries(multiFileProgress).map(
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
                      {isDragOver ? "Drop files here" : "Upload files to Drive"}
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
        )}

        {/* Files Grid */}
        {hasFiles && (
          <div
            className={`grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {files.map((file) => {
              const FileIcon = getFileIconComponent(file.mimeType);
              return (
                <Card
                  key={file.id}
                  className="group cursor-pointer border-gray-200 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div
                        className={`rounded-lg p-2 ${
                          file.category === "image"
                            ? "bg-green-50 text-green-600"
                            : file.category === "video"
                              ? "bg-purple-50 text-purple-600"
                              : file.category === "audio"
                                ? "bg-yellow-50 text-yellow-600"
                                : file.category === "archive"
                                  ? "bg-orange-50 text-orange-600"
                                  : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        <FileIcon className="h-6 w-6" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="mr-2 h-4 w-4" />
                            Star
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <h3
                        className="truncate font-medium text-gray-900"
                        title={file.name}
                      >
                        {file.name}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{file.sizeFormatted}</span>
                        <span>{formatDate(file.createdAt)}</span>
                      </div>
                      {file.category && (
                        <div className="text-xs text-gray-400 capitalize">
                          {file.category}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Upload Button */}
        {hasFiles && !isUploading && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Upload more files
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button (Mobile) */}
      <Button
        size="icon"
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 lg:hidden"
        onClick={() => setIsUploadModalOpen(true)}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Upload files</span>
      </Button>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </main>
  );
}
