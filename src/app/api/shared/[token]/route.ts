/**
 * Public Link Access API Route
 *
 * Handles access to files and folders via public sharing links
 */

import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { publicLinks, files, folders, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    // Find the public link
    const publicLink = await db.query.publicLinks.findFirst({
      where: eq(publicLinks.token, token),
    });

    if (!publicLink) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Check if link has expired
    if (publicLink.expiresAt && new Date() > new Date(publicLink.expiresAt)) {
      return NextResponse.json({ error: "Link has expired" }, { status: 410 });
    }

    // Get the shared resource (file or folder)
    let resource = null;
    let resourceType = null;

    if (publicLink.fileId) {
      resource = await db.query.files.findFirst({
        where: eq(files.id, publicLink.fileId),
      });
      resourceType = "file";
    } else if (publicLink.folderId) {
      resource = await db.query.folders.findFirst({
        where: eq(folders.id, publicLink.folderId),
      });
      resourceType = "folder";
    }

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    // Get owner information
    const owner = await db.query.users.findFirst({
      where: eq(users.id, publicLink.ownerId),
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    // Increment download count for files
    if (resourceType === "file") {
      await db
        .update(publicLinks)
        .set({ downloadCount: (publicLink.downloadCount ?? 0) + 1 })
        .where(eq(publicLinks.id, publicLink.id));
    }

    return NextResponse.json({
      success: true,
      resource: {
        ...resource,
        type: resourceType,
        permission: publicLink.permission,
      },
      owner,
      publicLink: {
        token: publicLink.token,
        expiresAt: publicLink.expiresAt,
        downloadCount: publicLink.downloadCount,
      },
    });
  } catch (error) {
    console.error("Public link access error:", error);
    return NextResponse.json(
      { error: "Failed to access shared resource" },
      { status: 500 },
    );
  }
}
