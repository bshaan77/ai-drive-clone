/**
 * Google Drive Clone Database Schema
 *
 * This schema defines the database structure for our file management system,
 * including users, files, folders, and sharing capabilities.
 */

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * Multi-project schema feature of Drizzle ORM.
 * Prefixes all table names with project identifier.
 */
export const createTable = pgTableCreator(
  (name) => `drive-tutorial-ishaan_${name}`,
);

/**
 * Users table - stores user information from Clerk
 */
export const users = createTable(
  "user",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(), // Internal user ID
    clerkId: d.varchar({ length: 255 }).notNull().unique(), // Clerk user ID
    email: d.varchar({ length: 255 }).notNull(),
    firstName: d.varchar({ length: 100 }),
    lastName: d.varchar({ length: 100 }),
    avatarUrl: d.varchar({ length: 500 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("clerk_id_idx").on(t.clerkId), index("email_idx").on(t.email)],
);

/**
 * Folders table - stores folder information
 */
export const folders = createTable(
  "folder",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    name: d.varchar({ length: 255 }).notNull(),
    description: d.text(),
    parentId: d.uuid(), // Self-referencing for nested folders
    ownerId: d
      .uuid()
      .notNull()
      .references(() => users.id),
    isPublic: d.boolean().default(false),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("folder_owner_id_idx").on(t.ownerId),
    index("folder_parent_id_idx").on(t.parentId),
    index("folder_name_idx").on(t.name),
  ],
);

/**
 * Files table - stores file metadata
 */
export const files = createTable(
  "file",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    name: d.varchar({ length: 255 }).notNull(),
    originalName: d.varchar({ length: 255 }).notNull(),
    mimeType: d.varchar({ length: 100 }).notNull(),
    size: d.integer().notNull(), // File size in bytes
    blobUrl: d.varchar({ length: 500 }).notNull(), // Vercel Blob URL
    folderId: d.uuid(), // Reference to folders table
    ownerId: d
      .uuid()
      .notNull()
      .references(() => users.id),
    isPublic: d.boolean().default(false),
    metadata: d.jsonb(), // Additional file metadata (dimensions, duration, etc.)
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("file_owner_id_idx").on(t.ownerId),
    index("file_folder_id_idx").on(t.folderId),
    index("file_name_idx").on(t.name),
    index("file_mime_type_idx").on(t.mimeType),
  ],
);

/**
 * Shares table - stores file/folder sharing information
 *
 * Note: fileId and folderId are mutually exclusive - only one should be set
 * This represents sharing either a file OR a folder, not both
 */
export const shares = createTable(
  "share",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    fileId: d.uuid(), // Reference to files table (mutually exclusive with folderId)
    folderId: d.uuid(), // Reference to folders table (mutually exclusive with fileId)
    ownerId: d
      .uuid()
      .notNull()
      .references(() => users.id), // User who owns the file/folder
    sharedWithId: d
      .uuid()
      .notNull()
      .references(() => users.id), // User who receives the share
    permission: d.varchar({ length: 20 }).notNull().default("view"), // 'view' or 'edit'
    expiresAt: d.timestamp({ withTimezone: true }), // Optional expiration
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("share_file_id_idx").on(t.fileId),
    index("share_folder_id_idx").on(t.folderId),
    index("share_owner_id_idx").on(t.ownerId),
    index("share_shared_with_id_idx").on(t.sharedWithId),
    // Ensure either fileId or folderId is set, but not both
    index("share_resource_idx").on(t.fileId, t.folderId),
  ],
);

/**
 * Public links table - stores public sharing links
 *
 * Note: fileId and folderId are mutually exclusive - only one should be set
 * This represents sharing either a file OR a folder publicly, not both
 */
export const publicLinks = createTable(
  "public_link",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    token: d.varchar({ length: 100 }).notNull().unique(), // Unique token for the link
    fileId: d.uuid(), // Reference to files table (mutually exclusive with folderId)
    folderId: d.uuid(), // Reference to folders table (mutually exclusive with fileId)
    ownerId: d
      .uuid()
      .notNull()
      .references(() => users.id), // User who owns the file/folder
    permission: d.varchar({ length: 20 }).notNull().default("view"), // 'view' or 'edit'
    expiresAt: d.timestamp({ withTimezone: true }), // Optional expiration
    downloadCount: d.integer().default(0), // Track usage
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("public_link_token_idx").on(t.token),
    index("public_link_file_id_idx").on(t.fileId),
    index("public_link_folder_id_idx").on(t.folderId),
    index("public_link_owner_id_idx").on(t.ownerId),
    // Ensure either fileId or folderId is set, but not both
    index("public_link_resource_idx").on(t.fileId, t.folderId),
  ],
);

/**
 * File versions table - stores file version history
 */
export const fileVersions = createTable(
  "file_version",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    fileId: d.uuid().notNull(), // Reference to files table
    version: d.integer().notNull(), // Version number
    blobUrl: d.varchar({ length: 500 }).notNull(),
    size: d.integer().notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [
    index("file_version_file_id_idx").on(t.fileId),
    index("file_version_version_idx").on(t.version),
  ],
);
