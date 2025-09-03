import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const createSavingsGoal = async (
  client: SupabaseClient<Database>,
  {
    accountId,
    goalAmount,
    currentAmount,
    monthlySavings,
    name,
  }: {
    accountId: string;
    goalAmount: number;
    currentAmount: number;
    monthlySavings: number;
    name: string;
  }
) => {
  const { data, error } = await client
    .from("goals")
    .insert({
      account_id: accountId,
      goal_amount: goalAmount,
      current_amount: currentAmount,
      monthly_savings: monthlySavings,
      name,
    })
    .select("goal_id, name, goal_amount, current_amount, monthly_savings")
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateSavingsGoal = async (
  client: SupabaseClient<Database>,
  {
    goalId,
    goalAmount,
    currentAmount,
    monthlySavings,
    name,
  }: {
    goalId: number;
    goalAmount: number;
    currentAmount: number;
    monthlySavings: number;
    name: string;
  }
) => {
  const { data, error } = await client
    .from("goals")
    .update({
      goal_amount: goalAmount,
      current_amount: currentAmount,
      monthly_savings: monthlySavings,
      name,
    })
    .eq("goal_id", goalId)
    .select("goal_id, name, goal_amount, current_amount, monthly_savings")
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteSavingsGoal = async (
  client: SupabaseClient<Database>,
  goalId: number
) => {
  const { error } = await client.from("goals").delete().eq("goal_id", goalId);
  if (error) throw new Error(error.message);
  return true;
};
