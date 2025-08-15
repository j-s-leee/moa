import supabase from "~/supa-client";

export const getTotalIncome = async (accountId: string) => {
  const { data, error } = await supabase
    .from("accounts")
    .select("total_income")
    .eq("account_id", accountId);
  if (error) throw new Error(error.message);
  return data[0].total_income;
};

export const getIncomes = async (accountId: string) => {
  const { data, error } = await supabase
    .from("transactions")
    .select(`transaction_id, note, amount, occurred_at`)
    .eq("account_id", accountId)
    .eq("type", "income");
  if (error) throw new Error(error.message);
  return data;
};
