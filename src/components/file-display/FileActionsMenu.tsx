"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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
import { Button } from "~/components/ui/button";
import {
  MoreHorizontal,
  Download,
  Share,
  Edit,
  FolderOpen,
  Trash2,
  Copy,
} from "lucide-react";
import type { FileRecord } from "~/types/file";

interface FileActions {
  onDownload: (fileId: string) => void;
  onShare: (fileId: string) => void;
  onRename: (fileId: string, newName: string) => void;
  onMove: (fileId: string, folderId: string) => void;
  onDelete: (fileId: string) => void;
  onOpenRenameDialog?: (file: FileRecord) => void;
}

interface FileActionsMenuProps {
  file: FileRecord;
  actions: FileActions;
  className?: string;
}

export function FileActionsMenu({
  file,
  actions,
  className,
}: FileActionsMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    actions.onDelete(file.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${className}`}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">File actions for {file.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => actions.onDownload(file.id)}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => actions.onShare(file.id)}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            Copy link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
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
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FolderOpen className="mr-2 h-4 w-4" />
            Move to
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
