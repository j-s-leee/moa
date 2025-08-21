import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const getAccounts = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from("accounts")
    .select("account_id, name");
  if (error) throw new Error(error.message);
  return data;
};

export const getProfile = async (
  client: SupabaseClient<Database>,
  userId: string
) => {
  const { data, error } = await client
    .from("profiles")
    .select(`name, email`)
    .eq("profile_id", userId)
    .single();
  if (error) throw new Error(error.message);
  return data;
};
