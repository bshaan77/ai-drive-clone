/**
 * Shared Resource Page
 *
 * Handles access to files and folders via public sharing links
 * Supports both authenticated and unauthenticated access
 */

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  File,
  Folder,
  Download,
  Eye,
  Edit,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { FilePreview } from "~/components/file-display/FilePreview";

interface SharedResource {
  id: string;
  name: string;
  type: "file" | "folder";
  permission: "view" | "edit";
  mimeType?: string;
  size?: number;
  blobUrl?: string;
  createdAt: string;
}

interface Owner {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface PublicLink {
  token: string;
  expiresAt?: string;
  downloadCount: number;
}

export default function SharedResourcePage() {
  const params = useParams();
  const token = params.token as string;

  const [resource, setResource] = useState<SharedResource | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [publicLink, setPublicLink] = useState<PublicLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    void fetchSharedResource();
  }, [token]);

  const fetchSharedResource = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/shared/${token}`);
      const data: unknown = await response.json();

      if (!response.ok) {
        if (
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as Record<string, unknown>).error === "string"
        ) {
          setError((data as Record<string, unknown>).error as string);
        } else {
          setError("Failed to load shared resource");
        }
        return;
      }

      setResource(
        typeof data === "object" &&
          data !== null &&
          "resource" in data &&
          typeof (data as Record<string, unknown>).resource === "object"
          ? ((data as Record<string, unknown>).resource as SharedResource)
          : null,
      );
      setOwner(
        typeof data === "object" &&
          data !== null &&
          "owner" in data &&
          typeof (data as Record<string, unknown>).owner === "object"
          ? ((data as Record<string, unknown>).owner as Owner)
          : null,
      );
      setPublicLink(
        typeof data === "object" &&
          data !== null &&
          "publicLink" in data &&
          typeof (data as Record<string, unknown>).publicLink === "object"
          ? ((data as Record<string, unknown>).publicLink as PublicLink)
          : null,
      );
    } catch (err) {
      setError("Failed to load shared resource");
      console.error("Shared resource fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (resource?.blobUrl) {
      const link = document.createElement("a");
      link.href = resource.blobUrl;
      link.download = resource.name;
      link.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <File className="h-8 w-8 text-blue-500" />;
    if (mimeType.startsWith("image/"))
      return <File className="h-8 w-8 text-green-500" />;
    if (mimeType.startsWith("video/"))
      return <File className="h-8 w-8 text-purple-500" />;
    if (mimeType.startsWith("audio/"))
      return <File className="h-8 w-8 text-orange-500" />;
    if (mimeType.includes("pdf"))
      return <File className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading shared resource...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Access Error
            </h2>
            <p className="text-gray-600">{error}</p>
            <p className="mt-2 text-sm text-gray-500">
              This link may be invalid, expired, or the resource may have been
              removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!resource || !owner) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Resource Not Found
            </h2>
            <p className="text-gray-600">
              The shared resource could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          {resource.type === "folder" ? (
            <Folder className="h-8 w-8 text-blue-500" />
          ) : (
            getFileIcon(resource.mimeType)
          )}
          <h1 className="text-3xl font-bold text-gray-900">{resource.name}</h1>
        </div>
        <p className="text-gray-600">
          Shared by{" "}
          {owner.firstName && owner.lastName
            ? `${owner.firstName} ${owner.lastName}`
            : owner.email}
        </p>
      </div>

      {/* Resource Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Resource Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{resource.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Permission:</span>
                <Badge
                  variant={
                    resource.permission === "edit" ? "default" : "secondary"
                  }
                >
                  {resource.permission}
                </Badge>
              </div>
              {resource.size && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">
                    {formatFileSize(resource.size)}
                  </span>
                </div>
              )}
              {resource.mimeType && (
                <div className="flex justify-between">
                  <span className="text-gray-600">File Type:</span>
                  <span className="font-medium">{resource.mimeType}</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Shared by:</span>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">
                    {owner.firstName && owner.lastName
                      ? `${owner.firstName} ${owner.lastName}`
                      : owner.email}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {publicLink?.downloadCount !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Downloads:</span>
                  <span className="font-medium">
                    {publicLink.downloadCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {resource.type === "file" && resource.blobUrl && (
          <>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </>
        )}
        {resource.permission === "edit" && (
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {/* File Preview Modal */}
      {showPreview && resource.type === "file" && resource.blobUrl && (
        <FilePreview
          file={{
            id: resource.id,
            name: resource.name,
            originalName: resource.name,
            mimeType: resource.mimeType ?? "application/octet-stream",
            size: resource.size ?? 0,
            blobUrl: resource.blobUrl,
            createdAt: resource.createdAt,
          }}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
