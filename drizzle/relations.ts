import { relations } from "drizzle-orm/relations";
import { driveTutorialIshaanUser, driveTutorialIshaanFile, driveTutorialIshaanFolder, driveTutorialIshaanPublicLink, driveTutorialIshaanShare } from "./schema";

export const driveTutorialIshaanFileRelations = relations(driveTutorialIshaanFile, ({one}) => ({
	driveTutorialIshaanUser: one(driveTutorialIshaanUser, {
		fields: [driveTutorialIshaanFile.ownerId],
		references: [driveTutorialIshaanUser.id]
	}),
}));

export const driveTutorialIshaanUserRelations = relations(driveTutorialIshaanUser, ({many}) => ({
	driveTutorialIshaanFiles: many(driveTutorialIshaanFile),
	driveTutorialIshaanFolders: many(driveTutorialIshaanFolder),
	driveTutorialIshaanPublicLinks: many(driveTutorialIshaanPublicLink),
	driveTutorialIshaanShares_ownerId: many(driveTutorialIshaanShare, {
		relationName: "driveTutorialIshaanShare_ownerId_driveTutorialIshaanUser_id"
	}),
	driveTutorialIshaanShares_sharedWithId: many(driveTutorialIshaanShare, {
		relationName: "driveTutorialIshaanShare_sharedWithId_driveTutorialIshaanUser_id"
	}),
}));

export const driveTutorialIshaanFolderRelations = relations(driveTutorialIshaanFolder, ({one}) => ({
	driveTutorialIshaanUser: one(driveTutorialIshaanUser, {
		fields: [driveTutorialIshaanFolder.ownerId],
		references: [driveTutorialIshaanUser.id]
	}),
}));

export const driveTutorialIshaanPublicLinkRelations = relations(driveTutorialIshaanPublicLink, ({one}) => ({
	driveTutorialIshaanUser: one(driveTutorialIshaanUser, {
		fields: [driveTutorialIshaanPublicLink.ownerId],
		references: [driveTutorialIshaanUser.id]
	}),
}));

export const driveTutorialIshaanShareRelations = relations(driveTutorialIshaanShare, ({one}) => ({
	driveTutorialIshaanUser_ownerId: one(driveTutorialIshaanUser, {
		fields: [driveTutorialIshaanShare.ownerId],
		references: [driveTutorialIshaanUser.id],
		relationName: "driveTutorialIshaanShare_ownerId_driveTutorialIshaanUser_id"
	}),
	driveTutorialIshaanUser_sharedWithId: one(driveTutorialIshaanUser, {
		fields: [driveTutorialIshaanShare.sharedWithId],
		references: [driveTutorialIshaanUser.id],
		relationName: "driveTutorialIshaanShare_sharedWithId_driveTutorialIshaanUser_id"
	}),
}));