CREATE INDEX "idx_account_members_profile_id" ON "account_members" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_accounts_created_by" ON "accounts" USING btree ("created_by");