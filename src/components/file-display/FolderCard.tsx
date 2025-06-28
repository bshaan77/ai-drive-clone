/**
 * Folder Card Component
 *
 * Displays folder information in grid and list views
 * Similar to FileCard but for folders
 */

"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Folder, Share, Edit, Trash2, FolderOpen } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { formatDate } from "~/lib/file-utils";

interface FolderRecord {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
}

interface FolderActions {
  onOpen: (folderId: string) => void;
  onShare: (folderId: string) => void;
  onRename: (folderId: string, newName: string) => void;
  onDelete: (folderId: string) => void;
  onMove: (folderId: string, newParentId: string) => void;
}

interface FolderCardProps {
  folder: FolderRecord;
  isSelected: boolean;
  onSelect: (folderId: string, selected: boolean) => void;
  actions: FolderActions;
  viewMode: "grid" | "list";
}

export function FolderCard({
  folder,
  isSelected,
  onSelect,
  actions,
  viewMode,
}: FolderCardProps) {
  const handleClick = () => {
    actions.onOpen(folder.id);
  };

  if (viewMode === "list") {
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            className={`group cursor-pointer transition-all hover:shadow-md ${
              isSelected ? "bg-blue-50 ring-2 ring-blue-500" : ""
            }`}
            onClick={handleClick}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelect(folder.id, !!checked)}
                  className="shrink-0"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                />
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="shrink-0">
                    <Folder className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="truncate font-medium text-gray-900">
                          {folder.name}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>{folder.name}</TooltipContent>
                    </Tooltip>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-blue-200 bg-blue-50 text-blue-700"
                      >
                        Folder
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {formatDate(folder.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => actions.onOpen(folder.id)}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Open
          </ContextMenuItem>
          <ContextMenuItem onClick={() => actions.onShare(folder.id)}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => actions.onRename(folder.id, folder.name)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => actions.onDelete(folder.id)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          className={`group relative cursor-pointer transition-all hover:shadow-md ${
            isSelected ? "bg-blue-50 ring-2 ring-blue-500" : ""
          }`}
          onClick={handleClick}
        >
          <CardContent className="p-4">
            <div className="mb-3 flex items-start justify-between">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect(folder.id, !!checked)}
                className="shrink-0"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
              <Folder className="h-8 w-8 text-blue-500" />
            </div>
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="truncate font-medium text-gray-900">
                    {folder.name}
                  </p>
                </TooltipTrigger>
                <TooltipContent>{folder.name}</TooltipContent>
              </Tooltip>
              <div className="flex justify-between">
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                >
                  Folder
                </Badge>
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(folder.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => actions.onOpen(folder.id)}>
          <FolderOpen className="mr-2 h-4 w-4" />
          Open
        </ContextMenuItem>
        <ContextMenuItem onClick={() => actions.onShare(folder.id)}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => actions.onRename(folder.id, folder.name)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => actions.onDelete(folder.id)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
