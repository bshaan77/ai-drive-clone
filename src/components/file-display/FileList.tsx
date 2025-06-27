"use client";

import { FileCard } from "./FileCard";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { ChevronUp, ChevronDown, Upload, FolderOpen } from "lucide-react";

interface FileSelection {
  selectedFiles: Set<string>;
  isAllSelected: boolean;
}

interface FileRecord {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  sizeFormatted: string;
  blobUrl: string;
  category: string;
  icon: string;
  folderId: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
  isDocument: boolean;
  isArchive: boolean;
}

type SortField = "name" | "size" | "createdAt" | "category";
type SortOrder = "asc" | "desc";

interface FileActions {
  onDownload: (fileId: string) => void;
  onShare: (fileId: string) => void;
  onRename: (fileId: string, newName: string) => void;
  onMove: (fileId: string, folderId: string) => void;
  onDelete: (fileId: string) => void;
}

interface FileListProps {
  files: FileRecord[];
  selection: FileSelection;
  onSelect: (fileId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  actions: FileActions;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  isLoading?: boolean;
  onUpload?: () => void;
}

function FileListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg border p-3"
        >
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onUpload }: { onUpload?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-gray-50 p-4">
        <FolderOpen className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">No files yet</h3>
      <p className="mb-4 max-w-sm text-gray-500">
        Upload your first files to get started organizing your content
      </p>
      {onUpload && (
        <Button onClick={onUpload} className="bg-blue-600 hover:bg-blue-700">
          <Upload className="mr-2 h-4 w-4" />
          Upload files
        </Button>
      )}
    </div>
  );
}

interface SortHeaderProps {
  field: SortField;
  label: string;
  currentSort?: SortField;
  sortOrder?: SortOrder;
  onSort?: (field: SortField) => void;
  className?: string;
}

function SortHeader({
  field,
  label,
  currentSort,
  sortOrder,
  onSort,
  className,
}: SortHeaderProps) {
  const isActive = currentSort === field;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort?.(field)}
      className={`h-8 justify-start px-2 font-medium text-gray-700 hover:text-gray-900 ${className}`}
    >
      {label}
      {isActive &&
        (sortOrder === "asc" ? (
          <ChevronUp className="ml-1 h-3 w-3" />
        ) : (
          <ChevronDown className="ml-1 h-3 w-3" />
        ))}
    </Button>
  );
}

export function FileList({
  files,
  selection,
  onSelect,
  onSelectAll,
  actions,
  sortField,
  sortOrder,
  onSort,
  isLoading = false,
  onUpload,
}: FileListProps) {
  if (isLoading) {
    return <FileListSkeleton />;
  }

  if (files.length === 0) {
    return <EmptyState onUpload={onUpload} />;
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-t-lg border-b border-gray-200 bg-gray-50 p-3">
        <Checkbox
          checked={selection.isAllSelected}
          onCheckedChange={onSelectAll}
          className="shrink-0"
        />
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="w-8" /> {/* Icon space */}
          <SortHeader
            field="name"
            label="Name"
            currentSort={sortField}
            sortOrder={sortOrder}
            onSort={onSort}
            className="flex-1 justify-start"
          />
        </div>
        <SortHeader
          field="size"
          label="Size"
          currentSort={sortField}
          sortOrder={sortOrder}
          onSort={onSort}
          className="hidden w-20 justify-end sm:flex"
        />
        <SortHeader
          field="category"
          label="Type"
          currentSort={sortField}
          sortOrder={sortOrder}
          onSort={onSort}
          className="hidden w-24 justify-end md:flex"
        />
        <SortHeader
          field="createdAt"
          label="Modified"
          currentSort={sortField}
          sortOrder={sortOrder}
          onSort={onSort}
          className="hidden w-28 justify-end lg:flex"
        />
        <div className="w-8" /> {/* Actions space */}
      </div>

      {/* File List */}
      <div className="space-y-1">
        {files.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            isSelected={selection.selectedFiles.has(file.id)}
            onSelect={onSelect}
            actions={actions}
            viewMode="list"
          />
        ))}
      </div>
    </div>
  );
}
