import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";
import type { TransactionType } from "./schema";

export const removeMember = async (
  client: SupabaseClient<Database>,
  accountId: string,
  memberId: string
) => {
  const { error } = await client
    .from("account_members")
    .delete()
    .eq("account_id", accountId)
    .eq("profile_id", memberId);
  if (error) throw error;
  return { success: true, message: "멤버 삭제 완료" };
};

export const createTransaction = async (
  client: SupabaseClient<Database>,
  {
    accountId,
    type,
    note,
    amount,
  }: {
    accountId: string;
    type: TransactionType;
    note: string;
    amount: number;
  }
) => {
  const { error } = await client.from("transactions").insert({
    account_id: accountId,
    type,
    note,
    amount,
  });
  if (error) throw error;
  return {
    success: true,
    message: `${type === "income" ? "수입" : "지출"} 추가 완료`,
  };
};

export const deleteTransaction = async (
  client: SupabaseClient<Database>,
  accountId: string,
  transactionId: number
) => {
  const { error } = await client
    .from("transactions")
    .delete()
    .eq("account_id", accountId)
    .eq("transaction_id", transactionId);
  if (error) throw error;
  return { success: true, message: "거래 삭제 완료" };
};

export const createIncome = async (
  client: SupabaseClient<Database>,
  {
    accountId,
    note,
    amount,
  }: {
    accountId: string;
    note: string;
    amount: number;
  }
) => {
  return createTransaction(client, {
    accountId,
    type: "income",
    note,
    amount,
  });
};

export const createExpense = async (
  client: SupabaseClient<Database>,
  {
    accountId,
    note,
    amount,
  }: {
    accountId: string;
    note: string;
    amount: number;
  }
) => {
  return createTransaction(client, {
    accountId,
    type: "expense",
    note,
    amount,
  });
};

export const createBudget = async (
  client: SupabaseClient<Database>,
  {
    accountId,
    budgetName,
    amount,
  }: {
    accountId: string;
    budgetName: string;
    amount: number;
  }
) => {
  const { error } = await client.from("budgets").insert({
    account_id: accountId,
    name: budgetName,
    budget_amount: amount,
  });
  if (error) throw error;
  return { success: true, message: "예산 추가 완료" };
};

export const deleteBudget = async (
  client: SupabaseClient<Database>,
  budgetId: number
) => {
  const { error } = await client
    .from("budgets")
    .delete()
    .eq("budget_id", budgetId);
  if (error) throw error;
  return { success: true, message: "예산 삭제 완료" };
};

export const updateBudget = async (
  client: SupabaseClient<Database>,
  {
    budgetId,
    budgetName,
    amount,
  }: {
    budgetId: number;
    budgetName: string;
    amount: number;
  }
) => {
  const { error } = await client
    .from("budgets")
    .update({
      name: budgetName,
      budget_amount: amount,
    })
    .eq("budget_id", budgetId);
  if (error) throw error;
  return { success: true, message: "예산 수정 완료" };
};

export const createBudgetExpense = async (
  client: SupabaseClient<Database>,
  {
    budgetId,
    amount,
    note,
    occurredAt,
  }: {
    budgetId: number;
    amount: number;
    note: string;
    occurredAt: Date;
  }
) => {
  const { error } = await client.from("budget_expenses").insert({
    budget_id: budgetId,
    amount,
    note,
    occurred_at: occurredAt.toISOString(),
  });
  if (error) throw error;
  return { success: true, message: "예산 지출 추가 완료" };
};

export const deleteBudgetExpense = async (
  client: SupabaseClient<Database>,
  {
    budgetExpenseId,
  }: {
    budgetExpenseId: number;
  }
) => {
  const { error } = await client
    .from("budget_expenses")
    .delete()
    .eq("budget_expense_id", budgetExpenseId);
};
