ALTER TABLE "invitations" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '7 day';--> statement-breakpoint
ALTER TABLE "goals" ADD COLUMN "monthly_savings" bigint DEFAULT 0 NOT NULL;