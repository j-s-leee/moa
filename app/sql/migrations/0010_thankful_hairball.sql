ALTER TABLE "invitation_accepts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "invitation_accepts" CASCADE;--> statement-breakpoint
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_inviter_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_inviter_id_profiles_profile_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "max_uses";--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "used_count";