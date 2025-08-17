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

export const getTotalExpense = async (accountId: string) => {
  const { data, error } = await supabase
    .from("accounts")
    .select("total_expense")
    .eq("account_id", accountId);
  if (error) throw new Error(error.message);
  return data[0].total_expense;
};

export const getExpenses = async (accountId: string) => {
  const { data, error } = await supabase
    .from("transactions")
    .select(`transaction_id, note, amount, occurred_at`)
    .eq("account_id", accountId)
    .eq("type", "expense");
  if (error) throw new Error(error.message);
  return data;
};

export const getAccount = async (accountId: string) => {
  const { data, error } = await supabase
    .from("accounts")
    .select("account_id, total_income, total_expense, total_savings")
    .eq("account_id", accountId);
  if (error) throw new Error(error.message);
  return data[0];
};

export const getBudgets = async (accountId: string) => {
  const { data, error } = await supabase
    .from("budgets")
    .select("budget_id, name, budget_amount, current_amount")
    .eq("account_id", accountId);
  if (error) throw new Error(error.message);
  return data;
};

export const getBudget = async (budgetId: number) => {
  const { data, error } = await supabase
    .from("budgets")
    .select(
      `budget_id, name, budget_amount, current_amount, budget_expenses(budget_expense_id, amount, note, occurred_at)`
    )
    .eq("budget_id", budgetId)
    .single();
  if (error) throw new Error(error.message);
  console.log(data);
  return data;
};
