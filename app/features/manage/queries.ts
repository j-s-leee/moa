import { PAGE_SIZE } from "./constants";
import type { Database } from "database.types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "react-router";

export const getTotalIncome = async (
  client: SupabaseClient<Database>,
  accountId: string
) => {
  const { data, error } = await client
    .from("accounts")
    .select("total_income")
    .eq("account_id", accountId);
  if (error) throw new Error(error.message);
  return data[0].total_income;
};

export const getIncomes = async (
  client: SupabaseClient<Database>,
  accountId: string
) => {
  const { data, error } = await client
    .from("transactions")
    .select(`transaction_id, note, amount, occurred_at`)
    .eq("account_id", accountId)
    .eq("type", "income");
  if (error) throw new Error(error.message);
  return data;
};

export const getTotalExpense = async (
  client: SupabaseClient<Database>,
  accountId: string
) => {
  const { data, error } = await client
    .from("accounts")
    .select("total_expense")
    .eq("account_id", accountId);
  if (error) throw new Error(error.message);
  return data[0].total_expense;
};

export const getExpenses = async (
  client: SupabaseClient<Database>,
  accountId: string
) => {
  const { data, error } = await client
    .from("transactions")
    .select(`transaction_id, note, amount, occurred_at`)
    .eq("account_id", accountId)
    .eq("type", "expense");
  if (error) throw new Error(error.message);
  return data;
};

export const getAccount = async (
  client: SupabaseClient<Database>,
  accountId: string
) => {
  const { data, error } = await client
    .from("accounts")
    .select(
      "account_id, name, currency, total_income, total_expense, total_savings"
    )
    .eq("account_id", accountId)
    .single();
  if (error) throw redirect("/account");
  return data;
};

export const getBudgets = async (
  client: SupabaseClient<Database>,
  accountId: string
) => {
  const { data, error } = await client
    .from("budgets")
    .select("budget_id, name, budget_amount, current_amount")
    .eq("account_id", accountId);
  if (error) throw new Error(error.message);
  return data;
};

export const getBudget = async (
  client: SupabaseClient<Database>,
  budgetId: number
) => {
  const { data, error } = await client
    .from("budgets")
    .select("budget_id, name, budget_amount, current_amount")
    .eq("budget_id", budgetId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const getBudgetExpenses = async ({
  client,
  budgetId,
  page,
}: {
  client: SupabaseClient<Database>;
  budgetId: number;
  page: number;
}) => {
  const offset = (page - 1) * PAGE_SIZE;

  const { data, error } = await client
    .from("budget_expenses")
    .select("budget_expense_id, amount, note, occurred_at")
    .eq("budget_id", budgetId)
    .order("occurred_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);
  if (error) throw new Error(error.message);
  return data;
};

export const getBudgetExpensesCount = async ({
  client,
  budgetId,
}: {
  client: SupabaseClient<Database>;
  budgetId: number;
}) => {
  const { count, error } = await client
    .from("budget_expenses")
    .select("budget_expense_id", { count: "exact", head: true })
    .eq("budget_id", budgetId);
  if (error) throw new Error(error.message);
  if (!count) return 1;
  return Math.ceil(count / PAGE_SIZE);
};

export const getMembers = async (
  client: SupabaseClient<Database>,
  accountId: string
) => {
  const { data, error } = await client
    .from("account_members")
    .select(`profile_id, role, profiles!inner(email, name)`)
    .eq("account_id", accountId);
  if (error) throw new Error(error.message);
  return data;
};
