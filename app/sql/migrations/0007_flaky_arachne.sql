ALTER TABLE "accounts" ALTER COLUMN "account_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "invitation_id" SET DEFAULT gen_random_uuid();