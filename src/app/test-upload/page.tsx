/**
 * File Upload Test Page
 *
 * A simple test page to verify file upload functionality works correctly
 * with drag-and-drop interface and progress tracking.
 */

"use client";

import { useState } from "react";
import { Upload, File, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useFileUpload } from "~/hooks/use-file-upload";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function TestUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      id: string;
      name: string;
      size: number;
      url: string;
      uploadedAt: string;
    }>
  >([]);

  const { uploadFile, isUploading, progress, error, reset } = useFileUpload();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      const result = await uploadFile(file);
      if (result.success && result.file) {
        setUploadedFiles((prev) => [...prev, result.file!]);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          File Upload Test
        </h1>
        <p className="text-gray-600">
          Test the file upload functionality with drag-and-drop or file
          selection.
        </p>
      </div>

      {/* Upload Area */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="mb-2 text-lg font-medium text-gray-900">
              Drop files here or click to select
            </p>
            <p className="mb-4 text-sm text-gray-500">
              Supports images, documents, videos, and more (max 15MB)
            </p>

            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button asChild>
                <span>Choose Files</span>
              </Button>
            </label>
          </div>

          {/* Upload Progress */}
          {isUploading && progress && (
            <div className="mt-4 rounded-lg bg-blue-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Uploading...</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {formatFileSize(progress.loaded)} /{" "}
                {formatFileSize(progress.total)}(
                {progress.percentage.toFixed(1)}%)
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="font-medium text-red-700">Upload Error</span>
              </div>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Uploaded Files ({uploadedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                >
                  <File className="h-8 w-8 text-blue-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} •{" "}
                      {new Date(file.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadedFiles([]);
                  reset();
                }}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
