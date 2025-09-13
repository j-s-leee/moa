ALTER TABLE "budget_expenses" DROP CONSTRAINT "budget_expenses_budget_id_budgets_budget_id_fk";
--> statement-breakpoint
ALTER TABLE "budget_expenses" ADD CONSTRAINT "budget_expenses_budget_id_budgets_budget_id_fk" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("budget_id") ON DELETE cascade ON UPDATE no action;