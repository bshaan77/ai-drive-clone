-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "drive-tutorial-ishaan_file_version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fileId" uuid NOT NULL,
	"version" integer NOT NULL,
	"blobUrl" varchar(500) NOT NULL,
	"size" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drive-tutorial-ishaan_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerkId" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"firstName" varchar(100),
	"lastName" varchar(100),
	"avatarUrl" varchar(500),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "drive-tutorial-ishaan_user_clerkId_unique" UNIQUE("clerkId")
);
--> statement-breakpoint
CREATE TABLE "drive-tutorial-ishaan_file" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"originalName" varchar(255) NOT NULL,
	"mimeType" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"blobUrl" varchar(500) NOT NULL,
	"folderId" uuid,
	"ownerId" uuid NOT NULL,
	"isPublic" boolean DEFAULT false,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "drive-tutorial-ishaan_folder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"parentId" uuid,
	"ownerId" uuid NOT NULL,
	"isPublic" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "drive-tutorial-ishaan_public_link" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" varchar(100) NOT NULL,
	"fileId" uuid,
	"folderId" uuid,
	"ownerId" uuid NOT NULL,
	"permission" varchar(20) DEFAULT 'view' NOT NULL,
	"expiresAt" timestamp with time zone,
	"downloadCount" integer DEFAULT 0,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "drive-tutorial-ishaan_public_link_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "drive-tutorial-ishaan_share" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fileId" uuid,
	"folderId" uuid,
	"ownerId" uuid NOT NULL,
	"sharedWithId" uuid NOT NULL,
	"permission" varchar(20) DEFAULT 'view' NOT NULL,
	"expiresAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "drive-tutorial-ishaan_file" ADD CONSTRAINT "drive-tutorial-ishaan_file_ownerId_drive-tutorial-ishaan_user_i" FOREIGN KEY ("ownerId") REFERENCES "public"."drive-tutorial-ishaan_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drive-tutorial-ishaan_folder" ADD CONSTRAINT "drive-tutorial-ishaan_folder_ownerId_drive-tutorial-ishaan_user" FOREIGN KEY ("ownerId") REFERENCES "public"."drive-tutorial-ishaan_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drive-tutorial-ishaan_public_link" ADD CONSTRAINT "drive-tutorial-ishaan_public_link_ownerId_drive-tutorial-ishaan" FOREIGN KEY ("ownerId") REFERENCES "public"."drive-tutorial-ishaan_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drive-tutorial-ishaan_share" ADD CONSTRAINT "drive-tutorial-ishaan_share_ownerId_drive-tutorial-ishaan_user_" FOREIGN KEY ("ownerId") REFERENCES "public"."drive-tutorial-ishaan_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drive-tutorial-ishaan_share" ADD CONSTRAINT "drive-tutorial-ishaan_share_sharedWithId_drive-tutorial-ishaan_" FOREIGN KEY ("sharedWithId") REFERENCES "public"."drive-tutorial-ishaan_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "file_version_file_id_idx" ON "drive-tutorial-ishaan_file_version" USING btree ("fileId" uuid_ops);--> statement-breakpoint
CREATE INDEX "file_version_version_idx" ON "drive-tutorial-ishaan_file_version" USING btree ("version" int4_ops);--> statement-breakpoint
CREATE INDEX "clerk_id_idx" ON "drive-tutorial-ishaan_user" USING btree ("clerkId" text_ops);--> statement-breakpoint
CREATE INDEX "email_idx" ON "drive-tutorial-ishaan_user" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "file_folder_id_idx" ON "drive-tutorial-ishaan_file" USING btree ("folderId" uuid_ops);--> statement-breakpoint
CREATE INDEX "file_mime_type_idx" ON "drive-tutorial-ishaan_file" USING btree ("mimeType" text_ops);--> statement-breakpoint
CREATE INDEX "file_name_idx" ON "drive-tutorial-ishaan_file" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "file_owner_id_idx" ON "drive-tutorial-ishaan_file" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE INDEX "folder_name_idx" ON "drive-tutorial-ishaan_folder" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "folder_owner_id_idx" ON "drive-tutorial-ishaan_folder" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE INDEX "folder_parent_id_idx" ON "drive-tutorial-ishaan_folder" USING btree ("parentId" uuid_ops);--> statement-breakpoint
CREATE INDEX "public_link_file_id_idx" ON "drive-tutorial-ishaan_public_link" USING btree ("fileId" uuid_ops);--> statement-breakpoint
CREATE INDEX "public_link_folder_id_idx" ON "drive-tutorial-ishaan_public_link" USING btree ("folderId" uuid_ops);--> statement-breakpoint
CREATE INDEX "public_link_owner_id_idx" ON "drive-tutorial-ishaan_public_link" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE INDEX "public_link_token_idx" ON "drive-tutorial-ishaan_public_link" USING btree ("token" text_ops);--> statement-breakpoint
CREATE INDEX "share_file_id_idx" ON "drive-tutorial-ishaan_share" USING btree ("fileId" uuid_ops);--> statement-breakpoint
CREATE INDEX "share_folder_id_idx" ON "drive-tutorial-ishaan_share" USING btree ("folderId" uuid_ops);--> statement-breakpoint
CREATE INDEX "share_owner_id_idx" ON "drive-tutorial-ishaan_share" USING btree ("ownerId" uuid_ops);--> statement-breakpoint
CREATE INDEX "share_shared_with_id_idx" ON "drive-tutorial-ishaan_share" USING btree ("sharedWithId" uuid_ops);
*/