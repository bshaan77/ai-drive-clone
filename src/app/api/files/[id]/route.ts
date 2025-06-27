/**
 * Individual File Operations API Route
 *
 * Handles operations on individual files:
 * - GET: Download file
 * - PATCH: Rename file
 * - DELETE: Delete file
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { files, users } from "~/server/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { del } from "@vercel/blob";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRecord = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await context.params;

    // Get file record
    const fileRecord = await db.query.files.findFirst({
      where: and(eq(files.id, id), eq(files.ownerId, userRecord.id)),
    });

    if (!fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Return file info for download
    return NextResponse.json({
      success: true,
      file: {
        id: fileRecord.id,
        name: fileRecord.name,
        originalName: fileRecord.originalName,
        mimeType: fileRecord.mimeType,
        size: fileRecord.size,
        blobUrl: fileRecord.blobUrl,
        createdAt: fileRecord.createdAt,
      },
    });
  } catch (error) {
    console.error("File download error:", error);
    return NextResponse.json({ error: "Failed to get file" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRecord = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as { name: string };
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Valid file name is required" },
        { status: 400 },
      );
    }

    // Check if file exists and belongs to user
    const existingFile = await db.query.files.findFirst({
      where: and(eq(files.id, id), eq(files.ownerId, userRecord.id)),
    });

    if (!existingFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Check if name already exists in the same folder
    const duplicateFile = await db.query.files.findFirst({
      where: and(
        eq(files.name, name.trim()),
        eq(files.ownerId, userRecord.id),
        existingFile.folderId
          ? eq(files.folderId, existingFile.folderId)
          : isNull(files.folderId),
      ),
    });

    if (duplicateFile && duplicateFile.id !== id) {
      return NextResponse.json(
        { error: "A file with this name already exists" },
        { status: 409 },
      );
    }

    // Update file name
    const updatedFile = await db
      .update(files)
      .set({
        name: name.trim(),
        updatedAt: new Date(),
      })
      .where(eq(files.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      file: updatedFile[0],
    });
  } catch (error) {
    console.error("File rename error:", error);
    return NextResponse.json(
      { error: "Failed to rename file" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRecord = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await context.params;

    // Get file record
    const fileRecord = await db.query.files.findFirst({
      where: and(eq(files.id, id), eq(files.ownerId, userRecord.id)),
    });

    if (!fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete from Vercel Blob storage
    try {
      await del(fileRecord.blobUrl);
    } catch (blobError) {
      console.warn("Failed to delete blob:", blobError);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    await db.delete(files).where(eq(files.id, id));

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("File delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
