CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'consumed', 'expired');--> statement-breakpoint
CREATE TABLE "invitation_accepts" (
	"invitation_accept_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invitation_accepts_invitation_accept_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"invitation_id" bigint,
	"profile_id" uuid,
	"accepted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "invitation_id";--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "invitation_id" bigint GENERATED ALWAYS AS IDENTITY (sequence name "invitations_invitation_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "invitations" ADD PRIMARY KEY ("invitation_id");--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '1 day';--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "inviter_id" uuid;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "status" "invitation_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "max_uses" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD COLUMN "used_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "invitation_accepts" ADD CONSTRAINT "invitation_accepts_invitation_id_invitations_invitation_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("invitation_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation_accepts" ADD CONSTRAINT "invitation_accepts_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_inviter_id_profiles_profile_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_token_unique" UNIQUE("token");