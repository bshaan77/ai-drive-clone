/**
 * File Preview Component
 *
 * Displays file previews for different file types
 * Supports images, text files, PDFs, and other common formats
 */

"use client";

import { useState, useEffect } from "react";
import {
  File,
  Image,
  FileText,
  FileVideo,
  FileAudio,
  Archive,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

interface FilePreviewProps {
  file: {
    id: string;
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    blobUrl: string;
    createdAt: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
  className?: string;
}

export function FilePreview({
  file,
  isOpen,
  onClose,
  onDownload,
  className,
}: FilePreviewProps) {
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);

  // Reset state when file changes
  useEffect(() => {
    setImageScale(1);
    setImageRotation(0);
    setIsLoading(true);
    setError(null);
    setTextContent(null);
  }, [file.id]);

  // Get file type category
  const getFileType = () => {
    const { mimeType } = file;

    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.includes("pdf")) return "pdf";
    if (
      mimeType.includes("text/") ||
      mimeType.includes("json") ||
      mimeType.includes("xml")
    )
      return "text";
    if (
      mimeType.includes("zip") ||
      mimeType.includes("rar") ||
      mimeType.includes("tar")
    )
      return "archive";

    return "other";
  };

  const fileType = getFileType();

  // Load text content for text files
  useEffect(() => {
    if (fileType === "text" && isOpen) {
      const loadTextContent = async () => {
        try {
          const response = await fetch(file.blobUrl);
          if (!response.ok) throw new Error("Failed to load file");

          const text = await response.text();
          setTextContent(text);
        } catch (err) {
          setError("Failed to load text content");
        } finally {
          setIsLoading(false);
        }
      };

      void loadTextContent();
    } else {
      setIsLoading(false);
    }
  }, [file.blobUrl, fileType, isOpen]);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file icon
  const getFileIcon = () => {
    switch (fileType) {
      case "image":
        return <Image className="h-8 w-8 text-blue-500" />;
      case "video":
        return <FileVideo className="h-8 w-8 text-purple-500" />;
      case "audio":
        return <FileAudio className="h-8 w-8 text-green-500" />;
      case "text":
        return <FileText className="h-8 w-8 text-orange-500" />;
      case "archive":
        return <Archive className="h-8 w-8 text-red-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  // Image controls
  const handleZoomIn = () => setImageScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () =>
    setImageScale((prev) => Math.max(prev - 0.25, 0.25));
  const handleRotate = () => setImageRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setImageScale(1);
    setImageRotation(0);
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm",
        className,
      )}
    >
      <div className="relative h-full w-full max-w-6xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div>
              <h2 className="font-medium text-gray-900">{file.originalName}</h2>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)} • {file.mimeType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {fileType}
            </Badge>

            {onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-full flex-1 flex-col overflow-hidden">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Loading preview...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <File className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-600">{error}</p>
                <Button variant="outline" className="mt-4" onClick={onDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download instead
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-1 overflow-hidden">
              {/* Image Preview */}
              {fileType === "image" && (
                <div className="relative flex h-full w-full items-center justify-center bg-gray-100">
                  <img
                    src={file.blobUrl}
                    alt={file.originalName}
                    className="max-h-full max-w-full object-contain transition-all duration-200"
                    style={{
                      transform: `scale(${imageScale}) rotate(${imageRotation}deg)`,
                    }}
                    onLoad={() => setIsLoading(false)}
                    onError={() => setError("Failed to load image")}
                  />

                  {/* Image Controls */}
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-white/90 px-4 py-2 shadow-lg backdrop-blur">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomOut}
                      disabled={imageScale <= 0.25}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      {Math.round(imageScale * 100)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomIn}
                      disabled={imageScale >= 3}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleRotate}>
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      Reset
                    </Button>
                  </div>
                </div>
              )}

              {/* Video Preview */}
              {fileType === "video" && (
                <div className="flex h-full w-full items-center justify-center bg-black">
                  <video
                    src={file.blobUrl}
                    controls
                    className="max-h-full max-w-full"
                    onLoadStart={() => setIsLoading(false)}
                    onError={() => setError("Failed to load video")}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Audio Preview */}
              {fileType === "audio" && (
                <div className="flex h-full w-full items-center justify-center bg-gray-50">
                  <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg">
                    <div className="text-center">
                      <FileAudio className="mx-auto mb-4 h-16 w-16 text-green-500" />
                      <h3 className="font-medium text-gray-900">
                        {file.originalName}
                      </h3>
                    </div>
                    <audio
                      src={file.blobUrl}
                      controls
                      className="w-full"
                      onLoadStart={() => setIsLoading(false)}
                      onError={() => setError("Failed to load audio")}
                    />
                  </div>
                </div>
              )}

              {/* Text Preview */}
              {fileType === "text" && textContent && (
                <div className="flex h-full w-full flex-col">
                  <div className="flex-1 overflow-auto p-4">
                    <pre className="font-mono text-sm whitespace-pre-wrap text-gray-900">
                      {textContent}
                    </pre>
                  </div>
                </div>
              )}

              {/* Other Files */}
              {fileType === "other" && (
                <div className="flex h-full w-full items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <File className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                    <h3 className="mb-2 font-medium text-gray-900">
                      Preview not available
                    </h3>
                    <p className="mb-4 text-gray-600">
                      This file type cannot be previewed. Please download to
                      view.
                    </p>
                    {onDownload && (
                      <Button onClick={onDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download File
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Archive Files */}
              {fileType === "archive" && (
                <div className="flex h-full w-full items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <Archive className="mx-auto mb-4 h-16 w-16 text-red-400" />
                    <h3 className="mb-2 font-medium text-gray-900">
                      Archive File
                    </h3>
                    <p className="mb-4 text-gray-600">
                      Archive files cannot be previewed. Please download to
                      extract.
                    </p>
                    {onDownload && (
                      <Button onClick={onDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Archive
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
