/**
 * File Upload API Route
 *
 * Handles file uploads to Vercel Blob Storage with proper validation,
 * file type detection, and metadata storage.
 */

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { files } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";

// Maximum file size (15MB)
const MAX_FILE_SIZE = 15 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = [
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",

  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",

  // Videos
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",

  // Audio
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp4",

  // Archives
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "application/gzip",

  // Code
  "text/javascript",
  "text/typescript",
  "text/css",
  "text/html",
  "application/json",
  "application/xml",
];

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user record
    let userRecord = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!userRecord) {
      // Create user record if it doesn't exist
      const userRecords = await db
        .insert(users)
        .values({
          clerkId: userId,
          email: "user@example.com", // We'll update this later
          firstName: "User",
          lastName: "Name",
        })
        .returning();
      userRecord = userRecords[0];
    }

    if (!userRecord) {
      throw new Error("Failed to create or find user record");
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folderId = formData.get("folderId") as string | null;

    // Validate file
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 15MB" },
        { status: 400 },
      );
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 },
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}-${randomId}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Store file metadata in database
    const fileRecords = await db
      .insert(files)
      .values({
        name: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        blobUrl: blob.url,
        folderId: folderId ?? null,
        ownerId: userRecord.id, // Use the internal user ID
        metadata: {
          uploadedAt: new Date().toISOString(),
          blobId: blob.pathname,
          contentType: file.type,
        },
      })
      .returning();

    const fileRecord = fileRecords[0];
    if (!fileRecord) {
      throw new Error("Failed to create file record");
    }

    return NextResponse.json({
      success: true,
      file: {
        id: fileRecord.id,
        name: fileRecord.name,
        size: fileRecord.size,
        mimeType: fileRecord.mimeType,
        url: fileRecord.blobUrl,
        uploadedAt: fileRecord.createdAt,
      },
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
