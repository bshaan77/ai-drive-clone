/**
 * File Upload Hook
 *
 * Provides a clean interface for uploading files to Vercel Blob Storage
 * with progress tracking and error handling.
 */

import { useState } from "react";

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadResult {
  success: boolean;
  file?: {
    id: string;
    name: string;
    size: number;
    mimeType: string;
    url: string;
    uploadedAt: string;
  };
  error?: string;
}

interface UseFileUploadReturn {
  uploadFile: (file: File, folderId?: string) => Promise<UploadResult>;
  isUploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  reset: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    folderId?: string,
  ): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (folderId) {
        formData.append("folderId", folderId);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as UploadResult;

      if (!response.ok) {
        throw new Error(result.error ?? "Upload failed");
      }

      setProgress({ loaded: file.size, total: file.size, percentage: 100 });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setIsUploading(false);
    setProgress(null);
    setError(null);
  };

  return {
    uploadFile,
    isUploading,
    progress,
    error,
    reset,
  };
}
