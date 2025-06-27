/**
 * My Files Page
 *
 * Displays all files uploaded by the current user
 * with links to view them in Neon database and Vercel Blob.
 */

"use client";

import { useEffect, useState } from "react";
import { File, ExternalLink, Database, Cloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface FileRecord {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  blobUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyFilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      const data = (await response.json()) as {
        success: boolean;
        files?: FileRecord[];
        error?: string;
      };

      if (response.ok && data.success) {
        setFiles(data.files ?? []);
      } else {
        setError(data.error ?? "Failed to fetch files");
      }
    } catch (err) {
      setError("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.startsWith("video/")) return "🎥";
    if (mimeType.startsWith("audio/")) return "🎵";
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word")) return "📝";
    if (mimeType.includes("excel")) return "📊";
    if (mimeType.includes("zip")) return "📦";
    return "📄";
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading your files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">My Files</h1>
        <p className="text-gray-600">
          View all your uploaded files. You can see the metadata in Neon
          database and the actual files in Vercel Blob storage.
        </p>
      </div>

      {files.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <File className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No files yet
            </h3>
            <p className="mb-4 text-gray-600">
              Upload some files to see them here.
            </p>
            <Button onClick={() => (window.location.href = "/test-upload")}>
              Upload Files
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getFileIcon(file.mimeType)}</div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-gray-900">
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {file.mimeType} •{" "}
                      {new Date(file.createdAt).toLocaleString()}
                    </p>
                    <p className="truncate font-mono text-xs text-gray-400">
                      ID: {file.id}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.blobUrl, "_blank")}
                    >
                      <ExternalLink className="mr-1 h-4 w-4" />
                      View File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 font-medium text-blue-900">
          Where to see your files:
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>
              <strong>Neon Database:</strong> File metadata, names, sizes,
              timestamps
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span>
              <strong>Vercel Blob:</strong> Actual file contents, previews,
              downloads
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
