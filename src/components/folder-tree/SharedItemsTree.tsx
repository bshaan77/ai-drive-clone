/**
 * Shared Items Tree Component
 *
 * Displays shared files and folders in the sidebar
 * with navigation and highlighting.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { Folder, File, Users } from "lucide-react";
import { cn } from "~/lib/utils";

interface SharedFile {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  sharedBy: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  permission: "view" | "edit";
  sharedAt: string;
}

interface SharedFolder {
  id: string;
  name: string;
  sharedBy: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  permission: "view" | "edit";
  sharedAt: string;
}

interface SharedItemsTreeProps {
  className?: string;
}

export function SharedItemsTree({ className }: SharedItemsTreeProps) {
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [sharedFolders, setSharedFolders] = useState<SharedFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch shared items
  const fetchSharedItems = useCallback(async () => {
    try {
      setIsLoading(true);

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
    } catch (error) {
      console.error("Failed to fetch shared items:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load shared items on mount
  useEffect(() => {
    void fetchSharedItems();
  }, [fetchSharedItems]);

  // Handle navigation to shared with me page
  const handleSharedWithMeClick = useCallback(() => {
    window.location.href = "/shared-with-me";
  }, []);

  if (isLoading) {
    return (
      <div className={cn("p-4", className)}>
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasSharedItems = sharedFiles.length > 0 || sharedFolders.length > 0;

  return (
    <div className={cn("space-y-1 p-2", className)}>
      {/* Shared with me header */}
      <div
        className={cn(
          "group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100",
        )}
        onClick={handleSharedWithMeClick}
      >
        <Users className="h-4 w-4 text-gray-500" />
        <span>Shared with me</span>
        {(sharedFiles.length > 0 || sharedFolders.length > 0) && (
          <span className="ml-auto text-xs text-gray-400">
            {sharedFiles.length + sharedFolders.length}
          </span>
        )}
      </div>

      {/* Shared items preview (when expanded) */}
      {isExpanded && hasSharedItems && (
        <div className="ml-4 space-y-1">
          {/* Shared folders */}
          {sharedFolders.slice(0, 3).map((folder) => (
            <div
              key={`folder-${folder.id}`}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
              onClick={handleSharedWithMeClick}
            >
              <Folder className="h-3 w-3 text-blue-500" />
              <span className="truncate">{folder.name}</span>
              <span className="ml-auto text-xs text-gray-400 capitalize">
                {folder.permission}
              </span>
            </div>
          ))}

          {/* Shared files */}
          {sharedFiles.slice(0, 3).map((file) => (
            <div
              key={`file-${file.id}`}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
              onClick={handleSharedWithMeClick}
            >
              <File className="h-3 w-3 text-gray-500" />
              <span className="truncate">{file.name}</span>
              <span className="ml-auto text-xs text-gray-400 capitalize">
                {file.permission}
              </span>
            </div>
          ))}

          {/* Show more indicator */}
          {(sharedFiles.length > 3 || sharedFolders.length > 3) && (
            <div className="px-2 py-1 text-xs text-gray-400">
              +
              {Math.max(0, sharedFiles.length - 3) +
                Math.max(0, sharedFolders.length - 3)}{" "}
              more
            </div>
          )}
        </div>
      )}

      {/* Expand/collapse button */}
      {hasSharedItems && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}

      {!hasSharedItems && (
        <div className="px-2 py-1 text-xs text-gray-500">No shared items</div>
      )}
    </div>
  );
}
