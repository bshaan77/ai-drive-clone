/**
 * Folders API Route
 *
 * Handles folder operations:
 * - POST: Create a new folder
 * - GET: List folders for the current user
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { folders, users } from "~/server/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
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

    const body = (await request.json()) as { name: string; parentId?: string };
    const { name, parentId } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 },
      );
    }

    if (name.length > 255) {
      return NextResponse.json(
        { error: "Folder name must be less than 255 characters" },
        { status: 400 },
      );
    }

    // Check if folder with same name already exists in the same parent
    const existingFolder = await db.query.folders.findFirst({
      where: and(
        eq(folders.name, name.trim()),
        eq(folders.ownerId, userRecord.id),
        parentId ? eq(folders.parentId, parentId) : isNull(folders.parentId),
      ),
    });

    if (existingFolder) {
      return NextResponse.json(
        { error: "A folder with this name already exists" },
        { status: 409 },
      );
    }

    // Create the folder
    const newFolder = await db
      .insert(folders)
      .values({
        name: name.trim(),
        ownerId: userRecord.id,
        parentId: parentId ?? null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      folder: newFolder[0],
    });
  } catch (error) {
    console.error("Create folder error:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 },
    );
  }
}

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
    const parentId = searchParams.get("parentId");
    const allFolders = searchParams.get("all") === "true";

    // Get folders for the user
    let userFolders;

    if (allFolders) {
      // Fetch all folders for the user (for sidebar tree)
      userFolders = await db.query.folders.findMany({
        where: eq(folders.ownerId, userRecord.id),
        orderBy: (folders, { asc }) => [asc(folders.name)],
      });
    } else {
      // Fetch folders filtered by parentId (for main content)
      userFolders = await db.query.folders.findMany({
        where: and(
          eq(folders.ownerId, userRecord.id),
          parentId ? eq(folders.parentId, parentId) : isNull(folders.parentId),
        ),
        orderBy: (folders, { asc }) => [asc(folders.name)],
      });
    }

    return NextResponse.json({
      success: true,
      folders: userFolders,
    });
  } catch (error) {
    console.error("Get folders error:", error);
    return NextResponse.json(
      { error: "Failed to get folders" },
      { status: 500 },
    );
  }
}
