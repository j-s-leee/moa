import type { SupabaseClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { DateTime } from "luxon";
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
  console.log("updateAccount", name, userId, accountId);
  const { error } = await client
    .from("accounts")
    .update({ name: name, updated_at: new Date().toISOString() })
    .eq("account_id", accountId)
    .eq("created_by", userId);

  if (error) {
    console.log("updateAccount error", error);
    throw error;
  }

  return { success: true };
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

export const revokeMember = async (
  client: SupabaseClient<Database>,
  { accountId, userId }: { accountId: string; userId: string }
) => {
  const { error } = await client
    .from("account_members")
    .delete()
    .eq("account_id", accountId)
    .eq("profile_id", userId);

  if (error) {
    throw error;
  }

  return { success: true };
};

export const promoteMember = async (
  client: SupabaseClient<Database>,
  {
    accountId,
    userId,
    memberId,
  }: { accountId: string; userId: string; memberId: string }
) => {
  const { error } = await client
    .from("account_members")
    .update({ role: "owner" })
    .eq("account_id", accountId)
    .eq("profile_id", memberId);

  const { error: ownerError } = await client
    .from("account_members")
    .update({ role: "member" })
    .eq("account_id", accountId)
    .eq("profile_id", userId);

  const { error: accountError } = await client
    .from("accounts")
    .update({ created_by: memberId, updated_at: new Date().toISOString() })
    .eq("account_id", accountId);

  if (error || ownerError || accountError) {
    throw error || ownerError || accountError;
  }

  return { success: true };
};

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
