import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getSavingsGoal = async (
  client: SupabaseClient<Database>,
  accountId: string
) => {
  const { data, error } = await client
    .from("goals")
    .select("goal_id, name, goal_amount, current_amount, goal_date")
    .eq("account_id", accountId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

export const getSavings = async (
  client: SupabaseClient<Database>,
  accountId: string
) => {
  const { data, error } = await client
    .from("goals")
    .select(
      "goal_id, name, goal_amount, current_amount, goal_date, monthly_savings"
    )
    .eq("account_id", accountId);
  if (error) throw new Error(error.message);
  return data;
};
