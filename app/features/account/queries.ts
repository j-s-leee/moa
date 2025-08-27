import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getAccountsByProfileId = async (
  client: SupabaseClient<Database>,
  profileId: string
) => {
  const { data, error } = await client
    .from("account_members")
    .select(
      `
      account_budget_list_view!inner(
        account_id,
        name,
        currency,
        total_income,
        total_expense,
        total_savings,
        budget_amount,
        current_budget
      )
    `
    )
    .eq("profile_id", profileId);

  if (error) throw new Error(error.message);

  return data?.map((item) => item.account_budget_list_view) || [];
};

export const getAccountByIdAndProfileId = async (
  client: SupabaseClient<Database>,
  accountId: string,
  profileId: string
) => {
  const { data, error } = await client
    .from("account_members")
    .select(
      `
      accounts!inner(
      account_id,
      name,
      currency,
      total_income,
      total_expense,
      total_savings,
      created_by
    )
    `
    )
    .eq("account_id", accountId)
    .eq("profile_id", profileId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.accounts;
};

export const getAccountByIdAndCreatedBy = async (
  client: SupabaseClient<Database>,
  accountId: string,
  createdBy: string
) => {
  const { data, error } = await client
    .from("accounts")
    .select("*")
    .eq("account_id", accountId)
    .eq("created_by", createdBy)
    .single();
  if (error) throw new Error(error.message);
  return data;
};
