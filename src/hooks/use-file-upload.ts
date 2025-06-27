/**
 * File Upload Hook
 *
 * Provides a clean interface for uploading files to Vercel Blob Storage
 * with progress tracking and error handling. Supports both single and multiple file uploads.
 */

import { useState, useCallback } from "react";

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

type MultiFileProgress = Record<string, number>;

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
  uploadFiles: (files: File[], folderId?: string) => Promise<UploadResult[]>;
  isUploading: boolean;
  progress: UploadProgress | null;
  multiFileProgress: MultiFileProgress;
  error: string | null;
  reset: () => void;
  clearError: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [multiFileProgress, setMultiFileProgress] = useState<MultiFileProgress>(
    {},
  );
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadFile = async (
    file: File,
    folderId?: string,
  ): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      // Validate file size
      const maxSize = 15 * 1024 * 1024; // 15MB
      if (file.size > maxSize) {
        throw new Error(`File too large: ${file.name}. Maximum size is 15MB.`);
      }

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

  const uploadFiles = useCallback(
    async (files: File[], folderId?: string): Promise<UploadResult[]> => {
      setIsUploading(true);
      setError(null);

      // Initialize progress for all files
      const initialProgress: MultiFileProgress = {};
      files.forEach((file) => {
        initialProgress[file.name] = 0;
      });
      setMultiFileProgress(initialProgress);

      try {
        // Validate files
        const maxSize = 15 * 1024 * 1024; // 15MB
        const invalidFiles = files.filter((file) => file.size > maxSize);

        if (invalidFiles.length > 0) {
          throw new Error(
            `Files too large: ${invalidFiles.map((f) => f.name).join(", ")}. Maximum size is 15MB.`,
          );
        }

        // Upload files with progress tracking
        const uploadPromises = files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          if (folderId) {
            formData.append("folderId", folderId);
          }

          return new Promise<UploadResult>((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener("progress", (event) => {
              if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100;
                setMultiFileProgress((prev) => ({
                  ...prev,
                  [file.name]: progress,
                }));
              }
            });

            xhr.addEventListener("load", () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                setMultiFileProgress((prev) => ({
                  ...prev,
                  [file.name]: 100,
                }));

                try {
                  const result = JSON.parse(xhr.responseText) as UploadResult;
                  resolve(result);
                } catch (err) {
                  reject(new Error(`Invalid response for ${file.name}`));
                }
              } else {
                reject(
                  new Error(
                    `Upload failed for ${file.name}: ${xhr.statusText}`,
                  ),
                );
              }
            });

            xhr.addEventListener("error", () => {
              reject(new Error(`Network error uploading ${file.name}`));
            });

            xhr.open("POST", "/api/upload");
            xhr.send(formData);
          });
        });

        const results = await Promise.all(uploadPromises);

        // Clear progress after successful upload
        setTimeout(() => {
          setMultiFileProgress({});
        }, 1000);

        return results;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  const reset = () => {
    setIsUploading(false);
    setProgress(null);
    setMultiFileProgress({});
    setError(null);
  };

  return {
    uploadFile,
    uploadFiles,
    isUploading,
    progress,
    multiFileProgress,
    error,
    reset,
    clearError,
  };
}
