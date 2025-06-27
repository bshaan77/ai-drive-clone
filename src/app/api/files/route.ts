/**
 * Files List API Route
 *
 * Lists all files uploaded by the authenticated user
 * with enhanced metadata and filtering capabilities.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { files, users } from "~/server/db/schema";
import { eq, desc, asc, like, and, or } from "drizzle-orm";
import { getFileCategory, getFileIcon, formatFileSize } from "~/lib/file-utils";

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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") ?? "createdAt";
    const sortOrder = searchParams.get("sortOrder") ?? "desc";
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    // Build where conditions
    const baseConditions = [eq(files.ownerId, userRecord.id)];
    const additionalConditions = [];

    // Add search filter
    if (search) {
      additionalConditions.push(
        or(
          like(files.name, `%${search}%`),
          like(files.originalName, `%${search}%`),
          like(files.mimeType, `%${search}%`),
        ),
      );
    }

    // Add category filter
    if (category) {
      additionalConditions.push(eq(files.mimeType, category));
    }

    // Combine all conditions
    const whereConditions =
      additionalConditions.length > 0
        ? and(...baseConditions, ...additionalConditions)
        : and(...baseConditions);

    // Build order by clause
    let orderByClause;
    switch (sortBy) {
      case "name":
        orderByClause =
          sortOrder === "asc" ? asc(files.name) : desc(files.name);
        break;
      case "size":
        orderByClause =
          sortOrder === "asc" ? asc(files.size) : desc(files.size);
        break;
      case "updatedAt":
        orderByClause =
          sortOrder === "asc" ? asc(files.updatedAt) : desc(files.updatedAt);
        break;
      default:
        orderByClause =
          sortOrder === "asc" ? asc(files.createdAt) : desc(files.createdAt);
    }

    // Get user's files with enhanced query
    const userFiles = await db.query.files.findMany({
      where: whereConditions,
      orderBy: [orderByClause],
      limit: Math.min(limit, 100), // Cap at 100 files per request
      offset: offset,
    });

    // Get total count for pagination
    const totalCount = await db
      .select({ count: files.id })
      .from(files)
      .where(whereConditions);

    // Enhance file data with additional metadata
    const enhancedFiles = userFiles.map((file) => {
      const fileCategory = getFileCategory(file.mimeType);
      const fileIcon = getFileIcon(file.mimeType);

      return {
        id: file.id,
        name: file.name,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        blobUrl: file.blobUrl,
        category: fileCategory,
        icon: fileIcon,
        folderId: file.folderId,
        isPublic: file.isPublic,
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
        metadata: file.metadata,
        // Additional computed fields
        isImage: file.mimeType.startsWith("image/"),
        isVideo: file.mimeType.startsWith("video/"),
        isAudio: file.mimeType.startsWith("audio/"),
        isDocument:
          file.mimeType.includes("document") ?? file.mimeType.includes("pdf"),
        isArchive:
          file.mimeType.includes("zip") ?? file.mimeType.includes("rar"),
      };
    });

    return NextResponse.json({
      success: true,
      files: enhancedFiles,
      pagination: {
        total: totalCount.length,
        limit,
        offset,
        hasMore: offset + limit < totalCount.length,
      },
      filters: {
        search: search ?? null,
        category: category ?? null,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("Files list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}

/**
 * Get file statistics for the user
 */
export async function HEAD(request: NextRequest) {
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

    // Get file statistics
    const stats = await db
      .select({
        totalFiles: files.id,
        totalSize: files.size,
      })
      .from(files)
      .where(eq(files.ownerId, userRecord.id));

    const totalFiles = stats.length;
    const totalSize = stats.reduce(
      (sum, file) => sum + (file.totalSize ?? 0),
      0,
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalFiles,
        totalSize,
        totalSizeFormatted: formatFileSize(totalSize),
      },
    });
  } catch (error) {
    console.error("File stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch file statistics" },
      { status: 500 },
    );
  }
}
