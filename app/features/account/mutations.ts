import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const createAccount = async (
  client: SupabaseClient<Database>,
  { name, userId }: { name: string; userId: string }
) => {
  const { data, error } = await client
    .from("accounts")
    .insert({
      name,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteAccount = async (
  client: SupabaseClient<Database>,
  { accountId, userId }: { accountId: string; userId: string }
) => {
  const { error } = await client
    .from("accounts")
    .delete()
    .eq("account_id", accountId)
    .eq("created_by", userId);
  if (error) {
    throw error;
  }
  return { success: true };
};

export const updateAccount = async (
  client: SupabaseClient<Database>,
  {
    name,
    userId,
    accountId,
  }: { name: string; userId: string; accountId: string }
) => {
  const { data, error } = await client
    .from("accounts")
    .update({ name })
    .eq("account_id", accountId)
    .eq("created_by", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const joinAccount = async (
  client: SupabaseClient<Database>,
  { accountId, userId }: { accountId: string; userId: string }
) => {
  const { data, error } = await client
    .from("account_members")
    .insert({ account_id: accountId, profile_id: userId, role: "member" })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
