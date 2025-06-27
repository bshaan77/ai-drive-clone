"use client";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Download, Share, Trash2, FolderOpen, X, Star } from "lucide-react";

interface FileSelection {
  selectedFiles: Set<string>;
  isAllSelected: boolean;
}

interface BulkActionsToolbarProps {
  selection: FileSelection;
  onClearSelection: () => void;
  onBulkDownload: () => void;
  onBulkShare: () => void;
  onBulkMove: () => void;
  onBulkDelete: () => void;
  onBulkStar: () => void;
}

export function BulkActionsToolbar({
  selection,
  onClearSelection,
  onBulkDownload,
  onBulkShare,
  onBulkMove,
  onBulkDelete,
  onBulkStar,
}: BulkActionsToolbarProps) {
  const selectedCount = selection.selectedFiles.size;

  if (selectedCount === 0) return null;

  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <span className="text-sm font-medium text-blue-900">
        {selectedCount} file{selectedCount > 1 ? "s" : ""} selected
      </span>

      <Separator orientation="vertical" className="mx-2 h-4" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBulkDownload}
          className="text-blue-700 hover:bg-blue-100 hover:text-blue-900"
        >
          <Download className="mr-1 h-4 w-4" />
          Download
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onBulkShare}
          className="text-blue-700 hover:bg-blue-100 hover:text-blue-900"
        >
          <Share className="mr-1 h-4 w-4" />
          Share
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onBulkStar}
          className="text-blue-700 hover:bg-blue-100 hover:text-blue-900"
        >
          <Star className="mr-1 h-4 w-4" />
          Star
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onBulkMove}
          className="text-blue-700 hover:bg-blue-100 hover:text-blue-900"
        >
          <FolderOpen className="mr-1 h-4 w-4" />
          Move
        </Button>

        <Separator orientation="vertical" className="mx-1 h-4" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onBulkDelete}
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className="text-blue-700 hover:bg-blue-100 hover:text-blue-900"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
