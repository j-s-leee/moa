import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

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
  invitationId: number,
  profileId: string
) {
  // 먼저 초대 정보에서 account_id 가져오기
  const { data: invitation, error: invitationError } = await client
    .from("invitations")
    .select("account_id")
    .eq("invitation_id", invitationId)
    .single();

  if (invitationError) {
    throw new Error(`Failed to fetch invitation: ${invitationError.message}`);
  }

  if (!invitation.account_id) {
    throw new Error("초대 정보에 계정 ID가 없습니다.");
  }

  // account_id와 profile_id 조합으로 이미 멤버인지 확인
  const { data, error } = await client
    .from("invitation_accepts")
    .select("invitation_accept_id")
    .eq("account_id", invitation.account_id)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to check user acceptance: ${error.message}`);
  }

  return !!data; // 데이터가 존재하면 이미 해당 계정의 멤버
}
