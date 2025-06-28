/**
 * Folder Sharing API Route
 *
 * Handles sharing folders with specific users and creating public links
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { folders, users, shares, publicLinks } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: folderId } = await params;

    // Get current user
    const currentUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify folder exists and user owns it
    const folder = await db.query.folders.findFirst({
      where: and(eq(folders.id, folderId), eq(folders.ownerId, currentUser.id)),
    });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      users: Array<{ id: string; permission: "view" | "edit" }>;
      createPublicLink: boolean;
      publicPermission: "view" | "edit";
    };

    const { users: usersToShare, createPublicLink, publicPermission } = body;

    // Share with specific users
    if (usersToShare.length > 0) {
      const sharePromises = usersToShare.map(async (userShare) => {
        // Verify the user exists
        const targetUser = await db.query.users.findFirst({
          where: eq(users.id, userShare.id),
        });

        if (!targetUser) {
          throw new Error(`User ${userShare.id} not found`);
        }

        // Check if share already exists
        const existingShare = await db.query.shares.findFirst({
          where: and(
            eq(shares.folderId, folderId),
            eq(shares.ownerId, currentUser.id),
            eq(shares.sharedWithId, userShare.id),
          ),
        });

        if (existingShare) {
          // Update existing share
          await db
            .update(shares)
            .set({ permission: userShare.permission })
            .where(eq(shares.id, existingShare.id));
        } else {
          // Create new share
          await db.insert(shares).values({
            folderId,
            ownerId: currentUser.id,
            sharedWithId: userShare.id,
            permission: userShare.permission,
          });
        }
      });

      await Promise.all(sharePromises);
    }

    // Create public link if requested
    let publicLinkData = null;
    if (createPublicLink) {
      const token = randomUUID();
      const publicLink = await db
        .insert(publicLinks)
        .values({
          token,
          folderId,
          ownerId: currentUser.id,
          permission: publicPermission,
        })
        .returning();

      // Get the base URL from the request headers
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") ?? "http";
      const baseUrl = `${protocol}://${host}`;

      publicLinkData = {
        url: `${baseUrl}/shared/${token}`,
        token: publicLink[0]?.token,
      };
    }

    return NextResponse.json({
      success: true,
      message: "Folder shared successfully",
      publicLink: publicLinkData,
    });
  } catch (error) {
    console.error("Folder sharing error:", error);
    return NextResponse.json(
      { error: "Failed to share folder" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: folderId } = await params;

    // Get current user
    const currentUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get folder shares
    const folderShares = await db.query.shares.findMany({
      where: eq(shares.folderId, folderId),
      with: {
        sharedWith: {
          columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Get public link
    const publicLink = await db.query.publicLinks.findFirst({
      where: and(
        eq(publicLinks.folderId, folderId),
        eq(publicLinks.ownerId, currentUser.id),
      ),
    });

    return NextResponse.json({
      shares: folderShares.map((share) => ({
        user: share.sharedWith,
        permission: share.permission,
      })),
      publicLink: publicLink
        ? {
            token: publicLink.token,
            permission: publicLink.permission,
            url: `${request.headers.get("x-forwarded-proto") ?? "http"}://${request.headers.get("host")}/shared/${publicLink.token}`,
          }
        : null,
    });
  } catch (error) {
    console.error("Get folder shares error:", error);
    return NextResponse.json(
      { error: "Failed to get folder shares" },
      { status: 500 },
    );
  }
}
