/**
 * File Sharing API Route
 *
 * Handles sharing files with specific users and creating public links
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { files, users, shares, publicLinks } from "~/server/db/schema";
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

    const { id: fileId } = await params;

    // Get current user
    const currentUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify file exists and user owns it
    const file = await db.query.files.findFirst({
      where: and(eq(files.id, fileId), eq(files.ownerId, currentUser.id)),
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
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
            eq(shares.fileId, fileId),
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
            fileId,
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
          fileId,
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
      message: "File shared successfully",
      publicLink: publicLinkData,
    });
  } catch (error) {
    console.error("File sharing error:", error);
    return NextResponse.json(
      { error: "Failed to share file" },
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

    const { id: fileId } = await params;

    // Get current user
    const currentUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get file shares
    const fileShares = await db.query.shares.findMany({
      where: eq(shares.fileId, fileId),
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
        eq(publicLinks.fileId, fileId),
        eq(publicLinks.ownerId, currentUser.id),
      ),
    });

    return NextResponse.json({
      shares: fileShares.map((share) => ({
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
    console.error("Get file shares error:", error);
    return NextResponse.json(
      { error: "Failed to get file shares" },
      { status: 500 },
    );
  }
}
