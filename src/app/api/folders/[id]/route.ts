/**
 * Get Single Folder API Route
 *
 * Retrieves a single folder by ID for navigation and breadcrumb purposes
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { folders, users, files } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const { id: folderId } = await params;

    // Get the folder that belongs to the user
    const folder = await db.query.folders.findFirst({
      where: and(eq(folders.id, folderId), eq(folders.ownerId, userRecord.id)),
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      folder: {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        parentId: folder.parentId,
        ownerId: folder.ownerId,
        isPublic: folder.isPublic,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get folder error:", error);
    return NextResponse.json(
      { error: "Failed to fetch folder" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const { id: folderId } = await params;
    const body = (await request.json()) as { name: string };

    if (!body.name || body.name.trim() === "") {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 },
      );
    }

    // Verify folder exists and user owns it
    const existingFolder = await db.query.folders.findFirst({
      where: and(eq(folders.id, folderId), eq(folders.ownerId, userRecord.id)),
    });

    if (!existingFolder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Update the folder name
    await db
      .update(folders)
      .set({
        name: body.name.trim(),
        updatedAt: new Date(),
      })
      .where(eq(folders.id, folderId));

    return NextResponse.json({
      success: true,
      message: "Folder renamed successfully",
    });
  } catch (error) {
    console.error("Rename folder error:", error);
    return NextResponse.json(
      { error: "Failed to rename folder" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const { id: folderId } = await params;

    // Verify folder exists and user owns it
    const existingFolder = await db.query.folders.findFirst({
      where: and(eq(folders.id, folderId), eq(folders.ownerId, userRecord.id)),
    });

    if (!existingFolder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Check if folder has any files or subfolders
    const filesInFolder = await db.query.files.findMany({
      where: eq(files.folderId, folderId),
    });

    const subfolders = await db.query.folders.findMany({
      where: eq(folders.parentId, folderId),
    });

    if (filesInFolder.length > 0 || subfolders.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete folder that contains files or subfolders" },
        { status: 400 },
      );
    }

    // Delete the folder
    await db.delete(folders).where(eq(folders.id, folderId));

    return NextResponse.json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (error) {
    console.error("Delete folder error:", error);
    return NextResponse.json(
      { error: "Failed to delete folder" },
      { status: 500 },
    );
  }
}
