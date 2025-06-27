/**
 * Get Single Folder API Route
 *
 * Retrieves a single folder by ID for navigation and breadcrumb purposes
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { folders, users } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
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

    const folderId = params.id;

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
