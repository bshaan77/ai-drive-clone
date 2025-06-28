/**
 * Database Relations
 *
 * Defines relationships between tables for Drizzle ORM
 */

import { relations } from "drizzle-orm";
import {
  users,
  files,
  folders,
  shares,
  publicLinks,
  fileVersions,
} from "./schema";

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  files: many(files),
  folders: many(folders),
  publicLinks: many(publicLinks),
  sharesAsOwner: many(shares, { relationName: "owner" }),
  sharesAsSharedWith: many(shares, { relationName: "sharedWith" }),
}));

// File relations
export const filesRelations = relations(files, ({ one, many }) => ({
  owner: one(users, {
    fields: [files.ownerId],
    references: [users.id],
  }),
  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),
  shares: many(shares),
  publicLinks: many(publicLinks),
  versions: many(fileVersions),
}));

// Folder relations
export const foldersRelations = relations(folders, ({ one, many }) => ({
  owner: one(users, {
    fields: [folders.ownerId],
    references: [users.id],
  }),
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
    relationName: "parentChild",
  }),
  children: many(folders, { relationName: "parentChild" }),
  files: many(files),
  shares: many(shares),
  publicLinks: many(publicLinks),
}));

// Share relations
export const sharesRelations = relations(shares, ({ one }) => ({
  owner: one(users, {
    fields: [shares.ownerId],
    references: [users.id],
    relationName: "owner",
  }),
  sharedWith: one(users, {
    fields: [shares.sharedWithId],
    references: [users.id],
    relationName: "sharedWith",
  }),
  file: one(files, {
    fields: [shares.fileId],
    references: [files.id],
  }),
  folder: one(folders, {
    fields: [shares.folderId],
    references: [folders.id],
  }),
}));

// Public link relations
export const publicLinksRelations = relations(publicLinks, ({ one }) => ({
  owner: one(users, {
    fields: [publicLinks.ownerId],
    references: [users.id],
  }),
  file: one(files, {
    fields: [publicLinks.fileId],
    references: [files.id],
  }),
  folder: one(folders, {
    fields: [publicLinks.folderId],
    references: [folders.id],
  }),
}));

// File version relations
export const fileVersionsRelations = relations(fileVersions, ({ one }) => ({
  file: one(files, {
    fields: [fileVersions.fileId],
    references: [files.id],
  }),
}));
