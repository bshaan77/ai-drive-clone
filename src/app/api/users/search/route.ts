/**
 * User Search API Route
 *
 * Searches for users by email to enable file sharing functionality
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq, ilike, and, ne } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email || email.length < 3) {
      return NextResponse.json({ users: [] });
    }

    // Get current user to exclude from search results
    const currentUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Search for users by email (excluding current user)
    const searchResults = await db.query.users.findMany({
      where: and(
        ilike(users.email, `%${email}%`),
        ne(users.id, currentUser.id),
      ),
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
      limit: 10,
    });

    return NextResponse.json({ users: searchResults });
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 },
    );
  }
}
