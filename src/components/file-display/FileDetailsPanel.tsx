/**
 * File Details Panel Component
 *
 * Displays detailed information about selected files and folders
 * Shows metadata, sharing info, and quick actions
 */

"use client";

import { useState, useEffect } from "react";
import {
  X,
  Download,
  Share,
  Edit,
  Trash2,
  Calendar,
  HardDrive,
  User,
  Link,
  Eye,
  File,
  Folder,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import type { FileRecord } from "~/types/file";

interface FileDetailsPanelProps {
  selectedFiles: Set<string>;
  selectedFolders: Set<string>;
  files: FileRecord[];
  folders: Array<{
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    parentId?: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (fileId: string) => void;
  onShare?: (fileId: string) => void;
  onRename?: (fileId: string, newName: string) => void;
  onDelete?: (fileId: string) => void;
  onPreview?: (fileId: string) => void;
  className?: string;
}

export function FileDetailsPanel({
  selectedFiles,
  selectedFolders,
  files,
  folders,
  isOpen,
  onClose,
  onDownload,
  onShare,
  onRename,
  onDelete,
  onPreview,
  className,
}: FileDetailsPanelProps) {
  const [selectedItems, setSelectedItems] = useState<
    Array<{
      id: string;
      name: string;
      type: "file" | "folder";
      size?: number;
      mimeType?: string;
      createdAt: string;
      blobUrl?: string;
    }>
  >([]);

  // Update selected items when selection changes
  useEffect(() => {
    const items: Array<{
      id: string;
      name: string;
      type: "file" | "folder";
      size?: number;
      mimeType?: string;
      createdAt: string;
      blobUrl?: string;
    }> = [];

    // Add selected files
    selectedFiles.forEach((fileId) => {
      const file = files.find((f) => f.id === fileId);
      if (file) {
        items.push({
          id: file.id,
          name: file.name,
          type: "file",
          size: file.size,
          mimeType: file.mimeType,
          createdAt: file.createdAt,
          blobUrl: file.blobUrl,
        });
      }
    });

    // Add selected folders
    selectedFolders.forEach((folderId) => {
      const folder = folders.find((f) => f.id === folderId);
      if (folder) {
        items.push({
          id: folder.id,
          name: folder.name,
          type: "folder",
          createdAt: folder.createdAt,
        });
      }
    });

    setSelectedItems(items);
  }, [selectedFiles, selectedFolders, files, folders]);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get total size of selected files
  const totalSize = selectedItems
    .filter((item) => item.type === "file" && item.size)
    .reduce((sum, item) => sum + (item.size ?? 0), 0);

  if (!isOpen || selectedItems.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed top-0 right-0 z-40 h-full w-80 transform border-l border-gray-200 bg-white shadow-lg transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h3 className="font-medium text-gray-900">Details</h3>
          <p className="text-sm text-gray-500">
            {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
            selected
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Quick Actions */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium text-gray-900">
              Quick Actions
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedItems.length === 1 &&
                selectedItems[0]?.type === "file" &&
                onPreview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreview(selectedItems[0]?.id ?? "")}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                )}
              {onDownload &&
                selectedItems.some((item) => item.type === "file") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      selectedItems.forEach((item) => {
                        if (item.type === "file" && onDownload) {
                          onDownload(item.id);
                        }
                      });
                    }}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}
              {onShare && selectedItems.length === 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare(selectedItems[0]?.id ?? "")}
                  className="gap-2"
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
              )}
              {onRename && selectedItems.length === 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onRename(
                      selectedItems[0]?.id ?? "",
                      selectedItems[0]?.name ?? "",
                    )
                  }
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Rename
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedItems.forEach((item) => {
                      if (onDelete) {
                        onDelete(item.id);
                      }
                    });
                  }}
                  className="gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Summary */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium text-gray-900">Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Files:</span>
                <span className="font-medium">
                  {selectedItems.filter((item) => item.type === "file").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Folders:</span>
                <span className="font-medium">
                  {
                    selectedItems.filter((item) => item.type === "folder")
                      .length
                  }
                </span>
              </div>
              {totalSize > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total size:</span>
                  <span className="font-medium">
                    {formatFileSize(totalSize)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Selected Items */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-900">
              Selected Items
            </h4>
            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {item.type === "file" ? (
                        <File className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Folder className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {item.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="secondary" className="capitalize">
                          {item.type}
                        </Badge>
                        {item.size && <span>{formatFileSize(item.size)}</span>}
                        {item.mimeType && (
                          <span className="truncate">{item.mimeType}</span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
