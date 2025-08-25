import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";
import { nanoid } from "nanoid";

export const createInvitation = async (
  client: SupabaseClient<Database>,
  {
    accountId,
    userId,
    maxUses,
  }: { accountId: string; userId: string; maxUses: number }
) => {
  const { data, error } = await client
    .from("invitations")
    .insert({
      account_id: accountId,
      inviter_id: userId,
      max_uses: maxUses,
      token: nanoid(),
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export async function acceptInvitation(
  client: SupabaseClient<Database>,
  invitationId: number,
  profileId: string
) {
  // 초대 정보 조회하여 account_id 가져오기
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

  // 먼저 이미 해당 계정의 멤버인지 확인 (account_id, profile_id 조합)
  const { data: existingAccept, error: checkError } = await client
    .from("invitation_accepts")
    .select("invitation_accept_id")
    .eq("account_id", invitation.account_id)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (checkError) {
    throw new Error(
      `Failed to check existing acceptance: ${checkError.message}`
    );
  }

  if (existingAccept) {
    throw new Error("이미 이 계정의 멤버입니다.");
  }

  // 트랜잭션으로 초대 수락 처리
  const { error: acceptError } = await client
    .from("invitation_accepts")
    .insert({
      invitation_id: invitationId,
      profile_id: profileId,
      account_id: invitation.account_id,
      accepted_at: new Date().toISOString(),
    });

  if (acceptError) {
    throw new Error(`Failed to accept invitation: ${acceptError.message}`);
  }

  return { success: true };
}

export async function closeInvitation(
  client: SupabaseClient<Database>,
  token: string
) {
  const { data, error } = await client
    .from("invitations")
    .update({ status: "expired" })
    .eq("token", token)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return { success: true };
}
