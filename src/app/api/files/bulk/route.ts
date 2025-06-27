/**
 * Bulk File Operations API Route
 *
 * Handles operations on multiple files:
 * - POST: Bulk delete files
 * - GET: Get multiple files for bulk download
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { files, users } from "~/server/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { del } from "@vercel/blob";

export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const fileIds = searchParams.get("ids");

    if (!fileIds) {
      return NextResponse.json(
        { error: "File IDs are required" },
        { status: 400 },
      );
    }

    const ids = fileIds.split(",").filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "At least one file ID is required" },
        { status: 400 },
      );
    }

    // Get files that belong to the user
    const userFiles = await db.query.files.findMany({
      where: and(inArray(files.id, ids), eq(files.ownerId, userRecord.id)),
    });

    return NextResponse.json({
      success: true,
      files: userFiles.map((file) => ({
        id: file.id,
        name: file.name,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        blobUrl: file.blobUrl,
        createdAt: file.createdAt,
      })),
    });
  } catch (error) {
    console.error("Bulk file download error:", error);
    return NextResponse.json({ error: "Failed to get files" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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

    const body = (await request.json()) as { fileIds: string[] };
    const { fileIds } = body;

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: "Valid file IDs array is required" },
        { status: 400 },
      );
    }

    // Get files that belong to the user
    const userFiles = await db.query.files.findMany({
      where: and(inArray(files.id, fileIds), eq(files.ownerId, userRecord.id)),
    });

    if (userFiles.length === 0) {
      return NextResponse.json(
        { error: "No valid files found to delete" },
        { status: 404 },
      );
    }

    // Delete from Vercel Blob storage
    const blobDeletions = userFiles.map(async (file) => {
      try {
        await del(file.blobUrl);
      } catch (error) {
        console.warn(`Failed to delete blob for file ${file.id}:`, error);
      }
    });

    await Promise.all(blobDeletions);

    // Delete from database
    const deletedFiles = await db
      .delete(files)
      .where(
        and(
          inArray(
            files.id,
            userFiles.map((f) => f.id),
          ),
          eq(files.ownerId, userRecord.id),
        ),
      )
      .returning();

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedFiles.length} files`,
      deletedCount: deletedFiles.length,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete files" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = (await request.json()) as {
      fileIds: string[];
      action: "move";
      value?: string; // folderId for move action
    };
    const { fileIds, action, value } = body;

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: "Valid file IDs array is required" },
        { status: 400 },
      );
    }

    // Get files that belong to the user
    const userFiles = await db.query.files.findMany({
      where: and(inArray(files.id, fileIds), eq(files.ownerId, userRecord.id)),
    });

    if (userFiles.length === 0) {
      return NextResponse.json(
        { error: "No valid files found" },
        { status: 404 },
      );
    }

    let updatedFiles;

    switch (action) {
      case "move":
        if (!value) {
          return NextResponse.json(
            { error: "Folder ID is required for move action" },
            { status: 400 },
          );
        }
        updatedFiles = await db
          .update(files)
          .set({
            folderId: value,
            updatedAt: new Date(),
          })
          .where(
            and(
              inArray(
                files.id,
                userFiles.map((f) => f.id),
              ),
              eq(files.ownerId, userRecord.id),
            ),
          )
          .returning();
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action specified" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedFiles.length} files`,
      updatedCount: updatedFiles.length,
      action,
    });
  } catch (error) {
    console.error("Bulk update error:", error);
    return NextResponse.json(
      { error: "Failed to update files" },
      { status: 500 },
    );
  }
}
