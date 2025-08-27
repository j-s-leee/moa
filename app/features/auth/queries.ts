import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
import { redirect } from "react-router";

export const getLoggedInUserId = async (client: SupabaseClient<Database>) => {
  return getLoggedInUserIdWithRedirectUrl(client, "/auth/login");
};

export const getLoggedInUserIdWithRedirectUrl = async (
  client: SupabaseClient<Database>,
  redirectUrl: string
) => {
  const { data, error } = await client.auth.getUser();
  if (error || data.user === null) throw redirect(redirectUrl);
  return data.user.id;
};

export const getLoggedInUserEmail = async (
  client: SupabaseClient<Database>
) => {
  const { data, error } = await client.auth.getUser();
  if (error || data.user === null) throw redirect("/auth/login");
  return data.user.email;
};

export const getProfileIdByEmail = async (
  client: SupabaseClient<Database>,
  email: string
) => {
  const { data, error } = await client
    .from("profiles")
    .select("profile_id")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return data?.profile_id ?? null;
};

export const getProfile = async (
  client: SupabaseClient<Database>,
  profileId: string
) => {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();
  if (error) throw error;
  return data;
};
