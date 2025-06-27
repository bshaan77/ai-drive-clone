/**
 * File Utilities
 *
 * Provides utilities for file type detection, icon mapping,
 * metadata extraction, and file validation.
 */

import { type ClassValue, clsx } from "clsx";

/**
 * File type categories for better organization
 */
export const FILE_CATEGORIES = {
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  DOCUMENT: "document",
  ARCHIVE: "archive",
  CODE: "code",
  SPREADSHEET: "spreadsheet",
  PRESENTATION: "presentation",
  PDF: "pdf",
  TEXT: "text",
  UNKNOWN: "unknown",
} as const;

export type FileCategory =
  (typeof FILE_CATEGORIES)[keyof typeof FILE_CATEGORIES];

/**
 * File type detection and categorization
 */
export function getFileCategory(mimeType: string): FileCategory {
  if (mimeType.startsWith("image/")) return FILE_CATEGORIES.IMAGE;
  if (mimeType.startsWith("video/")) return FILE_CATEGORIES.VIDEO;
  if (mimeType.startsWith("audio/")) return FILE_CATEGORIES.AUDIO;
  if (mimeType.includes("pdf")) return FILE_CATEGORIES.PDF;
  if (mimeType.includes("word") || mimeType.includes("document"))
    return FILE_CATEGORIES.DOCUMENT;
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
    return FILE_CATEGORIES.SPREADSHEET;
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation"))
    return FILE_CATEGORIES.PRESENTATION;
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z") ||
    mimeType.includes("gzip")
  )
    return FILE_CATEGORIES.ARCHIVE;
  if (
    mimeType.includes("javascript") ||
    mimeType.includes("typescript") ||
    mimeType.includes("css") ||
    mimeType.includes("html") ||
    mimeType.includes("json") ||
    mimeType.includes("xml")
  )
    return FILE_CATEGORIES.CODE;
  if (mimeType.startsWith("text/")) return FILE_CATEGORIES.TEXT;
  return FILE_CATEGORIES.UNKNOWN;
}

/**
 * File icon mapping based on file type
 */
export function getFileIcon(mimeType: string): string {
  const category = getFileCategory(mimeType);

  switch (category) {
    case FILE_CATEGORIES.IMAGE:
      return "🖼️";
    case FILE_CATEGORIES.VIDEO:
      return "🎥";
    case FILE_CATEGORIES.AUDIO:
      return "🎵";
    case FILE_CATEGORIES.PDF:
      return "📄";
    case FILE_CATEGORIES.DOCUMENT:
      return "📝";
    case FILE_CATEGORIES.SPREADSHEET:
      return "📊";
    case FILE_CATEGORIES.PRESENTATION:
      return "📋";
    case FILE_CATEGORIES.ARCHIVE:
      return "📦";
    case FILE_CATEGORIES.CODE:
      return "💻";
    case FILE_CATEGORIES.TEXT:
      return "📄";
    default:
      return "📄";
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Validate file size
 */
export function validateFileSize(
  size: number,
  maxSize: number = 15 * 1024 * 1024,
): boolean {
  return size <= maxSize;
}

/**
 * Validate file type against allowed types
 */
export function validateFileType(
  mimeType: string,
  allowedTypes: string[],
): boolean {
  return allowedTypes.includes(mimeType);
}

/**
 * File metadata interface
 */
export interface FileMetadata {
  originalName: string;
  mimeType: string;
  size: number;
  lastModified: number;
  uploadedAt: string;
  dimensions?: { width: number; height: number } | null;
  duration?: number | null;
  [key: string]: unknown;
}

/**
 * Extract file metadata based on type
 */
export async function extractFileMetadata(file: File): Promise<FileMetadata> {
  const metadata: FileMetadata = {
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    lastModified: file.lastModified,
    uploadedAt: new Date().toISOString(),
  };

  // Extract additional metadata based on file type
  const category = getFileCategory(file.type);

  switch (category) {
    case FILE_CATEGORIES.IMAGE:
      metadata.dimensions = await extractImageDimensions(file);
      break;
    case FILE_CATEGORIES.VIDEO:
      metadata.duration = await extractVideoDuration(file);
      break;
    case FILE_CATEGORIES.AUDIO:
      metadata.duration = await extractAudioDuration(file);
      break;
  }

  return metadata;
}

/**
 * Extract image dimensions
 */
async function extractImageDimensions(
  file: File,
): Promise<{ width: number; height: number } | null> {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = URL.createObjectURL(file);
    });
  } catch (error) {
    console.error("Error extracting image dimensions:", error);
    return null;
  }
}

/**
 * Extract video duration
 */
async function extractVideoDuration(file: File): Promise<number | null> {
  try {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      video.onerror = () => {
        resolve(null);
      };
      video.src = URL.createObjectURL(file);
    });
  } catch (error) {
    console.error("Error extracting video duration:", error);
    return null;
  }
}

/**
 * Extract audio duration
 */
async function extractAudioDuration(file: File): Promise<number | null> {
  try {
    return new Promise((resolve) => {
      const audio = document.createElement("audio");
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
      audio.onerror = () => {
        resolve(null);
      };
      audio.src = URL.createObjectURL(file);
    });
  } catch (error) {
    console.error("Error extracting audio duration:", error);
    return null;
  }
}

/**
 * Generate safe filename
 */
export function generateSafeFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split(".").pop() ?? "";
  const baseName = originalName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "_");

  return `${baseName}_${timestamp}_${randomId}.${extension}`;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

/**
 * Check if file is an image
 */
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/**
 * Check if file is a video
 */
export function isVideo(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

/**
 * Check if file is an audio file
 */
export function isAudio(mimeType: string): boolean {
  return mimeType.startsWith("audio/");
}

/**
 * Check if file is a document
 */
export function isDocument(mimeType: string): boolean {
  return (
    mimeType.includes("document") ||
    mimeType.includes("word") ||
    mimeType.includes("pdf")
  );
}

/**
 * Check if file is an archive
 */
export function isArchive(mimeType: string): boolean {
  return (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z") ||
    mimeType.includes("gzip")
  );
}

/**
 * Utility function for combining class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
