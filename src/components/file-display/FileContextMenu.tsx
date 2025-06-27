/**
 * File Context Menu Component
 *
 * Provides right-click context menu for file actions
 * with the same functionality as the dropdown menu
 */

"use client";

import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
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
import { Download, Share, Edit, FolderOpen, Trash2, Copy } from "lucide-react";
import type { FileRecord } from "~/types/file";

interface FileActions {
  onDownload: (fileId: string) => void;
  onShare: (fileId: string) => void;
  onRename: (fileId: string, newName: string) => void;
  onMove: (fileId: string, folderId: string) => void;
  onDelete: (fileId: string) => void;
  onOpenRenameDialog?: (file: FileRecord) => void;
}

interface FileContextMenuProps {
  file: FileRecord;
  actions: FileActions;
  children: React.ReactNode;
}

export function FileContextMenu({
  file,
  actions,
  children,
}: FileContextMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    actions.onDelete(file.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => actions.onDownload(file.id)}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </ContextMenuItem>
          <ContextMenuItem onClick={() => actions.onShare(file.id)}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            Copy link
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => {
              console.log("Rename clicked for file:", file.name);
              if (actions.onOpenRenameDialog) {
                actions.onOpenRenameDialog(file);
              } else {
                actions.onRename(file.id, file.name);
              }
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem>
            <FolderOpen className="mr-2 h-4 w-4" />
            Move to
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{file.name}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
