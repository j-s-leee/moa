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
  console.log("getLoggedInUserIdWithRedirectUrl", data, error);
  console.log("redirectUrl", redirectUrl);
  if (error || data.user === null) throw redirect(redirectUrl);
  return data.user.id;
};
