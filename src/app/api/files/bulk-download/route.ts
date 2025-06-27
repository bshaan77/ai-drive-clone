/**
 * Bulk Download API Route
 *
 * Creates a zip file containing multiple files for bulk download
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { files, users } from "~/server/db/schema";
import { eq, and, inArray } from "drizzle-orm";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
import JSZip from "jszip";

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

    const body = (await request.json()) as { fileIds: string[] };
    const { fileIds } = body;

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: "Valid file IDs array is required" },
        { status: 400 },
      );
    }

    // Get files that belong to the user
    const userFiles = await db.query.files.findMany({
      where: and(inArray(files.id, fileIds), eq(files.ownerId, userRecord.id)),
    });

    if (userFiles.length === 0) {
      return NextResponse.json(
        { error: "No valid files found to download" },
        { status: 404 },
      );
    }

    // Create a zip file
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const zip = new JSZip() as unknown as {
      file: (name: string, data: ArrayBuffer | string) => void;
      generateAsync: (options: { type: string }) => Promise<Buffer>;
    };

    // Download each file and add to zip
    const downloadPromises = userFiles.map(async (file) => {
      try {
        const response = await fetch(file.blobUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${file.originalName}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        zip.file(file.originalName, arrayBuffer);
      } catch (downloadError) {
        console.error(
          `Failed to download file ${file.originalName}:`,
          downloadError,
        );
        // Add a placeholder file to indicate the error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        zip.file(
          `ERROR_${file.originalName}.txt`,
          `Failed to download: ${file.originalName}`,
        );
      }
    });

    await Promise.all(downloadPromises);

    // Generate zip file
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
    });

    // Create response with zip file
    const response = new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="bulk-download-${new Date().toISOString().split("T")[0]}.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });

    return response;
  } catch (error) {
    console.error("Bulk download error:", error);
    return NextResponse.json(
      { error: "Failed to create bulk download" },
      { status: 500 },
    );
  }
}
