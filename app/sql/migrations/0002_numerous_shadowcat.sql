ALTER TABLE "profile" RENAME TO "profiles";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_created_by_profile_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profile_profile_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_created_by_profiles_profile_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;