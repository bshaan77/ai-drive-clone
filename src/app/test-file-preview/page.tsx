/**
 * Test File Preview Page
 *
 * Test page for file preview functionality with different file types
 */

"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { FilePreview } from "~/components/file-display/FilePreview";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  File,
  Image,
  FileText,
  FileVideo,
  FileAudio,
  Archive,
  Eye,
} from "lucide-react";

// Sample files for testing
const sampleFiles = [
  {
    id: "1",
    name: "sample-image.jpg",
    originalName: "sample-image.jpg",
    mimeType: "image/jpeg",
    size: 1024 * 1024, // 1MB
    blobUrl: "https://picsum.photos/800/600",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "sample-text.txt",
    originalName: "sample-text.txt",
    mimeType: "text/plain",
    size: 512,
    blobUrl:
      "data:text/plain;base64,VGhpcyBpcyBhIHNhbXBsZSB0ZXh0IGZpbGUuCkl0IGNvbnRhaW5zIG11bHRpcGxlIGxpbmVzIG9mIHRleHQuCgpMaW5lIDM6IE1vcmUgdGV4dCBoZXJlLgpMaW5lIDQ6IEFuZCBldmVuIG1vcmUgdGV4dC4=",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "sample-video.mp4",
    originalName: "sample-video.mp4",
    mimeType: "video/mp4",
    size: 5 * 1024 * 1024, // 5MB
    blobUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "sample-audio.mp3",
    originalName: "sample-audio.mp3",
    mimeType: "audio/mpeg",
    size: 2 * 1024 * 1024, // 2MB
    blobUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "sample-archive.zip",
    originalName: "sample-archive.zip",
    mimeType: "application/zip",
    size: 1024 * 1024, // 1MB
    blobUrl: "#",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "sample-document.pdf",
    originalName: "sample-document.pdf",
    mimeType: "application/pdf",
    size: 3 * 1024 * 1024, // 3MB
    blobUrl: "#",
    createdAt: new Date().toISOString(),
  },
];

export default function TestFilePreviewPage() {
  const [previewFile, setPreviewFile] = useState<
    (typeof sampleFiles)[0] | null
  >(null);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/"))
      return <Image className="h-6 w-6 text-blue-500" />;
    if (mimeType.startsWith("video/"))
      return <FileVideo className="h-6 w-6 text-purple-500" />;
    if (mimeType.startsWith("audio/"))
      return <FileAudio className="h-6 w-6 text-green-500" />;
    if (mimeType.includes("text/"))
      return <FileText className="h-6 w-6 text-orange-500" />;
    if (mimeType.includes("zip") || mimeType.includes("rar"))
      return <Archive className="h-6 w-6 text-red-500" />;
    return <File className="h-6 w-6 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          File Preview Test
        </h1>
        <p className="text-gray-600">
          Test the file preview functionality with different file types. Click
          the preview button to open the file preview modal.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sampleFiles.map((file) => (
          <Card key={file.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                {getFileIcon(file.mimeType)}
                <div className="min-w-0 flex-1">
                  <CardTitle className="truncate text-lg">
                    {file.name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{file.mimeType}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  onClick={() => setPreviewFile(file)}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <Eye className="h-4 w-4" />
                  Preview File
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={() => {
            console.log("Download clicked for:", previewFile.name);
            // In a real app, this would trigger the actual download
          }}
        />
      )}

      <div className="mt-8 rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 font-medium text-blue-900">Test Instructions:</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div>
            • Click &quot;Preview File&quot; to test the file preview modal
          </div>
          <div>
            • Test different file types: images, text, video, audio, archives
          </div>
          <div>• Try the image controls: zoom, rotate, reset</div>
          <div>• Test the download button in the preview</div>
          <div>
            • Verify that unsupported file types show appropriate messages
          </div>
        </div>
      </div>
    </div>
  );
}
