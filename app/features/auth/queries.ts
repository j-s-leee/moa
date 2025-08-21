import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
import { redirect } from "react-router";

export const getLoggedInUserId = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.auth.getUser();
  if (error || data.user === null) throw redirect("/auth/login");
  return data.user.id;
};
