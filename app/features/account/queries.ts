import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const getAccountsByProfileId = async (
  client: SupabaseClient<Database>,
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
        total_savings
      )
    `
    )
    .eq("profile_id", profileId);

  if (error) throw new Error(error.message);

  // accounts 배열만 추출하여 반환
  return data?.map((item) => item.accounts) || [];
};
