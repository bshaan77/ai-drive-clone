/**
 * Shared Files API Route
 *
 * Retrieves files that have been shared with the current user
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { users, shares } from "~/server/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";

export async function GET(_request: NextRequest) {
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

    // Get files shared with the current user
    const sharedFiles = await db.query.shares.findMany({
      where: and(
        eq(shares.sharedWithId, userRecord.id),
        isNotNull(shares.fileId), // Only files, not folders
      ),
      with: {
        file: {
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
    const formattedFiles = sharedFiles
      .filter((share) => share.file) // Filter out any null files
      .map((share) => ({
        id: share.file!.id,
        name: share.file!.name,
        originalName: share.file!.originalName,
        mimeType: share.file!.mimeType,
        size: share.file!.size,
        blobUrl: share.file!.blobUrl,
        createdAt: share.file!.createdAt,
        updatedAt: share.file!.updatedAt,
        owner: share.file!.owner,
        permission: share.permission,
      }));

    return NextResponse.json({
      success: true,
      files: formattedFiles,
    });
  } catch (error) {
    console.error("Get shared files error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared files" },
      { status: 500 },
    );
  }
}
