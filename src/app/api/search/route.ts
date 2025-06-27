/**
 * Search API Route
 *
 * Searches files and folders by name with database queries
 * Returns results with path information for navigation
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { files, folders, users } from "~/server/db/schema";
import { eq, and, like, desc, asc } from "drizzle-orm";

interface FolderRecord {
  id: string;
  name: string;
  parentId: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type"); // "file", "folder", or "all"
    const sortBy = searchParams.get("sortBy") ?? "name";
    const sortOrder = searchParams.get("sortOrder") ?? "asc";

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ success: true, results: [] });
    }

    const searchTerm = `%${query.trim()}%`;
    const results: Array<{
      id: string;
      name: string;
      type: "file" | "folder";
      size?: number;
      mimeType?: string;
      createdAt: string;
      path: string;
    }> = [];

    // Search files if type is "all" or "file"
    if (type !== "folder") {
      const fileResults = await db.query.files.findMany({
        where: and(
          eq(files.ownerId, userRecord.id),
          like(files.name, searchTerm),
        ),
        orderBy:
          sortBy === "name"
            ? sortOrder === "asc"
              ? asc(files.name)
              : desc(files.name)
            : sortBy === "createdAt"
              ? sortOrder === "asc"
                ? asc(files.createdAt)
                : desc(files.createdAt)
              : sortBy === "size"
                ? sortOrder === "asc"
                  ? asc(files.size)
                  : desc(files.size)
                : asc(files.name),
        limit: 20,
      });

      // Build paths for files
      for (const file of fileResults) {
        const path = await buildFilePath(file.folderId);
        results.push({
          id: file.id,
          name: file.name,
          type: "file",
          size: file.size,
          mimeType: file.mimeType,
          createdAt: file.createdAt.toISOString(),
          path,
        });
      }
    }

    // Search folders if type is "all" or "folder"
    if (type !== "file") {
      const folderResults = await db.query.folders.findMany({
        where: and(
          eq(folders.ownerId, userRecord.id),
          like(folders.name, searchTerm),
        ),
        orderBy:
          sortBy === "name"
            ? sortOrder === "asc"
              ? asc(folders.name)
              : desc(folders.name)
            : sortBy === "createdAt"
              ? sortOrder === "asc"
                ? asc(folders.createdAt)
                : desc(folders.createdAt)
              : asc(folders.name),
        limit: 20,
      });

      // Build paths for folders
      for (const folder of folderResults) {
        const path = await buildFolderPath(folder.id);
        results.push({
          id: folder.id,
          name: folder.name,
          type: "folder",
          createdAt: folder.createdAt.toISOString(),
          path,
        });
      }
    }

    // Sort combined results if needed
    if (type === "all") {
      results.sort((a, b) => {
        if (sortBy === "name") {
          const comparison = a.name.localeCompare(b.name);
          return sortOrder === "asc" ? comparison : -comparison;
        } else if (sortBy === "createdAt") {
          const comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          return sortOrder === "asc" ? comparison : -comparison;
        }
        return 0;
      });
    }

    return NextResponse.json({
      success: true,
      results: results.slice(0, 20), // Limit total results
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 },
    );
  }
}

/**
 * Build file path by traversing parent folders
 */
async function buildFilePath(folderId: string | null): Promise<string> {
  if (!folderId) {
    return "My Drive";
  }

  const path: string[] = [];
  let currentId: string | null = folderId;

  while (currentId) {
    const folder = (await db.query.folders.findFirst({
      where: eq(folders.id, currentId),
    })) as FolderRecord | undefined;

    if (folder) {
      path.unshift(folder.name);
      currentId = folder.parentId ?? null;
    } else {
      break;
    }
  }

  return path.length > 0 ? `My Drive / ${path.join(" / ")}` : "My Drive";
}

/**
 * Build folder path by traversing parent folders
 */
async function buildFolderPath(folderId: string): Promise<string> {
  const path: string[] = [];
  let currentId: string | null = folderId;

  while (currentId) {
    const folder = (await db.query.folders.findFirst({
      where: eq(folders.id, currentId),
    })) as FolderRecord | undefined;

    if (folder) {
      path.unshift(folder.name);
      currentId = folder.parentId ?? null;
    } else {
      break;
    }
  }

  return path.length > 0 ? `My Drive / ${path.join(" / ")}` : "My Drive";
}
