import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const getSavingsGoal = async (
  client: SupabaseClient<Database>,
  accountId: string
) => {
  const { data, error } = await client
    .from("goals")
    .select("goal_id, name, goal_amount, current_amount, goal_date")
    .eq("account_id", accountId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};
