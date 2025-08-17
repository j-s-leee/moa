import supabase from "~/supa-client";

export const getSavingsGoal = async (accountId: string) => {
  const { data, error } = await supabase
    .from("goals")
    .select("goal_id, name, goal_amount, current_amount, goal_date")
    .eq("account_id", accountId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};
