ALTER TABLE "account_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "invitations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "goals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "budget_expenses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "budgets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "account_member_insert" ON "account_members" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "account_member_delete" ON "account_members" AS PERMISSIVE FOR DELETE TO "authenticated";--> statement-breakpoint
CREATE POLICY "account_member_select" ON "account_members" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "account_insert" ON "accounts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "accounts"."created_by");--> statement-breakpoint
CREATE POLICY "account_update" ON "accounts" AS PERMISSIVE FOR UPDATE TO "authenticated" WITH CHECK ((select auth.uid()) = "accounts"."created_by");--> statement-breakpoint
CREATE POLICY "account_delete" ON "accounts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = created_by);--> statement-breakpoint
CREATE POLICY "account_select" ON "accounts" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "profile_insert" ON "profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "profile_update" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" WITH CHECK ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "profile_delete" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "profile_select" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "goal_full_access" ON "goals" AS PERMISSIVE FOR ALL TO "authenticated" USING (account_id IN (SELECT am.account_id FROM (account_members am JOIN profiles p ON am.profile_id = p.profile_id) WHERE p.profile_id = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "invitations_select" ON "invitations" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "invitations_insert" ON "invitations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "invitations"."inviter_id");--> statement-breakpoint
CREATE POLICY "invitations_delete" ON "invitations" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "invitations"."inviter_id");--> statement-breakpoint
CREATE POLICY "invitations_update" ON "invitations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "budget_expenses_full_access" ON "budget_expenses" AS PERMISSIVE FOR ALL TO "authenticated" USING (budget_id IN (
        SELECT b.budget_id 
        FROM budgets b 
        JOIN account_members am ON b.account_id = am.account_id 
        JOIN profiles p ON am.profile_id = p.profile_id 
        WHERE p.profile_id = (select auth.uid())
      ));--> statement-breakpoint
CREATE POLICY "budgets_full_access" ON "budgets" AS PERMISSIVE FOR ALL TO "authenticated" USING (account_id IN (SELECT am.account_id FROM (account_members am JOIN profiles p ON am.profile_id = p.profile_id) WHERE p.profile_id = (select auth.uid())));--> statement-breakpoint
CREATE POLICY "transactions_full_access" ON "transactions" AS PERMISSIVE FOR ALL TO "authenticated" USING (account_id IN (SELECT am.account_id FROM (account_members am JOIN profiles p ON am.profile_id = p.profile_id) WHERE p.profile_id = (select auth.uid())));