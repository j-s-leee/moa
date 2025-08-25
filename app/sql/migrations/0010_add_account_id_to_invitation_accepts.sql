-- Add account_id column to invitation_accepts table
ALTER TABLE "invitation_accepts" ADD COLUMN "account_id" uuid;

-- Add foreign key constraint
ALTER TABLE "invitation_accepts" ADD CONSTRAINT "invitation_accepts_account_id_accounts_account_id_fk" 
FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Add unique constraint on (account_id, profile_id) combination
ALTER TABLE "invitation_accepts" ADD CONSTRAINT "invitation_accepts_account_id_profile_id_unique" 
UNIQUE("account_id", "profile_id");

-- Update existing records to set account_id based on invitation
UPDATE "invitation_accepts" 
SET "account_id" = (
  SELECT "account_id" 
  FROM "invitations" 
  WHERE "invitations"."invitation_id" = "invitation_accepts"."invitation_id"
);

-- Make account_id NOT NULL after updating existing records
ALTER TABLE "invitation_accepts" ALTER COLUMN "account_id" SET NOT NULL; 