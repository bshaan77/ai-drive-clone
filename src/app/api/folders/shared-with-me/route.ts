/**
 * Shared Folders API Route
 *
 * Retrieves folders that have been shared with the current user
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { folders, users, shares } from "~/server/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";

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

    // Get folders shared with the current user
    const sharedFolders = await db.query.shares.findMany({
      where: and(
        eq(shares.sharedWithId, userRecord.id),
        isNotNull(shares.folderId), // Only folders, not files
      ),
      with: {
        folder: {
          with: {
            owner: {
              columns: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    // Transform the data to match the expected format
    const formattedFolders = sharedFolders
      .filter((share) => share.folder) // Filter out any null folders
      .map((share) => ({
        id: share.folder!.id,
        name: share.folder!.name,
        createdAt: share.folder!.createdAt,
        updatedAt: share.folder!.updatedAt,
        owner: share.folder!.owner,
        permission: share.permission,
      }));

    return NextResponse.json({
      success: true,
      folders: formattedFolders,
    });
  } catch (error) {
    console.error("Get shared folders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared folders" },
      { status: 500 },
    );
  }
}
