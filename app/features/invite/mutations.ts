import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";
import { nanoid } from "nanoid";
import { DateTime } from "luxon";

export const createInvitation = async (
  client: SupabaseClient<Database>,
  {
    accountId,
    userId,
    email,
  }: { accountId: string; userId: string; email: string }
) => {
  const { data: existingInvitation, error: existingInvitationError } =
    await client
      .from("invitations")
      .select("*")
      .eq("email", email)
      .eq("account_id", accountId)
      .single();

  if (existingInvitation) {
    const { data: updatedInvitation, error: updatedInvitationError } =
      await client
        .from("invitations")
        .update({
          status: "pending",
          token: nanoid(),
          expires_at: DateTime.now().plus({ days: 3 }).toISO(),
        })
        .eq("email", email)
        .eq("account_id", accountId)
        .eq("invitation_id", existingInvitation.invitation_id)
        .select()
        .single();
    if (updatedInvitationError) {
      throw updatedInvitationError;
    }
    return updatedInvitation;
  } else {
    const { data, error } = await client
      .from("invitations")
      .upsert({
        account_id: accountId,
        inviter_id: userId,
        email: email,
        token: nanoid(),
      })
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  }
};

export async function acceptInvitation(
  client: SupabaseClient<Database>,
  { token, email }: { token: string; email: string }
) {
  // 초대 정보 조회하여 account_id 가져오기
  const { data, error } = await client
    .from("invitations")
    .update({ status: "consumed" })
    .eq("token", token)
    .eq("email", email)
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
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

export async function revokeInvitation(
  client: SupabaseClient<Database>,
  invitationId: bigint
) {
  const { error } = await client
    .from("invitations")
    .delete()
    .eq("invitation_id", Number(invitationId))
    .select()
    .single();
  if (error) {
    throw error;
  }
  return { success: true };
}
