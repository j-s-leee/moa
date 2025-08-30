import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export async function getInvitationsByAccountId(
  client: SupabaseClient<Database>,
  accountId: string
) {
  const { data, error } = await client
    .from("invitations")
    .select("*")
    .eq("account_id", accountId)
    .eq("status", "pending");

  if (error) {
    throw new Error(`Failed to fetch invitations: ${error.message}`);
  }

  return data;
}

export async function getInvitationsByAccountIdAndProfileId(
  client: SupabaseClient<Database>,
  accountId: string,
  profileId: string
) {
  const { data, error } = await client
    .from("invitations")
    .select("*")
    .eq("account_id", accountId)
    .eq("inviter_id", profileId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch invitations: ${error.message}`);
  }

  return data;
}

export async function getInvitationByToken(
  client: SupabaseClient<Database>,
  token: string
) {
  const { data, error } = await client
    .from("invitations")
    .select(
      `
      *,
      accounts!inner (
        name
      )
    `
    )
    .eq("token", token)
    .single();

  if (error) {
    throw new Error(`Failed to fetch invitation: ${error.message}`);
  }

  return data;
}

export async function checkUserAlreadyAccepted(
  client: SupabaseClient<Database>,
  accountId: string,
  profileId: string
) {
  // 먼저 초대 정보에서 account_id 가져오기
  const { data, error } = await client
    .from("account_members")
    .select("account_id")
    .eq("account_id", accountId)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to check user acceptance: ${error.message}`);
  }

  return !!data; // 데이터가 존재하면 이미 해당 계정의 멤버
}
