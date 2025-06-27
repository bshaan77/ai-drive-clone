/**
 * Folder Tree Component
 *
 * Displays a hierarchical folder structure in the sidebar
 * with navigation, highlighting, and folder counts.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { cn } from "~/lib/utils";

interface FolderNode {
  id: string;
  name: string;
  parentId?: string;
  children?: FolderNode[];
  fileCount?: number;
  folderCount?: number;
}

interface FolderTreeProps {
  currentFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  className?: string;
}

export function FolderTree({
  currentFolderId,
  onFolderSelect,
  className,
}: FolderTreeProps) {
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all folders and build tree structure
  const fetchFolders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/folders?all=true");
      const data = (await response.json()) as {
        success: boolean;
        folders?: Array<{
          id: string;
          name: string;
          parentId?: string;
        }>;
        error?: string;
      };

      if (response.ok && data.success && data.folders) {
        // Build tree structure
        const folderMap = new Map<string, FolderNode>();
        const rootFolders: FolderNode[] = [];

        // Create nodes for all folders
        data.folders.forEach((folder) => {
          folderMap.set(folder.id, {
            id: folder.id,
            name: folder.name,
            parentId: folder.parentId,
            children: [],
          });
        });

        // Build parent-child relationships
        data.folders.forEach((folder) => {
          const node = folderMap.get(folder.id)!;
          if (folder.parentId && folderMap.has(folder.parentId)) {
            const parent = folderMap.get(folder.parentId)!;
            parent.children = parent.children ?? [];
            parent.children.push(node);
          } else {
            rootFolders.push(node);
          }
        });

        setFolders(rootFolders);
      }
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load folders on mount
  useEffect(() => {
    void fetchFolders();
  }, [fetchFolders]);

  // Auto-expand folders in current path
  useEffect(() => {
    if (currentFolderId) {
      const expandPath = async () => {
        try {
          const path: string[] = [];
          let currentId: string | null = currentFolderId;

          while (currentId) {
            path.unshift(currentId);
            const response = await fetch(`/api/folders/${currentId}`);
            const data = (await response.json()) as {
              success: boolean;
              folder?: { parentId?: string };
            };

            if (response.ok && data.success && data.folder) {
              currentId = data.folder.parentId ?? null;
            } else {
              break;
            }
          }

          setExpandedFolders(new Set(path));
        } catch (error) {
          console.error("Failed to expand path:", error);
        }
      };

      void expandPath();
    }
  }, [currentFolderId]);

  // Toggle folder expansion
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  // Handle folder selection
  const handleFolderClick = useCallback(
    (folderId: string) => {
      onFolderSelect(folderId);
    },
    [onFolderSelect],
  );

  // Render folder node recursively
  const renderFolderNode = useCallback(
    (folder: FolderNode, level = 0) => {
      const isExpanded = expandedFolders.has(folder.id);
      const isSelected = currentFolderId === folder.id;
      const hasChildren = folder.children && folder.children.length > 0;

      return (
        <div key={folder.id}>
          <div
            className={cn(
              "group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-gray-100",
              isSelected && "bg-blue-50 text-blue-700",
              level > 0 && "ml-4",
            )}
            onClick={() => handleFolderClick(folder.id)}
          >
            {/* Expand/Collapse button */}
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
                className="flex h-4 w-4 items-center justify-center rounded hover:bg-gray-200"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-4" />}

            {/* Folder icon */}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-600" />
            ) : (
              <Folder className="h-4 w-4 text-gray-500" />
            )}

            {/* Folder name */}
            <span className="flex-1 truncate font-medium">{folder.name}</span>

            {/* Folder counts */}
            {(folder.fileCount !== undefined ||
              folder.folderCount !== undefined) && (
              <span className="text-xs text-gray-400">
                {folder.folderCount !== undefined && folder.folderCount > 0 && (
                  <span>{folder.folderCount}</span>
                )}
                {folder.fileCount !== undefined && folder.fileCount > 0 && (
                  <span className="ml-1">{folder.fileCount}</span>
                )}
              </span>
            )}
          </div>

          {/* Render children if expanded */}
          {isExpanded && hasChildren && (
            <div className="mt-1">
              {folder.children!.map((child) =>
                renderFolderNode(child, level + 1),
              )}
            </div>
          )}
        </div>
      );
    },
    [expandedFolders, currentFolderId, handleFolderClick, toggleFolder],
  );

  if (isLoading) {
    return (
      <div className={cn("p-4", className)}>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1 p-2", className)}>
      {/* Root folder (My Drive) */}
      <div
        className={cn(
          "group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100",
          currentFolderId === null && "bg-blue-50 text-blue-700",
        )}
        onClick={() => onFolderSelect(null)}
      >
        <Folder className="h-4 w-4 text-gray-500" />
        <span>My Drive</span>
      </div>

      {/* Folder tree */}
      <div className="space-y-1">
        {folders.map((folder) => renderFolderNode(folder))}
      </div>

      {folders.length === 0 && (
        <div className="px-2 py-1 text-xs text-gray-500">No folders yet</div>
      )}
    </div>
  );
}
