"use client";

import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { FileActionsMenu } from "./FileActionsMenu";
import {
  FILE_CATEGORY_CONFIG,
  formatFileSize,
  formatDate,
  truncateFileName,
} from "~/lib/file-utils";
import type { FileActions, FileRecord } from "~/types/file";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface FileCardProps {
  file: FileRecord;
  isSelected: boolean;
  onSelect: (fileId: string, selected: boolean) => void;
  actions: FileActions;
  viewMode: "grid" | "list";
}

export function FileCard({
  file,
  isSelected,
  onSelect,
  actions,
  viewMode,
}: FileCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const config =
    FILE_CATEGORY_CONFIG[file.category as keyof typeof FILE_CATEGORY_CONFIG] ||
    FILE_CATEGORY_CONFIG.text;
  const IconComponent = config.icon;

  if (viewMode === "list") {
    return (
      <Card
        className={`group cursor-pointer transition-all hover:shadow-md ${
          isSelected ? "bg-blue-50 ring-2 ring-blue-500" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(file.id, !!checked)}
              className="shrink-0"
            />
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="shrink-0">
                <IconComponent className="h-8 w-8 text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="truncate font-medium text-gray-900">
                      {truncateFileName(file.name)}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>{file.name}</TooltipContent>
                </Tooltip>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="outline" className={config.color}>
                    {config.label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {formatDate(file.createdAt)}
              </span>
              <FileActionsMenu file={file} actions={actions} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`group relative cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "bg-blue-50 ring-2 ring-blue-500" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(file.id, !!checked)}
            className="shrink-0"
          />
          <IconComponent className="h-8 w-8 text-gray-500" />
        </div>
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="truncate font-medium text-gray-900">
                {truncateFileName(file.name)}
              </p>
            </TooltipTrigger>
            <TooltipContent>{file.name}</TooltipContent>
          </Tooltip>
          <div className="flex justify-between">
            <Badge variant="outline" className={config.color}>
              {config.label}
            </Badge>
            <span className="text-sm text-gray-500">
              {formatFileSize(file.size)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {formatDate(file.createdAt)}
          </span>
        </div>
        {/* Actions menu - always visible */}
        <div className="absolute top-2 right-2">
          <FileActionsMenu file={file} actions={actions} />
        </div>
      </CardContent>
    </Card>
  );
}
