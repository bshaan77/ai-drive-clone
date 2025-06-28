import { pgTable, index, uuid, integer, varchar, timestamp, unique, foreignKey, boolean, jsonb, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const driveTutorialIshaanFileVersion = pgTable("drive-tutorial-ishaan_file_version", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fileId: uuid().notNull(),
	version: integer().notNull(),
	blobUrl: varchar({ length: 500 }).notNull(),
	size: integer().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("file_version_file_id_idx").using("btree", table.fileId.asc().nullsLast().op("uuid_ops")),
	index("file_version_version_idx").using("btree", table.version.asc().nullsLast().op("int4_ops")),
]);

export const driveTutorialIshaanUser = pgTable("drive-tutorial-ishaan_user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clerkId: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	firstName: varchar({ length: 100 }),
	lastName: varchar({ length: 100 }),
	avatarUrl: varchar({ length: 500 }),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	index("clerk_id_idx").using("btree", table.clerkId.asc().nullsLast().op("text_ops")),
	index("email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	unique("drive-tutorial-ishaan_user_clerkId_unique").on(table.clerkId),
]);

export const driveTutorialIshaanFile = pgTable("drive-tutorial-ishaan_file", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	originalName: varchar({ length: 255 }).notNull(),
	mimeType: varchar({ length: 100 }).notNull(),
	size: integer().notNull(),
	blobUrl: varchar({ length: 500 }).notNull(),
	folderId: uuid(),
	ownerId: uuid().notNull(),
	isPublic: boolean().default(false),
	metadata: jsonb(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	index("file_folder_id_idx").using("btree", table.folderId.asc().nullsLast().op("uuid_ops")),
	index("file_mime_type_idx").using("btree", table.mimeType.asc().nullsLast().op("text_ops")),
	index("file_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("file_owner_id_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [driveTutorialIshaanUser.id],
			name: "drive-tutorial-ishaan_file_ownerId_drive-tutorial-ishaan_user_i"
		}),
]);

export const driveTutorialIshaanFolder = pgTable("drive-tutorial-ishaan_folder", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	parentId: uuid(),
	ownerId: uuid().notNull(),
	isPublic: boolean().default(false),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
	index("folder_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("folder_owner_id_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	index("folder_parent_id_idx").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [driveTutorialIshaanUser.id],
			name: "drive-tutorial-ishaan_folder_ownerId_drive-tutorial-ishaan_user"
		}),
]);

export const driveTutorialIshaanPublicLink = pgTable("drive-tutorial-ishaan_public_link", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	token: varchar({ length: 100 }).notNull(),
	fileId: uuid(),
	folderId: uuid(),
	ownerId: uuid().notNull(),
	permission: varchar({ length: 20 }).default('view').notNull(),
	expiresAt: timestamp({ withTimezone: true, mode: 'string' }),
	downloadCount: integer().default(0),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("public_link_file_id_idx").using("btree", table.fileId.asc().nullsLast().op("uuid_ops")),
	index("public_link_folder_id_idx").using("btree", table.folderId.asc().nullsLast().op("uuid_ops")),
	index("public_link_owner_id_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	index("public_link_token_idx").using("btree", table.token.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [driveTutorialIshaanUser.id],
			name: "drive-tutorial-ishaan_public_link_ownerId_drive-tutorial-ishaan"
		}),
	unique("drive-tutorial-ishaan_public_link_token_unique").on(table.token),
]);

export const driveTutorialIshaanShare = pgTable("drive-tutorial-ishaan_share", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	fileId: uuid(),
	folderId: uuid(),
	ownerId: uuid().notNull(),
	sharedWithId: uuid().notNull(),
	permission: varchar({ length: 20 }).default('view').notNull(),
	expiresAt: timestamp({ withTimezone: true, mode: 'string' }),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("share_file_id_idx").using("btree", table.fileId.asc().nullsLast().op("uuid_ops")),
	index("share_folder_id_idx").using("btree", table.folderId.asc().nullsLast().op("uuid_ops")),
	index("share_owner_id_idx").using("btree", table.ownerId.asc().nullsLast().op("uuid_ops")),
	index("share_shared_with_id_idx").using("btree", table.sharedWithId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [driveTutorialIshaanUser.id],
			name: "drive-tutorial-ishaan_share_ownerId_drive-tutorial-ishaan_user_"
		}),
	foreignKey({
			columns: [table.sharedWithId],
			foreignColumns: [driveTutorialIshaanUser.id],
			name: "drive-tutorial-ishaan_share_sharedWithId_drive-tutorial-ishaan_"
		}),
]);
