"use client";

import { useState, useCallback } from "react";
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

const breadcrumbs = [{ name: "My Drive", href: "/" }];

// File type icons mapping
const getFileIcon = (type: string, mimeType?: string) => {
  if (type === "folder") return Folder;
  if (mimeType?.startsWith("image/")) return ImageIcon;
  if (mimeType?.startsWith("video/")) return Video;
  if (mimeType?.startsWith("audio/")) return Music;
  if (
    mimeType?.includes("pdf") ||
    mimeType?.includes("document") ||
    mimeType?.includes("text")
  )
    return FileText;
  if (mimeType?.includes("zip") || mimeType?.includes("archive"))
    return Archive;
  return File;
};

// Format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

// Format date
const formatDate = (date: Date) => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  return date.toLocaleDateString();
};

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  mimeType: string;
  uploadedAt: Date;
  url?: string;
}

export function MainContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const { uploadFiles, multiFileProgress, isUploading, error, clearError } =
    useFileUpload();

  // Handle file upload completion
  const handleUploadComplete = useCallback((files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : file.type.includes("folder")
            ? "folder"
            : "document",
      mimeType: file.type,
      uploadedAt: new Date(),
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      try {
        await uploadFiles(fileArray);
        handleUploadComplete(fileArray);
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

  const hasFiles = uploadedFiles.length > 0;
  const showUploadZone = !hasFiles || isUploading;

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

        {/* Upload Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
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
            {uploadedFiles.map((file) => {
              const FileIcon = getFileIcon(file.type, file.mimeType);
              return (
                <Card
                  key={file.id}
                  className="group cursor-pointer border-gray-200 transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div
                        className={`rounded-lg p-2 ${
                          file.type === "folder"
                            ? "bg-blue-50 text-blue-600"
                            : file.type === "image"
                              ? "bg-green-50 text-green-600"
                              : file.type === "video"
                                ? "bg-purple-50 text-purple-600"
                                : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        <FileIcon className="h-6 w-6" />
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More options</span>
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
                            Add to starred
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Move to trash
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
                        <span>{formatFileSize(file.size)}</span>
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
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
              onClick={() => document.getElementById("file-input")?.click()}
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
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Upload files</span>
      </Button>
    </main>
  );
}
