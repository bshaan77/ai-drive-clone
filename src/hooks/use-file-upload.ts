/**
 * File Upload Hook
 *
 * Provides a clean interface for uploading files to Vercel Blob Storage
 * with progress tracking and error handling. Supports both single and multiple file uploads.
 */

import { useState, useCallback } from "react";

type UploadProgress = Record<string, number>;

export function useFileUpload() {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setUploadError(null);
  }, []);

  const uploadFiles = useCallback(async (files: File[]) => {
    setIsUploading(true);
    setUploadError(null);

    // Initialize progress for all files
    const initialProgress: UploadProgress = {};
    files.forEach((file) => {
      initialProgress[file.name] = 0;
    });
    setUploadProgress(initialProgress);

    try {
      // Validate files
      const maxSize = 15 * 1024 * 1024; // 15MB
      const invalidFiles = files.filter((file) => file.size > maxSize);

      if (invalidFiles.length > 0) {
        throw new Error(
          `Files too large: ${invalidFiles.map((f) => f.name).join(", ")}. Maximum size is 15MB.`,
        );
      }

      // Upload files one by one or in parallel
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          // Track upload progress
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progress = (event.loaded / event.total) * 100;
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: progress,
              }));
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: 100,
              }));
              resolve();
            } else {
              reject(new Error(`Upload failed for ${file.name}`));
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error(`Network error uploading ${file.name}`));
          });

          xhr.open("POST", "/api/upload");
          xhr.send(formData);
        });
      });

      await Promise.all(uploadPromises);

      // Clear progress after successful upload
      setTimeout(() => {
        setUploadProgress({});
      }, 1000);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadFiles,
    uploadProgress,
    isUploading,
    uploadError,
    clearError,
  };
}
