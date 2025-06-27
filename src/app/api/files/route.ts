/**
 * Files List API Route
 *
 * Lists all files uploaded by the authenticated user
 * for testing and verification purposes.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { files, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user record
    const userRecord = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's files
    const userFiles = await db.query.files.findMany({
      where: eq(files.ownerId, userRecord.id),
      orderBy: (files, { desc }) => [desc(files.createdAt)],
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
        updatedAt: file.updatedAt,
      })),
      total: userFiles.length,
    });
  } catch (error) {
    console.error("Files list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}
