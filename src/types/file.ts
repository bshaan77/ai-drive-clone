/**
 * File Types
 *
 * Type definitions for file-related functionality
 */

export interface FileItem {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  category: FileCategory;
  icon: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
  url?: string;
  thumbnailUrl?: string;
}

export type FileCategory =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "archive"
  | "code"
  | "spreadsheet"
  | "presentation"
  | "pdf"
  | "text"
  | "unknown";

export type ViewMode = "grid" | "list";

export type SortField = "name" | "size" | "createdAt" | "category";
export type SortOrder = "asc" | "desc";

export interface FileSelection {
  selectedFiles: Set<string>;
  isAllSelected: boolean;
}

export interface FileActions {
  onDownload: (fileId: string) => void;
  onPreview: (fileId: string) => void;
  onShare: (fileId: string) => void;
  onRename: (fileId: string, newName: string) => void;
  onMove: (fileId: string, folderId: string) => void;
  onDelete: (fileId: string) => void;
}

export interface FileRecord {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  sizeFormatted: string;
  blobUrl: string;
  category: FileCategory;
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
