/**
 * Bulk Context Menu Component
 *
 * Provides right-click context menu for bulk actions
 * when right-clicking on empty space in the file area
 */

"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import {
  Upload,
  FolderPlus,
  Download,
  Share,
  Edit,
  FolderOpen,
  Trash2,
} from "lucide-react";

interface BulkContextMenuProps {
  children: React.ReactNode;
  onUpload?: () => void;
  onNewFolder?: () => void;
  onBulkDownload?: () => void;
  onBulkShare?: () => void;
  onBulkRename?: () => void;
  onBulkMove?: () => void;
  onBulkDelete?: () => void;
  hasSelection?: boolean;
}

export function BulkContextMenu({
  children,
  onUpload,
  onNewFolder,
  onBulkDownload,
  onBulkShare,
  onBulkRename,
  onBulkMove,
  onBulkDelete,
  hasSelection = false,
}: BulkContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Upload files
        </ContextMenuItem>
        <ContextMenuItem onClick={onNewFolder}>
          <FolderPlus className="mr-2 h-4 w-4" />
          New folder
        </ContextMenuItem>

        {hasSelection && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onBulkDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download selected
            </ContextMenuItem>
            <ContextMenuItem onClick={onBulkShare}>
              <Share className="mr-2 h-4 w-4" />
              Share selected
            </ContextMenuItem>
            <ContextMenuItem onClick={onBulkRename}>
              <Edit className="mr-2 h-4 w-4" />
              Rename selected
            </ContextMenuItem>
            <ContextMenuItem onClick={onBulkMove}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Move selected
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={onBulkDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete selected
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
