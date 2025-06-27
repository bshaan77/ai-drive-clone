"use client";

import { FileCard } from "./FileCard";
import type { FileActions, FileRecord } from "~/types/file";
import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent } from "~/components/ui/card";
import { Upload, FolderOpen } from "lucide-react";
import { Button } from "~/components/ui/button";

interface FileSelection {
  selectedFiles: Set<string>;
  isAllSelected: boolean;
}

interface FileGridProps {
  files: FileRecord[];
  selection: FileSelection;
  onSelect: (fileId: string, selected: boolean) => void;
  actions: FileActions;
  isLoading?: boolean;
  onUpload?: () => void;
}

function FileCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      </CardContent>
    </Card>
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

export function FileGrid({
  files,
  selection,
  onSelect,
  actions,
  isLoading = false,
  onUpload,
}: FileGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <FileCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return <EmptyState onUpload={onUpload} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          isSelected={selection.selectedFiles.has(file.id)}
          onSelect={onSelect}
          actions={actions}
          viewMode="grid"
        />
      ))}
    </div>
  );
}
