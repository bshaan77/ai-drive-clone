/**
 * Clerk Webhook Handler
 *
 * Handles Clerk webhook events to sync user data with the database
 * Supports user.created, user.updated, and user.deleted events
 */

import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// Webhook event types
type WebhookEvent = {
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
    }>;
    first_name?: string;
    last_name?: string;
    image_url?: string;
    created_at: number;
    updated_at: number;
  };
  object: string;
  type: string;
};

export async function POST(request: NextRequest) {
  try {
    // Get the body
    const payload = await request.text();
    const evt = JSON.parse(payload) as WebhookEvent;

    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;

    console.log(`Webhook received: ${eventType} for user ${id}`);

    // Handle the webhook
    switch (eventType) {
      case "user.created":
        await handleUserCreated(evt.data);
        break;
      case "user.updated":
        await handleUserUpdated(evt.data);
        break;
      case "user.deleted":
        await handleUserDeleted(id);
        break;
      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

/**
 * Handle user creation event
 */
async function handleUserCreated(userData: WebhookEvent["data"]) {
  try {
    const primaryEmail = userData.email_addresses[0]?.email_address;

    if (!primaryEmail) {
      console.error("No email address found for user:", userData.id);
      return;
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userData.id),
    });

    if (existingUser) {
      console.log("User already exists, updating instead:", userData.id);
      await handleUserUpdated(userData);
      return;
    }

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        clerkId: userData.id,
        email: primaryEmail,
        firstName: userData.first_name ?? null,
        lastName: userData.last_name ?? null,
        avatarUrl: userData.image_url ?? null,
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(userData.updated_at),
      })
      .returning();

    console.log("User created successfully:", newUser[0]?.id);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Handle user update event
 */
async function handleUserUpdated(userData: WebhookEvent["data"]) {
  try {
    const primaryEmail = userData.email_addresses[0]?.email_address;

    if (!primaryEmail) {
      console.error("No email address found for user:", userData.id);
      return;
    }

    // Update existing user
    const updatedUser = await db
      .update(users)
      .set({
        email: primaryEmail,
        firstName: userData.first_name ?? null,
        lastName: userData.last_name ?? null,
        avatarUrl: userData.image_url ?? null,
        updatedAt: new Date(userData.updated_at),
      })
      .where(eq(users.clerkId, userData.id))
      .returning();

    if (updatedUser.length === 0) {
      console.log("User not found, creating instead:", userData.id);
      await handleUserCreated(userData);
      return;
    }

    console.log("User updated successfully:", updatedUser[0]?.id);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Handle user deletion event
 */
async function handleUserDeleted(userId: string) {
  try {
    // Delete user from database
    const deletedUser = await db
      .delete(users)
      .where(eq(users.clerkId, userId))
      .returning();

    console.log("User deleted successfully:", deletedUser[0]?.id);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
