DROP INDEX "idx_accounts_created_by";--> statement-breakpoint
CREATE INDEX "idx_invitations_account_id" ON "invitations" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "idx_invitations_inviter_id" ON "invitations" USING btree ("inviter_id");--> statement-breakpoint
CREATE INDEX "idx_goals_account_id" ON "goals" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "idx_budget_expenses_budget_id" ON "budget_expenses" USING btree ("budget_id");--> statement-breakpoint
CREATE INDEX "idx_budget_expenses_occurred_at" ON "budget_expenses" USING btree ("budget_id","occurred_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_budgets_account_id" ON "budgets" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "idx_transactions_account_id" ON "transactions" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "idx_transactions_account_type" ON "transactions" USING btree ("account_id","type");--> statement-breakpoint
CREATE INDEX "idx_transactions_account_occurred_at" ON "transactions" USING btree ("account_id","occurred_at" DESC NULLS LAST);